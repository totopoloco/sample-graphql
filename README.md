# GraphQL with MongoDB - Development Setup

## Overview

This repository provides a complete setup for developing a **GraphQL backend with MongoDB** using **Node.js**. The project is designed for local development with **Visual Studio Code** and includes a **Docker Compose** configuration to run MongoDB easily.

## Features

- **GraphQL API**: A sample CRUD operations is provide (User).
- **MongoDB Integration**: Uses `mongoose` for schema modeling and database interactions.
- **Dockerized MongoDB**: Includes a `docker-compose.yml` file to run a MongoDB instance on port `27017`.
- **Development Tools**:
  - **pnpm** for dependency management.
  - **dotenv** for managing environment variables.
  - **Apollo GraphQL** for GraphQL implementation
- **VS Code Integration**:
  - Workspace settings in `.vscode/settings.json`.
  - Debugging support with a `launch.json` configuration.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Latest version is recommended)

## Setup Instructions

1. **Clone the Repository (via SSH)**  
   
   If you haven't cloned the repository yet, run the following commands:

   ```sh
   git clone git@github.com:totopoloco/sample-graphql.git
   cd sample-graphql

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
├── graphql/            # GraphQL
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
```