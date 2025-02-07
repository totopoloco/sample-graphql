const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const schema = makeExecutableSchema({ typeDefs, resolvers });

exports.schema = schema;