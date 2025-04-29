import { IResolvers } from '@graphql-tools/utils';
import { userResolvers } from './user';
import { sampleResolvers } from './sample';
import { historyResolvers } from './history';

// Merge the resolvers
const resolvers: IResolvers = {
  Query: {
    ...(userResolvers.Query || {}),
    ...(sampleResolvers.Query || {}),
    ...(historyResolvers.Query || {}),
  },
  Mutation: {
    ...(userResolvers.Mutation || {}),
    ...(sampleResolvers.Mutation || {}),
  },
  Subscription: {
    ...(userResolvers.Subscription || {}),
    ...(sampleResolvers.Subscription || {})
  },
  // For field resolvers, directly reference the object rather than spreading
  Sample: sampleResolvers.Sample || {},
  User: userResolvers.User || {}, // If you have User field resolvers
} as IResolvers;

export default resolvers;