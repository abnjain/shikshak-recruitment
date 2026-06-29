#!/bin/sh

# =============================================
# Normalize JDBC URL: fix Render's postgresql://
# (without jdbc: prefix) by prepending jdbc:
# =============================================

if echo "${SPRING_DATASOURCE_URL}" | grep -q "^postgresql://"; then
  export SPRING_DATASOURCE_URL="jdbc:${SPRING_DATASOURCE_URL}"
  echo "entrypoint: Fixed SPRING_DATASOURCE_URL (prepended jdbc:)"
fi

# Also check if DB_HOST, DB_PORT, DB_NAME are provided (new Render blueprint style)
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_NAME" ]; then
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
  echo "entrypoint: Constructed SPRING_DATASOURCE_URL from DB_HOST/DB_PORT/DB_NAME"
fi

echo "entrypoint: SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}"
echo "entrypoint: Starting application..."

exec java -jar /app/app.jar
