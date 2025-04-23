const mongoose = require('mongoose');

function historyPlugin(schema, options = {}) {
  const modelName = options.modelName || schema.constructor.modelName || 'UnknownModel';
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
    // Disable automatic timestamps
    timestamps: false
  });

  // Create or get history model
  let HistoryModel;
  try {
    HistoryModel = mongoose.model(historyModelName);
  } catch (error) {
    HistoryModel = mongoose.model(historyModelName, historySchema);
  }

  // Pre findOneAndUpdate middleware
  schema.pre('findOneAndUpdate', async function(next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      this._originalDoc = docToUpdate.toObject();
    }
    next();
  });

  // Post findOneAndUpdate middleware
  schema.post('findOneAndUpdate', async function(doc) {
    if (this._originalDoc && doc) {
      // Determine which fields have changed
      const oldValues = {};
      const newValues = {};
      
      // Extract fields that were actually changed
      Object.keys(schema.obj).forEach(field => {
        if (JSON.stringify(this._originalDoc[field]) !== JSON.stringify(doc[field])) {
          oldValues[field] = this._originalDoc[field];
          newValues[field] = doc[field];
        }
      });
      
      // Only create history if something changed
      if (Object.keys(oldValues).length > 0) {
        // Create a new history entry with only the specified fields
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

  // Pre findByIdAndUpdate middleware
  schema.pre('findByIdAndUpdate', async function(next) {
    const id = this.getQuery()._id || this.getQuery();
    const docToUpdate = await this.model.findById(id);
    if (docToUpdate) {
      this._originalDoc = docToUpdate.toObject();
    }
    next();
  });

  // Post findByIdAndUpdate middleware
  schema.post('findByIdAndUpdate', async function(doc) {
    if (this._originalDoc && doc) {
      const oldValues = {};
      const newValues = {};
      
      Object.keys(schema.obj).forEach(field => {
        if (JSON.stringify(this._originalDoc[field]) !== JSON.stringify(doc[field])) {
          oldValues[field] = this._originalDoc[field];
          newValues[field] = doc[field];
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
  });

  // Pre findOneAndDelete middleware
  schema.pre('findOneAndDelete', async function(next) {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete) {
      this._docToDelete = docToDelete.toObject();
    }
    next();
  });

  // Post findOneAndDelete middleware
  schema.post('findOneAndDelete', async function(result) {
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

module.exports = historyPlugin;