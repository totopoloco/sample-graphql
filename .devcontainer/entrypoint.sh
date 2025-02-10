#!/bin/bash
set -e

# Check if node_modules exists, if not call mkdir -p
if [ ! -d "/workspace/node_modules" ]; then
  sudo mkdir -p /workspace/node_modules/.pnpm
fi

# Change ownership of the node_modules directory
sudo chown -R $USER:$USER /workspace/node_modules
sudo chown -R $USER:$USER /workspace/node_modules/.pnpm
# Give all permissions to the node_modules directory
chmod -R 0777 /workspace/node_modules
cd /workspace
# Install packages using pnpm
pnpm install

# Check if we need to approve builds
sudo mv /usr/local/bin/approve-builds.exp /workspace
sudo chown $USER:$USER /workspace/approve-builds.exp
expect ./approve-builds.exp