import { PubSub } from 'graphql-subscriptions';

// Create a new instance and export it
export const pubsub = new PubSub();

// Define subscription events
export enum EVENTS {
  USER_CHANGED = 'USER_CHANGED'
}
