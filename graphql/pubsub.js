const { PubSub } = require('graphql-subscriptions');

// Create a new instance and export it
const pubsub = new PubSub();

// Add a constant for the subscription event

// Define subscription events
const EVENTS = {
  USER_CHANGED: 'USER_CHANGED'
};

module.exports = { pubsub, EVENTS };