# Apply all manifests
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-configmap.yaml
kubectl apply -f 02-secrets.yaml
kubectl apply -f 03-postgres.yaml
kubectl apply -f 04-backend.yaml
kubectl apply -f 05-frontend.yaml
kubectl apply -f 06-ingress.yaml

echo "=== Waiting for deployments to roll out ==="
kubectl rollout status deployment/postgres -n shikshak
kubectl rollout status deployment/backend -n shikshak
kubectl rollout status deployment/frontend -n shikshak

echo "=== All resources applied successfully ==="
kubectl get all -n shikshak
