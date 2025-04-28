import { IUser, ISample } from '../../types/models';

export interface UserArgs {
  id: string;
}

export interface SampleArgs {
  id: string;
}

export interface CreateUserArgs {
  name: string;
  email: string;
  gender?: string;
}

export interface CreateSampleArgs {
  name: string;
  description: string;
  sampleType: string;
  owner: string;
}

export interface UpdateSampleArgs extends Partial<CreateSampleArgs> {
  id: string;
}

export interface UpdateUserArgs extends Partial<CreateUserArgs> {
  id: string;
}