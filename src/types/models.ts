import { Document } from 'mongoose';

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  NOT_SPECIFIED = 'NOT_SPECIFIED'
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
