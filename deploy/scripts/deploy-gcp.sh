#!/bin/bash
# ===================================================
# Deploy to Google Cloud Run
# Prerequisites:
#   gcloud auth login
#   gcloud config set project YOUR_PROJECT_ID
# ===================================================
set -e

PROJECT_ID="${GCP_PROJECT_ID:-shikshak-recruitment}"
REGION="${GCP_REGION:-us-central1}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
JWT_SECRET="${JWT_SECRET:-your-secret}"

echo "=== Enabling required APIs ==="
gcloud services enable cloudbuild.googleapis.com run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com --project $PROJECT_ID

echo "=== Creating Cloud SQL instance (PostgreSQL) ==="
gcloud sql instances create shikshak-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=$REGION \
  --project=$PROJECT_ID || echo "DB instance may already exist"

gcloud sql databases create shikshak_recruitment \
  --instance=shikshak-db \
  --project=$PROJECT_ID || true

gcloud sql users set-password postgres \
  --instance=shikshak-db \
  --password=$DB_PASSWORD \
  --project=$PROJECT_ID || true

DB_CONNECTION_NAME=$(gcloud sql instances describe shikshak-db \
  --project=$PROJECT_ID \
  --format="value(connectionName)")

echo "=== Building & deploying Backend to Cloud Run ==="
gcloud builds submit ./backend \
  --tag gcr.io/$PROJECT_ID/shikshak-backend \
  --project=$PROJECT_ID

gcloud run deploy shikshak-backend \
  --image gcr.io/$PROJECT_ID/shikshak-backend \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances=$DB_CONNECTION_NAME \
  --set-env-vars="SPRING_DATASOURCE_URL=jdbc:postgresql:///shikshak_recruitment?cloudSqlInstance=$DB_CONNECTION_NAME&socketFactory=com.google.cloud.sql.postgres.SocketFactory" \
  --set-env-vars="SPRING_DATASOURCE_USERNAME=postgres" \
  --set-env-vars="SPRING_DATASOURCE_PASSWORD=$DB_PASSWORD" \
  --set-env-vars="JWT_SECRET=$JWT_SECRET" \
  --project=$PROJECT_ID

BACKEND_URL=$(gcloud run services describe shikshak-backend \
  --region=$REGION \
  --project=$PROJECT_ID \
  --format="value(status.url)")

echo "=== Building & deploying Frontend to Cloud Run ==="
# Build frontend with backend URL
cd frontend
gcloud builds submit . \
  --tag gcr.io/$PROJECT_ID/shikshak-frontend \
  --project=$PROJECT_ID

gcloud run deploy shikshak-frontend \
  --image gcr.io/$PROJECT_ID/shikshak-frontend \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --set-env-vars="VITE_API_BASE_URL=$BACKEND_URL" \
  --project=$PROJECT_ID

FRONTEND_URL=$(gcloud run services describe shikshak-frontend \
  --region=$REGION \
  --project=$PROJECT_ID \
  --format="value(status.url)")

cd ..

echo ""
echo "=========================================="
echo " Deployment Complete!"
echo "=========================================="
echo " Frontend: $FRONTEND_URL"
echo " Backend:  $BACKEND_URL"
echo " Custom Domain (frontend): shikshak.abnjain.me"
echo " Custom Domain (backend):  shikshak.abnjain.me/api/v1"
echo "=========================================="
