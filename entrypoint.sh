#!/bin/sh
node node_modules/knex/bin/cli.js migrate:latest --knexfile dist/knexfile.js
exec node --import ./dist/src/telemetry.js dist/src/main.js