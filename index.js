require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { mongoose } = require('mongoose');
const { typeDefs } = require('./graphql/typeDefs');
const { resolvers } = require('./graphql/resolvers');
const cors = require('cors');
const bodyParser = require('body-parser');

const startServer = async () => {
  const contextPath = process.env.CONTEXT_PATH || '/graphql';

  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use(
    contextPath,
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }
    ));

  const PORT = process.env.PORT || 4000;

  mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true,
    family: 4
  }).then(() => {
    console.log('[📚] MongoDB connected');
    app.listen(PORT, () => {
      console.log(`[🚀] Server ready at http://localhost:${PORT}${contextPath}`);
    });
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

}

startServer();