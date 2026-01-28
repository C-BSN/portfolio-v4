# ========================================
# Stage 1: Dépendances
# ========================================
FROM node:alpine AS deps
WORKDIR /app

# Copier uniquement les fichiers de dépendances pour optimiser le cache
COPY package*.json ./

# Installer toutes les dépendances (dev + prod) nécessaires pour le build
RUN npm ci && \
    npm cache clean --force

# ========================================
# Stage 2: Builder
# ========================================
FROM node:alpine AS builder
WORKDIR /app

# Copier les node_modules depuis le stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build de l'application Next.js
# Les variables d'environnement publiques doivent être définies au moment du build
RUN npm run build && \
    rm -rf .git .github .vscode && \
    npm prune --production

# ========================================
# Stage 3: Production avec Nginx
# ========================================
FROM nginx:alpine AS production

# Copier la configuration nginx personnalisée
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || echo "server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Gestion du routing pour SPA \
    location / { \
        try_files \$uri \$uri/ \$uri.html /index.html; \
    } \
    \
    # Cache pour les assets statiques \
    location ~* \\.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control \"public, immutable\"; \
    } \
    \
    # Sécurité \
    add_header X-Frame-Options \"SAMEORIGIN\" always; \
    add_header X-Content-Type-Options \"nosniff\" always; \
    add_header X-XSS-Protection \"1; mode=block\" always; \
    \
    # Compression \
    gzip on; \
    gzip_vary on; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
}" > /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques générés depuis le builder
COPY --from=builder /app/out /usr/share/nginx/html

# Créer un utilisateur non-root pour nginx
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Exposer le port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Démarrer nginx
USER nextjs
CMD ["nginx", "-g", "daemon off;"]
