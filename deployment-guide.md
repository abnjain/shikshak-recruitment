# Deployment Guide - Shikshak Recruitment Portal

This guide covers all deployment options for the Shikshak Recruitment Portal, from local development to production-grade cloud deployments. It also explains how to generate and configure every required environment variable.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables Reference](#environment-variables-reference)
  - [Generating a JWT Secret](#generating-a-jwt-secret)
  - [Obtaining a Google OAuth Client ID](#obtaining-a-google-oauth-client-id)
  - [Setting up Gmail SMTP](#setting-up-gmail-smtp)
  - [Complete Variable Reference Table](#complete-variable-reference-table)
- [Deployment Options](#deployment-options)
  - [1. Docker Compose (VPS / Self-Hosted)](#1-docker-compose-vps--self-hosted)
  - [2. Kubernetes (GKE / EKS / AKS)](#2-kubernetes-gke--eks--aks)
  - [3. AWS ECS with Fargate](#3-aws-ecs-with-fargate)
  - [4. Google Cloud Run](#4-google-cloud-run)
  - [5. Railway (PaaS)](#5-railway-paas)
  - [6. Render (PaaS)](#6-render-paas)
  - [7. Manual Deployment (Build from Source)](#7-manual-deployment-build-from-source)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have the following installed and configured:

| Tool            | Version   | Purpose                              |
|-----------------|-----------|--------------------------------------|
| Docker          | 24+       | Containerization (all methods)       |
| Docker Compose  | 2.20+     | Local multi-service orchestration    |
| Java            | 17+       | Backend compilation (manual deploy)  |
| Maven           | 3.8+      | Backend build (manual deploy)        |
| Node.js         | 18+       | Frontend build (manual deploy)       |
| npm/yarn        | 9+        | Frontend dependencies (manual)       |
| kubectl         | 1.28+     | Kubernetes management                |
| AWS CLI         | 2.x       | AWS ECS/ECR deployment               |
| gcloud CLI      | Latest    | GCP Cloud Run/SQL deployment         |

---

## Environment Variables Reference

The application uses several environment variables. Some have sensible defaults for development, but all should be configured for production.

### Generating a JWT Secret

The JWT secret is an HMAC-SHA256 key used to sign and verify access tokens. It must be a **256-bit (32-byte) value encoded in Base64**.

**Generate a secure JWT secret:**

```bash
# Linux / macOS
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Expected output example:**
```
dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gc2VjcmV0IGtleSBmb3Igand0IHNpZ25pbmc=
```

Copy this value and set it as the `JWT_SECRET` environment variable.

### Obtaining a Google OAuth Client ID

Required if you enable Google Sign-In on the frontend.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth Client ID**
5. Choose **Web Application**
6. Add authorized JavaScript origins (e.g., `http://localhost:5173`, `https://yourdomain.com`)
7. Add authorized redirect URIs (e.g., `https://yourdomain.com/login`)
8. Copy the **Client ID** value

Set this as the `GOOGLE_CLIENT_ID` environment variable.

### Setting up Gmail SMTP

To enable email notifications (password reset, application updates, etc.):

1. **Enable 2-Step Verification** on your Google account
2. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select **Mail** as the app and **Other** as the device (name it "Shikshak")
4. Copy the generated 16-character app password
5. Set the following variables:
   - `MAIL_USERNAME`: your full Gmail address (e.g., `your-email@gmail.com`)
   - `MAIL_PASSWORD`: the 16-character app password

### Complete Variable Reference Table

| Variable             | Required | Description                          | Default Value                        | How to Get/Generate                          |
|----------------------|----------|--------------------------------------|--------------------------------------|----------------------------------------------|
| `JWT_SECRET`         | Yes      | Base64-encoded 256-bit HMAC key      | Built-in default (dev only)          | `openssl rand -base64 32`                   |
| `GOOGLE_CLIENT_ID`   | No       | Google OAuth client ID               | -                                    | Google Cloud Console > Credentials           |
| `MAIL_USERNAME`      | No       | Gmail SMTP username                  | `your-email@gmail.com`               | Your Gmail address                           |
| `MAIL_PASSWORD`      | No       | Gmail SMTP app password              | `your-app-password`                  | myaccount.google.com/apppasswords            |
| `UPLOAD_DIR`         | No       | File upload directory path           | `./uploads`                          | Any writable directory path                  |
| `DB_USER`            | No       | PostgreSQL username                  | `postgres`                           | Set during database creation                 |
| `DB_PASSWORD`        | Yes*     | PostgreSQL password                  | `postgres`                           | Choose a strong password                     |
| `SERVER_PORT`        | No       | Backend server port                  | `8080`                               | Usually leave as default                     |

> *`DB_PASSWORD` is required in production. The default `postgres` should never be used for production deployments.

---

## Deployment Options

---

### 1. Docker Compose (VPS / Self-Hosted)

Best for: Single VPS (DigitalOcean, Linode, AWS EC2, Hetzner)

The project uses a single unified Docker image that contains both the frontend (Nginx) and backend (Spring Boot). Docker Compose orchestrates this image alongside the PostgreSQL database.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/abnjain/shikshak-recruitment.git
cd shikshak-recruitment
```

#### Step 2: Create the .env File

```bash
cat > .env << EOF
# Database
DB_USER=postgres
DB_PASSWORD=<your-strong-db-password>

# JWT
JWT_SECRET=<your-generated-jwt-secret>

# Optional: Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>

# Optional: Email
MAIL_USERNAME=<your-email@gmail.com>
MAIL_PASSWORD=<your-app-password>
EOF
```

#### Step 3: Deploy

```bash
# Build the unified image and start
docker compose up -d --build

# Check that services are running
docker compose ps

# View logs
docker compose logs -f app
```

#### Step 4: Set up Reverse Proxy (SSL)

For production with a custom domain, set up a reverse proxy with SSL:

**Using Caddy (recommended, auto-SSL):**

```bash
# Install Caddy
sudo apt install caddy

# Create Caddyfile
cat > /etc/caddy/Caddyfile << EOF
shikshak.abnjain.me {
    reverse_proxy localhost:80
}
EOF

# Start Caddy
sudo systemctl restart caddy
```

**Using Nginx + Certbot:**

```bash
sudo apt install nginx certbot python3-certbot-nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/shikshak << 'EOF'
server {
    server_name shikshak.abnjain.me;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/shikshak /etc/nginx/sites-enabled/
sudo certbot --nginx -d shikshak.abnjain.me
```

#### Updating

```bash
git pull
docker compose up -d --build
```

---

### 2. Kubernetes (GKE / EKS / AKS)

Best for: Scalable production deployments on any Kubernetes cluster

#### Step 1: Prepare Environment

```bash
# Clone the repository
git clone https://github.com/abnjain/shikshak-recruitment.git
cd shikshak-recruitment
```

#### Step 2: Configure Secrets

Edit `deploy/k8s/02-secrets.yaml` with your production values:

```yaml
stringData:
  SPRING_DATASOURCE_PASSWORD: "<your-db-password>"
  APP_JWT_SECRET: "<your-base64-jwt-secret>"
  APP_OAUTH_GOOGLE_CLIENT_ID: "<your-google-client-id>"
  MAIL_USERNAME: "<your-email@gmail.com>"
  MAIL_PASSWORD: "<your-app-password>"
```

> **Security Note**: In production, use an external secrets manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) instead of plain YAML files. The `02-secrets.yaml` file should NOT be committed to version control with real values.

#### Step 3: Configure Ingress

Edit `deploy/k8s/06-ingress.yaml`:
- Replace `shikshak.abnjain.me` with your domain
- Uncomment the appropriate ingress class annotation for your provider (GKE, EKS, or nginx)
- If using nginx ingress, ensure `cert-manager` is installed for auto-SSL

#### Step 4: Build and Push Images

```bash
# Build the unified image (frontend + backend together)
docker build -t ghcr.io/abnjain/shikshak-recruitment:latest .

# Push to your container registry (GitHub Container Registry example)
docker push ghcr.io/abnjain/shikshak-recruitment:latest
```

Update the image reference in `04-backend.yaml` to match your registry. The frontend service (`05-frontend.yaml`) is no longer needed -- the unified image serves both.

#### Step 5: Apply Manifests

```bash
cd deploy/k8s
chmod +x apply.sh
./apply.sh
```

Or apply individually:

```bash
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-configmap.yaml
kubectl apply -f 02-secrets.yaml
kubectl apply -f 03-postgres.yaml
kubectl apply -f 04-backend.yaml
kubectl apply -f 05-frontend.yaml
kubectl apply -f 06-ingress.yaml

# Wait for rollouts
kubectl rollout status deployment/postgres -n shikshak
kubectl rollout status deployment/backend -n shikshak
kubectl rollout status deployment/frontend -n shikshak
```

#### Step 6: Verify

```bash
kubectl get all -n shikshak
kubectl get ingress -n shikshak
```

---

### 3. AWS ECS with Fargate

Best for: AWS-native production deployment

#### Step 1: Set up AWS Resources

```bash
# Configure AWS CLI
aws configure

# Set variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# Create ECR repositories
aws ecr create-repository --repository-name shikshak-backend --region $AWS_REGION
aws ecr create-repository --repository-name shikshak-frontend --region $AWS_REGION
```

#### Step 2: Create RDS PostgreSQL

```bash
aws rds create-db-instance \
  --db-instance-identifier shikshak-db \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username postgres \
  --master-user-password <your-strong-password> \
  --allocated-storage 20 \
  --publicly-accessible \
  --region $AWS_REGION
```

Wait for the RDS instance to become available (5-10 minutes). Note the endpoint address from the AWS console.

#### Step 3: Run the Deployment Script

```bash
# Make the script executable
chmod +x deploy/scripts/deploy-aws.sh

# Run it
export AWS_ACCOUNT_ID=<your-account-id>
export AWS_REGION=us-east-1
export DB_PASSWORD=<your-db-password>
export JWT_SECRET=<your-jwt-secret>

./deploy/scripts/deploy-aws.sh
```

#### Step 4: Configure ECS Service

After the script pushes images, you need to:

1. **Create an ECS cluster:**
   ```bash
   aws ecs create-cluster --cluster-name shikshak-cluster --region $AWS_REGION
   ```

2. **Register task definitions** using `deploy/scripts/ecs-task-definitions.json`:
   - Replace `YOUR_ACCOUNT_ID`, `YOUR_RDS_ENDPOINT`, and secret ARNs with actual values
   - Create SSM parameters for secrets:
     ```bash
     aws ssm put-parameter --name /shikshak/db-password --type SecureString --value <your-password>
     aws ssm put-parameter --name /shikshak/jwt-secret --type SecureString --value <your-jwt-secret>
     aws ssm put-parameter --name /shikshak/google-client-id --type SecureString --value <your-client-id>
     ```
   - Register task definitions:
     ```bash
     aws ecs register-task-definition --cli-input-json file://deploy/scripts/ecs-task-definitions.json
     ```

3. **Create an Application Load Balancer** with two target groups:
   - Frontend target group (port 80)
   - Backend target group (port 8080)

4. **Create ECS services** linked to the ALB

5. **Set up Route53** with `shikshak.abnjain.me` pointing to the ALB

6. **Request an ACM SSL certificate** for your domain

---

### 4. Google Cloud Run

Best for: Serverless deployment on GCP

#### Step 1: Set up GCP Project

```bash
# Authenticate
gcloud auth login

# Set project
export PROJECT_ID=shikshak-recruitment
export REGION=us-central1

gcloud config set project $PROJECT_ID

# Create project (if it doesn't exist)
gcloud projects create $PROJECT_ID
```

#### Step 2: Run the Deployment Script

```bash
# Make executable
chmod +x deploy/scripts/deploy-gcp.sh

# Set environment variables
export GCP_PROJECT_ID=$PROJECT_ID
export GCP_REGION=us-central1
export DB_PASSWORD=<your-db-password>
export JWT_SECRET=<your-jwt-secret>

# Run the script
./deploy/scripts/deploy-gcp.sh
```

#### Step 3: Configure Custom Domain

After deployment, the script outputs the frontend and backend URLs.

To set up a custom domain:

```bash
# Map custom domain to Cloud Run
gcloud beta run domain-mappings create \
  --service shikshak-frontend \
  --domain shikshak.abnjain.me \
  --region $REGION \
  --project $PROJECT_ID

gcloud beta run domain-mappings create \
  --service shikshak-backend \
  --domain api.shikshak.abnjain.me \
  --region $REGION \
  --project $PROJECT_ID
```

Then add the returned DNS records (A/AAAA or CNAME) to your domain registrar.

#### Step 4: Set up Secrets (Recommended)

Instead of environment variables, store secrets in GCP Secret Manager:

```bash
# Create secrets
echo -n "<your-jwt-secret>" | gcloud secrets create jwt-secret --data-file=-
echo -n "<your-db-password>" | gcloud secrets create db-password --data-file=-
```

Update the Cloud Run service to reference these secrets.

---

### 5. Railway (PaaS)

Best for: Quick, low-cost deployments with a free tier

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Deploy

```bash
# Clone and enter the project
git clone https://github.com/abnjain/shikshak-recruitment.git
cd shikshak-recruitment

# Login
railway login

# Link to a new or existing project
railway link

# Deploy backend
cd backend
railway up --service shikshak-backend
cd ..

# Deploy frontend
cd frontend
railway up --service shikshak-frontend
cd ..
```

Railway automatically provisions a PostgreSQL database. Use `railway variables` to set secrets:

```bash
railway variables --service shikshak-backend --set \
  JWT_SECRET=<your-jwt-secret> \
  GOOGLE_CLIENT_ID=<your-google-client-id>
```

Refer to `deploy/railway.json` for the Railway configuration.

---

### 6. Render (PaaS) -- Unified Single-Container Deployment

Best for: Simple deployments with built-in PostgreSQL

This is the recommended method for quickly deploying Shikshak Recruitment to production. Render handles PostgreSQL provisioning, SSL certificates, and CI/CD automatically. The project uses a **unified single-container strategy** -- both the React frontend (served by Nginx) and the Spring Boot backend run together in one Docker container, eliminating cross-service networking issues.

#### Prerequisites

- A [Render account](https://dashboard.render.com/) (free tier works for small deployments)
- Your project pushed to a GitHub repository
- A JWT secret generated (see [Generating a JWT Secret](#generating-a-jwt-secret))

#### Step 1: Generate Required Secrets

```bash
# Generate a JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
```

Save this value -- you will need it in Step 4.

#### Step 2: Prepare the render.yaml File

The blueprint file is at `deploy/render.yaml`. It is pre-configured with a **single web service** (`shikshak`) that:

- Builds from the **root Dockerfile** (multi-stage: builds frontend with Node, backend with Maven, then produces a single Nginx+JRE runtime image)
- Serves the frontend at `/` and proxies `/api/` to the Spring Boot backend on `localhost:8080` (same container)
- Provisions a **PostgreSQL database** (`shikshak-db`)
- Auto-links database credentials via `fromDatabase` references

**No changes are needed to `render.yaml` for a basic deployment.**

If you are deploying from a branch other than `main`, add `branch: <your-branch>` under the service and database:

```yaml
services:
  - type: web
    name: shikshak
    branch: main          # <-- change to your branch
    ...
databases:
  - name: shikshak-db
    branch: main          # <-- change to your branch
    ...
```

#### Step 3: Connect Repository to Render

1. Log in to the [Render Dashboard](https://dashboard.render.com/)
2. Click the **New +** button (top-right) and select **Blueprint**
3. If prompted, connect your GitHub account and grant Render access to your repository
4. Select your `abnjain/shikshak-recruitment` repository
5. Render will automatically read `deploy/render.yaml` and display:
   - **shikshak** (Web Service, Docker)
   - **shikshak-db** (PostgreSQL database)
6. Click **Apply** at the bottom

#### Step 4: Configure Environment Variables

After clicking Apply, Render will prompt you for environment variables marked as `sync: false`.

Set these values for the **shikshak** service:

| Variable           | Value                                  | Required? |
|--------------------|----------------------------------------|-----------|
| `JWT_SECRET`       | Your generated JWT secret              | Yes       |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID            | No        |
| `MAIL_USERNAME`    | your-email@gmail.com                   | No        |
| `MAIL_PASSWORD`    | Your Gmail app password                | No        |

The database credentials (host, port, database name, user, password) are auto-injected by Render from the `shikshak-db` database.

#### Step 5: Deploy

1. Review the configuration summary and click **Apply**
2. Render will now:
   - Provision a PostgreSQL 16 database (free tier: `plan: free`, 256MB RAM, 1GB disk)
   - Build the unified Docker image from the root Dockerfile (this takes 5-7 minutes on first deploy as it compiles both frontend and backend)
   - Deploy the single service and run health checks
3. You can monitor progress in the Render Dashboard under the **Events** tab

#### Step 6: Access Your Application

Once the service shows **Live** status:

```bash
# Health check (also used by Render)
curl https://shikshak.onrender.com/api/v1/public/jobs

# Open the frontend in a browser
# https://shikshak.onrender.com
```

> Render assigns a subdomain like `shikshak.onrender.com` by default. The frontend is served at the root (`/`) and the API is at `/api/v1/` on the **same domain**. You can add a custom domain in the Render dashboard later.

#### Step 7: Verify the Deployment

Run these checks:

```bash
# 1. Check API health (served from single container)
curl -I https://shikshak.onrender.com/api/v1/public/jobs
# Expected: HTTP/2 200

# 2. Login as admin
curl -X POST https://shikshak.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
# Expected: JSON response with token and user data

# 3. Check frontend loads (served by Nginx in same container)
curl -I https://shikshak.onrender.com/
# Expected: 200 OK (serves index.html)
```

#### Setting Up a Custom Domain

Since everything runs on a **single service**, you only need **one domain**:

1. In the Render Dashboard, go to your **shikshak** service > **Settings** > **Custom Domain**
2. Enter your domain (e.g., `shikshak.abnjain.me`)
3. Add the DNS CNAME record provided by Render to your domain registrar
4. Render will automatically provision an SSL certificate (Let's Encrypt)

Your application will be accessible at:
- **Frontend**: `https://shikshak.abnjain.me/`
- **API (backend)**: `https://shikshak.abnjain.me/api/v1/`

No additional services or subdomains needed.

#### Auto-Deploy on Git Push

Render automatically deploys new changes when you push to the connected branch. To disable this, set `autoDeploy: false` in `render.yaml`.

To manually trigger a redeploy:

```bash
curl -X POST "https://api.render.com/v1/services/<service-id>/deploys" \
  -H "Authorization: Bearer <render-api-key>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

You can find the service ID and API key in the Render Dashboard under **Account Settings** > **API Keys**.

#### Render-Specific Notes

- **Free tier limits**: The free PostgreSQL database has 256MB RAM and 1GB storage. It will suspend after 15 minutes of inactivity. The web service also spins down after inactivity. Consider upgrading to a paid plan for production.
- **No persistent disk**: File uploads are stored on the ephemeral container filesystem. They will be lost on restart. For production, configure cloud storage (S3, GCS) for uploads.
- **Health check**: The service uses `/api/v1/public/jobs` as the health check path. This must return a 200 status for the service to stay live.
- **Logs**: View logs in the Render Dashboard under the **Logs** tab. Both Nginx and Spring Boot logs appear in the same stream.
- **Environment variables**: Changes to env vars trigger an automatic redeploy on Render.
- **Build time**: The unified Docker image compiles both frontend (Node/npm) and backend (Maven/Java) in a single multi-stage build. First deploy takes 5-7 minutes. Subsequent builds with Docker layer caching are faster.

---

### 7. Manual Deployment (Build from Source)

Best for: Custom environments, air-gapped systems, or learning the internals

#### Backend

```bash
# 1. Build the JAR
cd backend
./mvnw clean package -DskipTests

# 2. Set environment variables
export JWT_SECRET=<your-jwt-secret>
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/shikshak_recruitment
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=<your-db-password>

# 3. Run the JAR
java -jar target/recruitment-1.0.0.jar

# Or run with specific profile
java -jar target/recruitment-1.0.0.jar --spring.profiles.active=mysql
```

#### Frontend

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Build for production
npm run build

# 3. Serve with any static file server
# Option A: Using nginx (copy dist/ to nginx html directory)
sudo cp -r dist/* /var/www/html/

# Option B: Using serve package
npm install -g serve
serve -s dist -l 3000

# Option C: Using the included nginx.conf
# Copy dist/ and nginx.conf to a server with nginx installed
```

#### Setting up nginx as reverse proxy (production)

```nginx
server {
    listen 80;
    server_name shikshak.abnjain.me;

    # Frontend static files
    root /var/www/shikshak-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Post-Deployment Checklist

After deploying, verify the following:

- [ ] **Database**: Postgres is running and accepting connections
- [ ] **Backend**: `/api/v1/public/jobs` returns a valid JSON response
- [ ] **Frontend**: Website loads at your domain without errors
- [ ] **Authentication**: Can login with admin/admin123 (change immediately)
- [ ] **JWT**: Tokens are issued and validated correctly
- [ ] **CORS**: Frontend can make API calls without CORS errors
- [ ] **SSL**: HTTPS is working with a valid certificate
- [ ] **Health Checks**: All readiness/liveness probes pass
- [ ] **File Uploads**: Upload directory is writable
- [ ] **Email**: Test email sending works (if configured)
- [ ] **Logging**: Application logs are being captured
- [ ] **Backups**: Database backup strategy is in place

### Post-Deployment Security Steps

1. **Change default admin password** immediately after first login
2. **Regenerate the JWT secret** if the default was used at any point
3. **Restrict database access** to only the application server (not public)
4. **Enable database encryption** at rest (RDS/KMS for AWS, CMEK for GCP)
5. **Set up regular database backups**
6. **Configure a Web Application Firewall (WAF)** if using a cloud provider
7. **Enable audit logging** for all admin actions

---

## Troubleshooting

### Backend won't start

**Check database connectivity:**
```bash
# From the host
psql -h localhost -U postgres -d shikshak_recruitment -c "SELECT 1"

# From inside the container
docker exec shikshak-backend nc -zv postgres 5432
```

**Check JWT secret:**
Ensure the secret is valid Base64 and at least 256 bits (44+ characters in Base64):
```bash
echo <your-jwt-secret> | base64 -d | wc -c
# Should output 32 or more
```

**Check logs:**
```bash
docker compose logs backend
# or
kubectl logs -n shikshak deployment/backend
```

### Frontend shows blank page

**Check API proxy:** If the frontend loads but API calls fail, ensure the nginx proxy is correctly forwarding `/api/` requests.

**Check build output:** Rebuild the frontend:
```bash
cd frontend
npm run build
# Check for TypeScript errors
```

**Browser console:** Open DevTools (F12) and check the Console and Network tabs for errors.

### Database connection refused

**Docker Compose:** Ensure the database service is healthy:
```bash
docker compose ps
docker compose logs postgres
```

**Kubernetes:** Check the pod status and PVC:
```bash
kubectl get pods -n shikshak
kubectl describe pod -n shikshak -l app=postgres
kubectl get pvc -n shikshak
```

### SSL / Certificate Issues

**Cert-Manager (Kubernetes):**
```bash
kubectl get certificates -n shikshak
kubectl describe certificate shikshak-tls -n shikshak
kubectl get certificaterequests -n shikshak
```

**Certbot (VPS):**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### Application Errors

| Error                          | Likely Cause                     | Solution                                          |
|--------------------------------|----------------------------------|---------------------------------------------------|
| 401 Unauthorized               | Expired or invalid JWT token     | Login again to get a fresh token                  |
| 403 Forbidden                  | Insufficient role permissions    | Check the user's assigned roles                   |
| 500 Internal Server Error      | Backend exception                | Check backend logs for stack trace                |
| HikariPool connection timeout  | Database unreachable             | Verify DB host/port and credentials               |
| Hostname not found             | DNS not propagated               | Wait for DNS TTL or check DNS records             |
| 413 Request Entity Too Large   | File upload exceeds limit        | Increase `max-file-size` in application.yml       |

---

## Environment Variable Extraction Quick Reference

For quick setup, here is a summary of where to get each variable:

```bash
# Generate JWT_SECRET (run this command)
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"

# DB_PASSWORD (choose a strong password, minimum 16 characters)
DB_PASSWORD="$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 20)"
echo "DB_PASSWORD=$DB_PASSWORD"

# GOOGLE_CLIENT_ID - get from https://console.cloud.google.com/apis/credentials
# MAIL_USERNAME - your Gmail address
# MAIL_PASSWORD - generate at https://myaccount.google.com/apppasswords
```
