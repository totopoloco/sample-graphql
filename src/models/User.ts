import createModel from './createModel';
import { IUser, Gender } from '../types/models';

const userSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(Gender),
    default: Gender.OTHER
  }
};

export default createModel<IUser>('User', userSchema);