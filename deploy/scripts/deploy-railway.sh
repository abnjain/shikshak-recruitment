#!/bin/bash
# ===================================================
# Deploy to Railway (alternative to Render)
# Railway offers free tier with PostgreSQL
# CLI: npm i -g @railway/cli
# ===================================================
set -e

echo "=== Logging in to Railway ==="
railway login

echo "=== Linking project ==="
railway link

echo "=== Deploying Backend ==="
cd backend
railway up --service shikshak-backend
cd ..

echo "=== Deploying Frontend ==="
cd frontend
railway up --service shikshak-frontend
cd ..

echo "=== Setting environment variables ==="
railway variables --service shikshak-backend --set \
  JWT_SECRET=$JWT_SECRET \
  GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

echo "=== Deploy complete! ==="
railway list
