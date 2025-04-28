import createModel from './createModel';
import { ISample, IUser, SampleType } from '../types/models';
import mongoose from 'mongoose';

const sampleSchema = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sampleType: {
    type: String,
    required: true,
    enum: Object.values(SampleType),
    default: SampleType.PURPOSEIVE
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
};

export default createModel<ISample>('Sample', sampleSchema);