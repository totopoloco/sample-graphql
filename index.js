require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { mongoose } = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { schema } = require('./graphql/mergertd');
const { createServer } = require('http');


const { WebSocketServer } = require('ws');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { useServer } = require('graphql-ws/use/ws');
const { EventEmitter, on } = require('events');
// Add PubSub import
const pubsub = require('./graphql/pubsub');

// Increase event listeners limit
EventEmitter.defaultMaxListeners = 20;

const startServer = async () => {
  const contextPath = process.env.CONTEXT_PATH || '/graphql';

  const app = express();
  const httpServer = createServer(app);

  // Create a WebSocket server instance
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: contextPath
  });

  // Set up GraphQL WebSocket server
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        console.log('Client connected to WebSocket');
        return true;
      },
      onDisconnect: async (ctx) => {
        console.log('Client disconnected from WebSocket');
      },
      context: async () => {
        return {
          pubsub
        };
      }
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    contextPath,
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => ({ pubsub }),
    })
  );

  const PORT = process.env.PORT || 4000;

  await mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true,
    family: 4
  });
  console.log('[📚] MongoDB connected');
  
  httpServer.listen(PORT, () => {
    console.log(`[🚀] Server ready at http://localhost:${PORT}${contextPath}`);
    console.log(`[🔌] WebSocket server ready at ws://localhost:${PORT}${contextPath}`);
  });

}

startServer();