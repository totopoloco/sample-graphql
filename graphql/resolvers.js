const { PubSub } = require('graphql-subscriptions');
const User = require('../models/User');
const { pubsub, EVENTS } = require('./pubsub');

const resolvers = {

  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
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
    updateUser: async (_, { id, name, email }) => {
      const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });

      //Publish the event
      await pubsub.publish(EVENTS.USER_CHANGED, {
        userChanged: {
          mutation: 'UPDATED',
          node: user
        }
      });

      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findOneAndDelete(id);

      //Publish the event
      await pubsub.publish(EVENTS.USER_CHANGED, {
        userChanged: {
          mutation: 'DELETED',
          node: user
        }
      });

      return user;
    },
  },
  Subscription: {
    userChanged: {
      subscribe: () => {
        return pubsub.asyncIterator([EVENTS.USER_CHANGED]);
      }
    }
  }
};

module.exports = resolvers;