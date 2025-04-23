import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../types/models';
import User from '../models/User';
import { pubsub, EVENTS } from './pubsub';

interface UserArgs {
  id: string;
}

interface CreateUserArgs {
  name: string;
  email: string;
  gender?: string;
}

interface UpdateUserArgs extends Partial<CreateUserArgs> {
  id: string;
}

const resolvers: IResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => await User.find(),
    user: async (_, { id }: UserArgs): Promise<IUser | null> => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { name, email, gender }: CreateUserArgs): Promise<IUser> => {
      const user = new User({ name, email, gender });
      await user.save();

      //Publish the event
      await pubsub.publish(EVENTS.USER_CHANGED, {
        userChanged: {
          mutation: 'CREATED',
          node: user
        }
      });

      //Return the user
      return user;
    },

    updateUser: async (_, { id, name, email, gender }: UpdateUserArgs): Promise<IUser | null> => {
      const user = await User.findByIdAndUpdate(
        id,
        { name, email, gender },
        { new: true }
      );

      if (user) {
        //Publish the event
        await pubsub.publish(EVENTS.USER_CHANGED, {
          userChanged: {
            mutation: 'UPDATED',
            node: user
          }
        });
      }

      return user;
    },
    deleteUser: async (_, { id }: UserArgs): Promise<IUser | null> => {
      const user = await User.findByIdAndDelete(id);

      if (user) {
        //Publish the event
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

export default resolvers;
