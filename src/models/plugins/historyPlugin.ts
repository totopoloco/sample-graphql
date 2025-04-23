import mongoose, { Schema, Document, Model, Query } from 'mongoose';

interface HistoryPluginOptions {
  modelName?: string;
}

// Define the document type for middleware context
type QueryMiddlewareContext = {
  getQuery: () => any;
  model: Model<any>;
  _originalDoc?: any;
  _docToDelete?: any;
};

function historyPlugin(schema: Schema, options: HistoryPluginOptions = {}): void {
  const modelName = options.modelName || 'UnknownModel';
  console.log(`Initializing history plugin for model: ${modelName}`);
  const historyModelName = `${modelName}History`;

  // Create a simplified history schema
  const historySchema = new mongoose.Schema({
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: modelName
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    operation: {
      type: String,
      enum: ['UPDATE', 'DELETE'],
      required: true
    },
    historyAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: String,
      default: 'system'
    }
  }, {
    timestamps: false
  });

  // Create or get history model
  let HistoryModel: mongoose.Model<any>;
  try {
    HistoryModel = mongoose.model(historyModelName);
  } catch (error) {
    HistoryModel = mongoose.model(historyModelName, historySchema);
  }

  // Pre findOneAndUpdate middleware
  schema.pre('findOneAndUpdate', async function(this: QueryMiddlewareContext, next: Function) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      this._originalDoc = docToUpdate.toObject();
    }
    next();
  });

  // Post findOneAndUpdate middleware
  schema.post('findOneAndUpdate', async function(this: QueryMiddlewareContext, doc: any) {
    if (this._originalDoc && doc) {
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};
      
      Object.keys(schema.obj).forEach(field => {
        if (JSON.stringify(this._originalDoc[field]) !== JSON.stringify(doc[field])) {
          oldValues[field] = this._originalDoc[field];
          newValues[field] = doc[field];
        }
      });
      
      if (Object.keys(oldValues).length > 0) {
        const historyEntry = new HistoryModel({
          originalId: this._originalDoc._id,
          operation: 'UPDATE',
          oldValues,
          newValues,
          historyAt: new Date()
        });
        
        await historyEntry.save();
      }
    }
  });

  // Handle findByIdAndUpdate using updateOne middleware
  schema.pre('updateOne', async function(this: QueryMiddlewareContext, next: Function) {
    const query = this.getQuery();
    if (query._id) {
      const docToUpdate = await this.model.findById(query._id);
      if (docToUpdate) {
        this._originalDoc = docToUpdate.toObject();
      }
    }
    next();
  });

  schema.post('updateOne', async function(this: QueryMiddlewareContext, result: any) {
    if (this._originalDoc) {
      const query = this.getQuery();
      if (query._id) {
        const updatedDoc = await this.model.findById(query._id);
        if (updatedDoc) {
          const oldValues: Record<string, any> = {};
          const newValues: Record<string, any> = {};
          
          Object.keys(schema.obj).forEach(field => {
            if (JSON.stringify(this._originalDoc[field]) !== JSON.stringify(updatedDoc[field])) {
              oldValues[field] = this._originalDoc[field];
              newValues[field] = updatedDoc[field];
            }
          });
          
          if (Object.keys(oldValues).length > 0) {
            const historyRecord = new HistoryModel({
              originalId: this._originalDoc._id,
              operation: 'UPDATE',
              oldValues,
              newValues,
              historyAt: new Date()
            });
            
            await historyRecord.save();
          }
        }
      }
    }
  });

  // Pre findOneAndDelete middleware
  schema.pre('findOneAndDelete', async function(this: QueryMiddlewareContext, next: Function) {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete) {
      this._docToDelete = docToDelete.toObject();
    }
    next();
  });

  // Post findOneAndDelete middleware
  schema.post('findOneAndDelete', async function(this: QueryMiddlewareContext, result: any) {
    if (this._docToDelete) {
      const historyRecord = new HistoryModel({
        originalId: this._docToDelete._id,
        operation: 'DELETE',
        oldValues: this._docToDelete,
        newValues: {},
        historyAt: new Date()
      });
      
      await historyRecord.save();
    }
  });

  // Handle findByIdAndDelete using deleteOne middleware
  schema.pre('deleteOne', async function(this: QueryMiddlewareContext, next: Function) {
    const query = this.getQuery();
    if (query._id) {
      const docToDelete = await this.model.findById(query._id);
      if (docToDelete) {
        this._docToDelete = docToDelete.toObject();
      }
    }
    next();
  });

  schema.post('deleteOne', async function(this: QueryMiddlewareContext, result: any) {
    if (this._docToDelete) {
      const historyRecord = new HistoryModel({
        originalId: this._docToDelete._id,
        operation: 'DELETE',
        oldValues: this._docToDelete,
        newValues: {},
        historyAt: new Date()
      });
      
      await historyRecord.save();
    }
  });
}

export default historyPlugin;
