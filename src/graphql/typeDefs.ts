export const typeDefs = `#graphql
  """
  User Mutation Type.
  When a user is created, updated or deleted, 
  the server will send a message to the client.
  """
  enum UserMutationType {
    CREATED
    UPDATED
    DELETED
  }

  enum Gender {
    FEMALE
    MALE
    OTHER
  }

  """
  User Subscription Payload.
  The server will send a message to the client
  """
  type UserSubscriptionPayload {
    mutation: UserMutationType!
    node: User!
  }

  """
  User Type.
  Maps to a user in the database.
  """
  type User {
    "The user's unique identifier."
    id: ID!
    "The user's name."
    name: String!
    "The user's email."
    email: String!
    "The user's gender."
    gender: String!
  }

  """
  Query Type.
  All queries that can be made to the server.
  """
  type Query {
    "Get all users."
    users: [User]
    "Get a user by their unique identifier."
    user(id: ID!): User
  }

  """
  Mutation Type.
  All mutations that can be made to the server.
  """
  type Mutation {
    "Create a new user."
    createUser(name: String!, email: String!, gender: Gender): User
    "Update an existing user."
    updateUser(id: ID!, name: String, email: String, gender: Gender): User
    "Delete an existing user."
    deleteUser(id: ID!): User
  }

  """
  Subscription Type.
  All subscriptions that can be made to the server.
  """
  type Subscription {
    "Subscribe to changes in the user's state."
    userChanged: UserSubscriptionPayload!
  }
`;
