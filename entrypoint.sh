#!/bin/sh
# ====================================
# Shikshak Recruitment - Entrypoint
# Starts Nginx (frontend) and Java (backend)
# ====================================

set -e

# Start nginx in background
echo "Starting nginx..."
nginx -g "daemon on;"

# Start Spring Boot backend
echo "Starting Spring Boot application..."
exec java -jar /app/app.jar
