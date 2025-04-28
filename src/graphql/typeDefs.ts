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

  enum SampleType {
    PURPOSEIVE
    CONVENIENCE
    SNOWBALL
    THEORICAL
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

  type Sample {
    "The sample's unique identifier."
    id: ID!
    "The sample's name."
    name: String!
    "The sample's description."
    description: String!
    "The sample's type."
    sampleType: SampleType!
    "The sample's owner."
    owner: User!
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
    "Get all samples."
    samples: [Sample]
    "Get a sample by their unique identifier."
    sample(id: ID!): Sample
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

    "Create a new sample."
    createSample(name: String!, description: String!, sampleType: SampleType!, owner: ID!): Sample
    "Update an existing sample."
    updateSample(id: ID!, name: String, description: String, sampleType: SampleType, owner: ID): Sample
    "Delete an existing sample."
    deleteSample(id: ID!): Sample
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
