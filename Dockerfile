# =====================================================
# Shikshak Recruitment - Unified Docker Image
# Multi-stage build: Frontend (Node) + Backend (Maven)
# Final image: Nginx + JRE (single container)
# =====================================================

# ===== Stage 1: Build Frontend =====
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files for dependency caching
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ .
RUN npm run build

# ===== Stage 2: Build Backend =====
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-builder

WORKDIR /app

# Copy only pom.xml first for dependency caching
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B --fail-never

# Copy source and build
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ===== Stage 3: Runtime (Nginx + JRE) =====
FROM nginx:1.27-alpine

# Install JRE for Spring Boot
RUN apk add --no-cache openjdk17-jre-headless

# Create app user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy frontend build to nginx html dir
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy backend JAR
COPY --from=backend-builder /app/target/*.jar /app/app.jar

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

WORKDIR /app

# Copy entrypoint that starts both nginx and Java
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 80 8080

ENTRYPOINT ["/app/entrypoint.sh"]
