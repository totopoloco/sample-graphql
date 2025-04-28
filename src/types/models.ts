import e from 'express';
import { Document } from 'mongoose';

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER'
}

export enum SampleType {
  PURPOSEIVE = 'PURPOSEIVE',
  CONVENIENCE = 'CONVENIENCE',
  SNOWBALL = 'SNOWBALL',
  THEORICAL = 'THEORIACAL',
}

export interface ISample extends Document {
  name: string;
  description: string;
  sampleType: SampleType;
  owner: IUser
}

export interface IUser extends Document {
  name: string;
  email: string;
  gender: Gender;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHistory {
  originalId: string;
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  operation: 'UPDATE' | 'DELETE';
  historyAt: Date;
  changedBy: string;
}
