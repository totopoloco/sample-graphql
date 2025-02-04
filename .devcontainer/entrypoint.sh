#!/bin/bash
set -e

# Change ownership of the node_modules directory
sudo chown -R $USER:$USER /workspace/node_modules

# Execute the container's main process (what's set as CMD in the Dockerfile)
exec "$@"