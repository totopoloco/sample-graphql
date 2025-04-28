import { IResolvers } from '@graphql-tools/utils';
import Sample from '../../models/Sample';
import User from '../../models/User';
import { ISample, IUser } from '../../types/models';
import { SampleArgs, CreateSampleArgs, UpdateSampleArgs } from './types';

export const sampleResolvers: IResolvers = {
  Query: {
    samples: async (): Promise<ISample[]> => await Sample.find(),
    sample: async (_: any, { id }: SampleArgs): Promise<ISample | null> => await Sample.findById(id),
  },
  
  Mutation: {
    createSample: async (_: any, { name, description, sampleType, owner }: CreateSampleArgs): Promise<ISample> => {
      const sample = new Sample({ name, description, sampleType, owner });
      await sample.save();
      return sample;
    },
    
    updateSample: async (_: any, { id, name, description, sampleType, owner }: UpdateSampleArgs): Promise<ISample | null> => {
      const sample = await Sample.findByIdAndUpdate(
        id,
        { name, description, sampleType, owner },
        { new: true }
      );
      return sample;
    },
    
    deleteSample: async (_: any, { id }: SampleArgs): Promise<ISample | null> => {
      const sample = await Sample.findByIdAndDelete(id);
      return sample;
    },
  },
  
  Sample: {
    owner: async (sample: ISample): Promise<IUser | null> => {
      return await User.findById(sample.owner);
    }
  }
};