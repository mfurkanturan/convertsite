#!/bin/sh
set -e

echo "Running migrations..."
node --import tsx src/entrypoints/migrate.ts

echo "Starting engine service on port 3002..."
node --import tsx src/entrypoints/engine.ts &

echo "Starting worker process..."
node --import tsx src/entrypoints/worker.ts &

echo "Starting Fastify API on port 3001..."
exec node --import tsx src/entrypoints/api.ts
