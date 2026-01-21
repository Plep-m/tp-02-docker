#!/bin/bash

# Read postgres env file and export variables
export $(grep -v '^#' /pgadmin4/postgres.env | xargs)

# Generate servers.json using sed
sed -e "s/\${POSTGRES_DB}/${POSTGRES_DB}/g" \
    -e "s/\${POSTGRES_USER}/${POSTGRES_USER}/g" \
    /pgadmin4/servers.json.template > /pgadmin4/servers.json

# Generate pgpass file
echo "postgres:5432:*:${POSTGRES_USER}:${POSTGRES_PASSWORD}" > /pgpass
chmod 600 /pgpass

# Start pgAdmin
/entrypoint.sh
