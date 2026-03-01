#!/bin/sh

# IMPORTANT: Wait for the database to be available. 
# This is crucial because the container starts before the external database is fully ready.
# We'll use a simple loop to check the host/port before attempting migration.
# We're using the standard 'pg_isready' command available in the 'postgresql-client' package.

echo "Waiting for PostgreSQL to become available..."

# Replace 'POSTGRES_HOST' and 'POSTGRES_PORT' with your actual environment variable names
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT"; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - running migrations now!"

# 1. Run migrations
npm run typeorm:migration:run:prod

# check to stop the process if the migration fails.
if [ $? -ne 0 ]; then
  echo "Migration failed! Exiting..."
  exit 1
fi

# 2. Start the NestJS application
echo "Starting NestJS server..."
exec npm run start:prod