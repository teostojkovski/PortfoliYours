#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL}"

echo "Waiting for database to be ready..."
sleep 5

echo "Running Prisma db push..."
if [ -n "$DATABASE_URL" ]; then
  prisma db push --accept-data-loss --url "$DATABASE_URL" || true
else
  echo "WARNING: DATABASE_URL not set, skipping db push"
fi

echo "Starting Next.js server..."
exec node server.js

