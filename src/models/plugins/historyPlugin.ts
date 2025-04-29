import mongoose, { Schema, Document, Model, Query } from 'mongoose';
import History from '../History';

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
  
  // Check if this model should be tracked based on TRACKABLES env var
  const trackables = process.env.TRACKABLES?.split(',') || [];
  const shouldTrack = trackables.includes(modelName);
  
  if (!shouldTrack) {
    console.log(`History tracking disabled for model: ${modelName}`);
    return; // Skip setting up the plugin if the model is not trackable
  }
  
  console.log(`Initializing history plugin for model: ${modelName}`);

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
        const historyEntry = new History({
          originalId: this._originalDoc._id,
          modelName, // Track which model this history belongs to
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
            const historyRecord = new History({
              originalId: this._originalDoc._id,
              modelName,
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
      const historyRecord = new History({
        originalId: this._docToDelete._id,
        modelName,
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
      const historyRecord = new History({
        originalId: this._docToDelete._id,
        modelName,
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