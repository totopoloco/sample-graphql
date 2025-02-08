const typeDefs = `
enum UserMutationType {
  CREATED
  UPDATED
  DELETED
}

type UserSubscriptionPayload {
  mutation: UserMutationType!
  node: User!
}

type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  users: [User]
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User
  updateUser(id: ID!, name: String, email: String): User
  deleteUser(id: ID!): User
}

type Subscription {
  userChanged: UserSubscriptionPayload!
}
`;

module.exports = typeDefs;