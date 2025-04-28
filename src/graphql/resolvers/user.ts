import { IResolvers } from '@graphql-tools/utils';
import User from '../../models/User';
import { IUser } from '../../types/models';
import { pubsub, EVENTS } from '../pubsub';
import { UserArgs, CreateUserArgs, UpdateUserArgs } from './types';

export const userResolvers: IResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => await User.find(),
    user: async (_: any, { id }: UserArgs): Promise<IUser | null> => await User.findById(id),
  },
  
  Mutation: {
    createUser: async (_: any, { name, email, gender }: CreateUserArgs): Promise<IUser> => {
      const user = new User({ name, email, gender });
      await user.save();

      await pubsub.publish(EVENTS.USER_CHANGED, {
        userChanged: {
          mutation: 'CREATED',
          node: user
        }
      });

      return user;
    },

    updateUser: async (_: any, { id, name, email, gender }: UpdateUserArgs): Promise<IUser | null> => {
      const user = await User.findByIdAndUpdate(
        id,
        { name, email, gender },
        { new: true }
      );

      if (user) {
        await pubsub.publish(EVENTS.USER_CHANGED, {
          userChanged: {
            mutation: 'UPDATED',
            node: user
          }
        });
      }

      return user;
    },
    
    deleteUser: async (_: any, { id }: UserArgs): Promise<IUser | null> => {
      const user = await User.findByIdAndDelete(id);

      if (user) {
        await pubsub.publish(EVENTS.USER_CHANGED, {
          userChanged: {
            mutation: 'DELETED',
            node: user
          }
        });
      }

      return user;
    },
  },
  
  Subscription: {
    userChanged: {
      subscribe: () => pubsub.asyncIterator([EVENTS.USER_CHANGED])
    }
  }
};