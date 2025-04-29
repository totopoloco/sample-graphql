import mongoose, { Schema } from 'mongoose';
import { IHistory } from '../types/models';

const historySchema = new Schema({
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  modelName: {
    type: String,
    required: true,
    index: true
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
    default: Date.now,
    index: true
  },
  changedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: false
});

// Create indexes for common query patterns
historySchema.index({ originalId: 1, historyAt: -1 });
historySchema.index({ modelName: 1, historyAt: -1 });

const History = mongoose.model<IHistory>('History', historySchema);
export default History;