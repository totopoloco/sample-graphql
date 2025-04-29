# GraphQL with MongoDB - Development Setup

## Overview

This repository provides a complete setup for developing a **GraphQL backend with MongoDB** using **Node.js**. The project is designed for local development with **Visual Studio Code** and includes a **Docker Compose** configuration to run MongoDB easily.

## Features

- **GraphQL API**: CRUD operations for sample entities (User, Sample).
- **MongoDB Integration**: Uses `mongoose` for schema modeling and database interactions.
- **History Tracking System**: Automatic change tracking for selected models stored in a unified collection.
- **Dockerized MongoDB**: Includes a `docker-compose.yml` file to run a MongoDB instance on port `27017`.
- **Development Tools**:
  - **pnpm** for dependency management.
  - **dotenv** for managing environment variables.
  - **Apollo GraphQL** for GraphQL implementation
  - **MongoDB Playground** scripts for database inspection and testing
- **VS Code Integration**:
  - Workspace settings in `.vscode/settings.json`.
  - Debugging support with a `launch.json` configuration.
  - MongoDB for VS Code extension integration

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Latest version is recommended)

## Setup Instructions

1. **Clone the Repository (via SSH)**  
   
   If you haven't cloned the repository yet, run the following commands:

   ```sh
   git clone git@github.com:totopoloco/sample-graphql.git
   cd sample-graphql
   ```

2. **Check WSL integration is enabled in Docker Desktop**

   Please go to the settings page of Docker Desktop and select the WSL integration option. Ensure that the checkbox '*Enable integration with my default WSL distro*' is selected and that '*Ubuntu*' is chosen.

3. **Open the project**
  
   The project should then be opened in MS Visual Studio Code, where the IDE will create the development environment.

## Code structure
```
sample-graphql/
├── .devcontainer/      # Development environment configuration
├── index.js            # Main entry point
├── models/             # Mongoose schemas
│   ├── User.ts         # User model definition
│   ├── Sample.ts       # Sample model definition
│   ├── History.ts      # History model for change tracking
│   └── plugins/        # Mongoose plugins
│       └── historyPlugin.ts  # Change tracking plugin
├── graphql/            # GraphQL
│   ├── resolvers/      # Domain-specific resolvers
│   │   ├── index.ts    # Combines all resolvers
│   │   ├── user.ts     # User-related resolvers
│   │   ├── sample.ts   # Sample-related resolvers
│   │   └── history.ts  # History query resolvers
│   ├── typeDefs.ts     # GraphQL type definitions
│   └── mergedSchema.ts # Combined schema
├── mongo_playground/   # MongoDB playground scripts
│   ├── playground-1.mongodb.js      # View all history records
│   └── playground-model.mongodb.js  # Filter history by model
├── .vscode/            # VS Code workspace settings
├── .env                # Environment variables
├── package.json
├── README.md
├── .gitignore
└── LICENSE             # MIT
```

## Environment variables

It is important to note that the intercommunication between services in Docker Desktop is specified by the service name.
The contents of the .env file are as follows:
```
PORT=4000
MONGODB_URI=mongodb://root:example@mongodb:27017/mydatabase?authSource=admin
CONTEXT_PATH=/graphql
TRACKABLES=User,Sample
```

## History Tracking System

The application includes an automated history tracking system for monitoring changes to database entities.

### Features

- **Unified History Collection**: All changes are stored in a single `histories` collection
- **Configurable Tracking**: Control which models are tracked via the `TRACKABLES` environment variable
- **Operation Logging**: Captures UPDATE and DELETE operations with before/after values
- **GraphQL Integration**: Query history data through the GraphQL API

### Using History Tracking

1. **Configure Trackable Models**

   Set which models should have change tracking in your `.env` file:
   ```
   TRACKABLES=User,Sample
   ```

2. **Query History via GraphQL**

   ```graphql
   query GetModelHistory {
     history(modelName: "Sample", sortOrder: DESC) {
       id
       originalId
       operation
       oldValues
       newValues
       historyAt
       changedBy
     }
   }
   ```

3. **Explore History with MongoDB Playground Scripts**

   - Use `playground-all.mongodb.js` to view all history records
   - Use `playground-model.mongodb.js` to filter history by model type
   - Use `playground-delete-history.mongodb.js` to delete all the records by model name

## GraphQL API Examples

### Query Samples with Owner Information

```graphql
query Samples {
  samples {
    id
    name
    description
    sampleType
    owner {
      email
    }
  }
}
```

### Query History Records

```graphql
query GetHistory {
  history(modelName: "User", sortOrder: DESC) {
    id
    originalId
    operation
    oldValues
    newValues
    historyAt
  }
}
```