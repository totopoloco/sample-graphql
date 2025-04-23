import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { schema } from './graphql/mergedSchema';
import { pubsub } from './graphql/pubsub';
import { Context } from './types/context';
import { PubSub } from 'graphql-subscriptions';

// Create Express app and HTTP server
const app = express();
const contextPath = process.env.CONTEXT_PATH || '/graphql';
const httpServer = createServer(app);

// Initialize Apollo Server
const server = new ApolloServer<Context>({
  schema,
  introspection: true,
});

const startServer = async () => {
  // Start Apollo Server
  await server.start();
  
  // Apply middleware
  app.use(
    contextPath,
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    (req: Request, res: Response, next: NextFunction) => {
      const handler = expressMiddleware(server, {
        context: async () => ({ pubsub })
      });
      return (handler as any)(req, res, next);
    }
  );
  
  // Create a WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: contextPath,
  });
  
  // Basic subscription handling without graphql-ws dependency
  wsServer.on('connection', (socket) => {
    socket.on('message', (message) => {
      try {
        // This is a simplified example - in production, you'd use a library
        console.log('WebSocket message received', message.toString());
      } catch (err) {
        console.error('Error handling WebSocket message', err);
      }
    });
  });
  
  // Connect to MongoDB
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
  
  await mongoose.connect(MONGODB_URI);
  console.log('[📚] MongoDB connected');
  
  // Start HTTP server
  httpServer.listen(PORT, () => {
    console.log(`[🚀] Server ready at http://localhost:${PORT}${contextPath}`);
    console.log(`[🔌] WebSocket server available at ws://localhost:${PORT}${contextPath}`);
  });
};

// Start the server
startServer().catch(err => console.error('Failed to start server:', err));
