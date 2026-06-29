#!/bin/bash
# ===================================================
# Deploy to Render via docker-compose
# Prerequisites:
#   1. Create a Render Blueprint or use the Dashboard
#   2. Set environment variables in Render dashboard
# ===================================================
set -e

echo "=== Building Docker images ==="
docker compose build

echo "=== Pushing to Render Registry ==="
# Log in to Render Docker registry
docker login registry.render.com -u $RENDER_EMAIL -p $RENDER_API_KEY

docker tag shikshak-recruitment-backend:latest registry.render.com/$RENDER_BACKEND_SERVICE_ID/web:latest
docker tag shikshak-recruitment-frontend:latest registry.render.com/$RENDER_FRONTEND_SERVICE_ID/web:latest

docker push registry.render.com/$RENDER_BACKEND_SERVICE_ID/web:latest
docker push registry.render.com/$RENDER_FRONTEND_SERVICE_ID/web:latest

echo "=== Triggering deploy via API ==="
curl -X POST "https://api.render.com/v1/services/$RENDER_BACKEND_SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'

curl -X POST "https://api.render.com/v1/services/$RENDER_FRONTEND_SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'

echo "=== Deploy triggered! ==="
echo "Backend: https://dashboard.render.com/web/$RENDER_BACKEND_SERVICE_ID"
echo "Frontend: https://dashboard.render.com/web/$RENDER_FRONTEND_SERVICE_ID"
