#!/bin/sh
set -e

echo "[Entrypoint] Running migrations..."
npx sequelize-cli db:migrate

echo "[Entrypoint] Running seeders..."
npx sequelize-cli db:seed:all

echo "[Entrypoint] Starting server..."
exec node src/server.js
