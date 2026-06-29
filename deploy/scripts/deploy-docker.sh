#!/bin/bash
# ===================================================
# One-command deploy with Docker Compose (for VPS / self-hosted)
# ===================================================
set -e

echo "=== Creating .env from template ==="
if [ ! -f .env ]; then
  cp backend/.env.example .env
  echo "Created .env — please edit it with your secrets!"
fi

echo "=== Pulling latest images ==="
docker compose pull

echo "=== Starting services ==="
docker compose up -d --build

echo "=== Checking health ==="
sleep 5

if curl -sf http://localhost/api/v1/public/jobs > /dev/null 2>&1; then
  echo "✅ Backend is healthy!"
else
  echo "⚠️ Backend not yet responding — check logs with: docker compose logs backend"
fi

if curl -sf http://localhost/health > /dev/null 2>&1; then
  echo "✅ Frontend is healthy!"
else
  echo "⚠️ Frontend not yet responding — check logs with: docker compose logs frontend"
fi

echo ""
echo "=========================================="
echo " Deployed successfully!"
echo "=========================================="
echo " Frontend: http://localhost"
echo " Backend:  http://localhost/api/v1"
echo ""
echo " For production with custom domain:"
echo "   1. Point DNS (shikshak.abnjain.me) to your server IP"
echo "   2. Set up reverse proxy (Caddy / Nginx Proxy Manager)"
echo "   3. Configure SSL certificates"
echo "=========================================="
