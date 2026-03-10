# ========================================
# Stage 1: Dépendances
# ========================================
FROM node:alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

# ========================================
# Stage 2: Build
# ========================================
FROM node:alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ========================================
# Stage 3: Production (Nginx)
# ========================================
FROM nginx:alpine AS production

# Utilisateur non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /run/nginx.pid && chown appuser:appgroup /run/nginx.pid

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

USER appuser
CMD ["nginx", "-g", "daemon off;"]
