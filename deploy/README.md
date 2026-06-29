# Deployment Guide — Shikshak Recruitment

## Architecture

```
User → shikshak.abnjain.me
         │
         ▼
    ┌─────────────────────────────────────┐
    │        Cloud Load Balancer          │
    │   (GCP LB / AWS ALB / Nginx)        │
    └──────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   ┌─────────┐  ┌──────────┐
   │ Frontend│  │ Backend  │
   │ Nginx   │  │ Spring   │
   │ :80     │  │ :8080    │
   └─────────┘  └────┬─────┘
                     │
                     ▼
               ┌──────────┐
               │PostgreSQL│
               └──────────┘
```

## URLs
- **Frontend:** `https://shikshak.abnjain.me`
- **Backend API:** `https://shikshak.abnjain.me/api/v1`

---

## Option 1: Docker Compose (VPS / Self-hosted)

**Cheapest option** — a single $5–10/mo VPS (Hetzner, DigitalOcean, etc.)

```bash
# Clone & deploy
git clone https://github.com/abnjain/shikshak-recruitment.git
cd shikshak-recruitment

# Edit .env with your secrets
cp backend/.env.example .env
nano .env

# Deploy
bash deploy/scripts/deploy-docker.sh
```

**For custom domain:** Add Nginx/Caddy reverse proxy with SSL.

---

## Option 2: Render (Free Tier)

**Easiest free option** — 750 hours/mo free per service, PostgreSQL free tier.

### Manual setup:
1. Create a **PostgreSQL** database on Render
2. Create a **Web Service** for backend (`./backend/Dockerfile`)
3. Create a **Web Service** for frontend (`./frontend/Dockerfile`)

### One-click (Blueprint):
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/abnjain/shikshak-recruitment)

Or use `deploy/render.yaml`:
```bash
render blueprint apply deploy/render.yaml
```

### Custom domain:
- Set `shikshak.abnjain.me` → Render frontend
- Render frontend proxies `/api/*` → backend (configure in Render dashboard)

---

## Option 3: Google Cloud Run (Free Tier)

**Free tier:** 2M requests/mo, 1GB outbound, Cloud SQL 1-month free trial.

```bash
# Set up & deploy
export GCP_PROJECT_ID=shikshak-recruitment
export DB_PASSWORD=your-password
export JWT_SECRET=your-jwt-secret

bash deploy/scripts/deploy-gcp.sh
```

### Custom domain with GCP:
1. Verify domain ownership in Google Search Console
2. Add `shikshak.abnjain.me` as custom domain in Cloud Run
3. Map frontend service to `shikshak.abnjain.me`
4. Backend is served under `shikshak.abnjain.me/api/*` via the same ingress

### Mapping config:
```
shikshak.abnjain.me → Frontend Cloud Run
shikshak.abnjain.me/api/* → Backend Cloud Run (via GCLB path routing)
```

---

## Option 4: AWS ECS Fargate (Free Tier)

**Free tier:** 750 hours/mo of ECS Fargate (t4g.small), 20GB RDS for 12 months.

```bash
export AWS_ACCOUNT_ID=your-account-id
export AWS_REGION=us-east-1
export DB_PASSWORD=your-password
export JWT_SECRET=your-jwt-secret

bash deploy/scripts/deploy-aws.sh
```

Then follow the ECS setup steps printed by the script.

---

## Option 5: Kubernetes (GKE / EKS)

```bash
# Deploy to existing K8s cluster
cd deploy/k8s
bash apply.sh
```

For GKE or EKS, see the CI/CD pipeline (`.github/workflows/ci-cd.yml`) which handles automatic deployment.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`):

1. **Backend CI** — Compile, test, package JAR
2. **Frontend CI** — Install deps, type-check, build
3. **Docker Build & Push** — Build images & push to GHCR
4. **Deploy** — Trigger Render deploy or apply Kubernetes manifests

### GitHub Secrets Required:

| Secret | Purpose |
|--------|---------|
| `RENDER_API_KEY` | Render deploy trigger |
| `RENDER_BACKEND_SERVICE_ID` | Render backend service ID |
| `RENDER_FRONTEND_SERVICE_ID` | Render frontend service ID |
| `GCP_SA_KEY` | GCP service account JSON key |
| `GKE_CLUSTER_NAME` | GKE cluster name |
| `GKE_CLUSTER_REGION` | GKE cluster region |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region |
| `EKS_CLUSTER_NAME` | EKS cluster name |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection string | ✅ |
| `SPRING_DATASOURCE_USERNAME` | Database username | ✅ |
| `SPRING_DATASOURCE_PASSWORD` | Database password | ✅ |
| `JWT_SECRET` | 256-bit Base64-encoded secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `MAIL_USERNAME` | SMTP email (Gmail) | ❌ |
| `MAIL_PASSWORD` | SMTP app password | ❌ |

## File Structure

```
deploy/
├── k8s/                          # Kubernetes manifests
│   ├── 00-namespace.yaml
│   ├── 01-configmap.yaml
│   ├── 02-secrets.yaml
│   ├── 03-postgres.yaml
│   ├── 04-backend.yaml
│   ├── 05-frontend.yaml
│   ├── 06-ingress.yaml
│   └── apply.sh
├── scripts/                      # Platform deployment scripts
│   ├── deploy-docker.sh          # Docker Compose (VPS)
│   ├── deploy-render.sh          # Render
│   ├── deploy-gcp.sh             # Google Cloud Run
│   ├── deploy-aws.sh             # AWS ECS Fargate
│   ├── deploy-railway.sh         # Railway
│   └── ecs-task-definitions.json # AWS ECS task defs
├── render.yaml                   # Render Blueprint config
├── railway.json                  # Railway config
└── README.md                     # This file
```
