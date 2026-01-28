# Guide de Déploiement Docker Optimisé

Ce déploiement suit rigoureusement les meilleures pratiques d'optimisation Docker.

## 📊 Optimisations Appliquées

✅ **Images Alpine** - Réduction de ~1.2GB à ~50-60MB  
✅ **Multi-stage Build** - Séparation build/production  
✅ **Layer Caching** - Dépendances copiées avant le code  
✅ **Layer Squashing** - Opérations combinées avec `&&`  
✅ **`.dockerignore`** - Exclusion des fichiers inutiles  
✅ **Nginx Alpine** - Serveur web ultra-léger  
✅ **Healthcheck** - Monitoring de santé du container  
✅ **Non-root User** - Sécurité renforcée  
✅ **Compression Gzip** - Optimisation de la bande passante  
✅ **Cache Headers** - Performance maximale  

## 🚀 Démarrage Rapide

### Option 1 : Docker Compose (Recommandé)

```bash
# Build et démarrage
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêt
docker-compose down
```

### Option 2 : Docker Manuel

```bash
# Build de l'image
docker build -t portfolio:latest .

# Démarrage du container
docker run -d \
  --name portfolio-app \
  -p 80:80 \
  --restart unless-stopped \
  portfolio:latest

# Vérifier le statut
docker ps
```

## 📦 Structure Multi-Stage

```
Stage 1: deps (node:alpine)
  ↓ Installe les dépendances
  
Stage 2: builder (node:alpine)
  ↓ Copie node_modules + build Next.js
  
Stage 3: production (nginx:alpine)
  ↓ Copie uniquement /out + config nginx
  
Résultat: ~50-60MB (vs ~1.2GB standard)
```

## 🔍 Analyse de l'Image

```bash
# Voir la taille finale
docker images portfolio:latest

# Inspecter les layers
docker history portfolio:latest

# Avec dive (outil externe)
dive portfolio:latest
```

## 🛠️ Commandes Utiles

```bash
# Build sans cache
docker build --no-cache -t portfolio:latest .

# Build d'un stage spécifique
docker build --target builder -t portfolio:builder .

# Accéder au container
docker exec -it portfolio-app sh

# Voir les logs nginx
docker exec portfolio-app cat /var/log/nginx/access.log

# Healthcheck manuel
docker exec portfolio-app wget --quiet --tries=1 --spider http://localhost:80/
```

## 🌐 Variables d'Environnement

Les variables `NEXT_PUBLIC_*` doivent être définies au moment du build:

```bash
# Avec docker build
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://monsite.com \
  -t portfolio:latest .

# Avec docker-compose
# Ajouter dans docker-compose.yml:
# build:
#   args:
#     - NEXT_PUBLIC_SITE_URL=https://monsite.com
```

## 📊 Résultats Attendus

| Métrique | Standard | Optimisé |
|----------|----------|----------|
| Taille image | ~1.2GB | ~50-60MB |
| Temps de démarrage | ~5-10s | ~1-2s |
| Mémoire utilisée | ~512MB | ~128MB |
| Build time (sans cache) | ~5-8min | ~3-5min |
| Build time (avec cache) | ~3-5min | ~30s |

## 🔒 Sécurité

- ✅ Container s'exécute en tant qu'utilisateur non-root (`nextjs:nodejs`)
- ✅ Pas de secrets dans l'image (`.dockerignore` exclut `.env`)
- ✅ Headers de sécurité configurés dans nginx
- ✅ Image distroless possible pour production critique

```bash
# Scan de sécurité
docker scan portfolio:latest
```

## 🚢 Déploiement Production

### Avec Docker Swarm

```bash
docker stack deploy -c docker-compose.yml portfolio
```

### Avec Kubernetes

Créer un `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolio
  template:
    metadata:
      labels:
        app: portfolio
    spec:
      containers:
      - name: portfolio
        image: portfolio:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: portfolio
spec:
  selector:
    app: portfolio
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### Push vers Registry

```bash
# Docker Hub
docker tag portfolio:latest username/portfolio:latest
docker push username/portfolio:latest

# GitHub Container Registry
docker tag portfolio:latest ghcr.io/username/portfolio:latest
docker push ghcr.io/username/portfolio:latest

# Registry privé
docker tag portfolio:latest registry.exemple.com/portfolio:latest
docker push registry.exemple.com/portfolio:latest
```

## 🐛 Dépannage

### Container ne démarre pas
```bash
docker logs portfolio-app
```

### Port 80 déjà utilisé
```bash
# Utiliser un autre port
docker run -p 8080:80 portfolio:latest
```

### Problème de permissions nginx
```bash
# Vérifier les permissions
docker exec portfolio-app ls -la /usr/share/nginx/html
```

## 📈 Optimisations Supplémentaires

### Option 1 : Distroless (Production critique)

Modifier le stage production dans le `Dockerfile`:

```dockerfile
FROM gcr.io/distroless/static-debian11 AS production
COPY --from=builder /app/out /usr/share/nginx/html
```

**Gain**: ~30MB, sécurité maximale (pas de shell, pas de package manager)

### Option 2 : Slim (Optimisation automatique)

```bash
slim build portfolio:latest
```

**Gain potentiel**: Réduction jusqu'à ~10MB

## 📚 Références

- Documentation source: `public/Dockerfile.md`
- Next.js Docker: https://nextjs.org/docs/deployment
- Nginx Alpine: https://hub.docker.com/_/nginx
- Docker Multi-stage: https://docs.docker.com/build/building/multi-stage/
