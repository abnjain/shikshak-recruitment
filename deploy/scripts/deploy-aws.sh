#!/bin/bash
# ===================================================
# Deploy to AWS ECS with Fargate
# Prerequisites:
#   aws configure
#   Create ECR repositories: shikshak-backend, shikshak-frontend
# ===================================================
set -e

AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_BACKEND="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/shikshak-backend"
ECR_FRONTEND="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/shikshak-frontend"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
JWT_SECRET="${JWT_SECRET:-your-secret}"

echo "=== Logging in to ECR ==="
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "=== Creating RDS PostgreSQL ==="
aws rds create-db-instance \
  --db-instance-identifier shikshak-db \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username postgres \
  --master-user-password $DB_PASSWORD \
  --allocated-storage 20 \
  --publicly-accessible \
  --region $AWS_REGION || echo "DB instance may already exist"

echo "=== Building & pushing Backend image ==="
docker build -t shikshak-backend ./backend
docker tag shikshak-backend:latest $ECR_BACKEND:latest
docker push $ECR_BACKEND:latest

echo "=== Building & pushing Frontend image ==="
docker build -t shikshak-frontend ./frontend
docker tag shikshak-frontend:latest $ECR_FRONTEND:latest
docker push $ECR_FRONTEND:latest

echo ""
echo "=== Next Steps ==="
echo "1. Create an ECS cluster:"
echo "   aws ecs create-cluster --cluster-name shikshak-cluster --region $AWS_REGION"
echo ""
echo "2. Register task definitions and create services using:"
echo "   deploy/scripts/ecs-task-definitions.json"
echo ""
echo "3. Set up Application Load Balancer with:"
echo "   - Frontend target group on port 80"
echo "   - Backend target group on port 8080"
echo "   - Route53: shikshak.abnjain.me -> ALB"
echo ""
echo "4. Configure ACM SSL certificate for shikshak.abnjain.me"
echo ""
echo "Images pushed:"
echo "  Backend:  $ECR_BACKEND:latest"
echo "  Frontend: $ECR_FRONTEND:latest"
