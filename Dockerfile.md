# Docker Optimization Guide

## Base Image Selection

**Directive**: Always use minimal base images unless specific requirements dictate otherwise.
```dockerfile
# ❌ Avoid full images (>1GB)
FROM node:latest
FROM python:latest

# ✅ Use Alpine variants (150-250MB)
FROM node:alpine
FROM python:alpine

# ✅ Or distroless for production (minimal size, no OS)
FROM gcr.io/distroless/nodejs
```

**Rule**: Append `-alpine` to standard images for 80% size reduction. Use distroless for maximum security (no shell, no package manager).

---

## Layer Caching Optimization

**Directive**: Copy dependency files before source code to maximize cache reuse.
```dockerfile
# ❌ Poor caching - rebuilds everything on code change
COPY . .
RUN npm install

# ✅ Optimal caching - only rebuilds when dependencies change
COPY package*.json ./
RUN npm install
COPY . .
```

**Rule**: Order instructions from least to most frequently changed. Cache invalidates on: file changes, instruction changes, or previous layer changes.

---

## .dockerignore Configuration

**Directive**: Always create `.dockerignore` to exclude unnecessary files.
```
node_modules
npm-debug.log
.git
.env
.env.*
*.md
.DS_Store
dist
build
coverage
```

**Rule**: Exclude: dependencies folders, secrets, dev files, build artifacts, and documentation.

---

## Layer Squashing

**Directive**: Combine related operations in single RUN commands to avoid layer bloat.
```dockerfile
# ❌ Creates multiple layers, deleted files still consume space
RUN npm install
RUN rm -rf /tmp/*
RUN npm cache clean --force

# ✅ Single layer, final state only
RUN npm install && \
    rm -rf /tmp/* && \
    npm cache clean --force
```

**Rule**: Docker layers are immutable. Deletions in new layers only mark files as inaccessible but don't remove them. Combine cleanup in same RUN command.

---

## Multi-Stage Builds

**Directive**: Use multi-stage builds to separate build and runtime environments.
```dockerfile
# Build stage
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Rule**: Final image contains only runtime dependencies and build artifacts. Builder stage (Node, npm, source code, node_modules) is discarded.

---

## Complete Optimized Template

### Node.js Application
```dockerfile
# Build stage
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Python Application
```dockerfile
# Build stage
FROM python:alpine AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:alpine
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.*/site-packages /usr/local/lib/python3.*/site-packages
COPY . .
CMD ["python", "app.py"]
```

---

## Build Commands
```bash
# Standard build
docker build -t app:latest .

# Build with specific stage
docker build --target builder -t app:builder .

# No cache build
docker build --no-cache -t app:latest .
```

---

## Optimization Checklist

- [ ] Use Alpine or distroless base image
- [ ] Copy dependency files before source code
- [ ] Create `.dockerignore` file
- [ ] Combine cleanup operations in single RUN
- [ ] Implement multi-stage build
- [ ] Remove dev dependencies in production
- [ ] Use `--no-cache-dir` for package managers
- [ ] Verify final image size < 100MB when possible

---

## Tools for Analysis
```bash
# Inspect image layers
docker history app:latest

# Using dive (layer explorer)
dive app:latest

# Using slim (automated optimization)
slim build app:latest
```

**Expected Results**: 
- Standard image: ~1.2GB
- With Alpine: ~250MB
- With multi-stage: ~50-60MB
- With slim optimization: ~10MB

---

## Security Notes

- Never copy `.env` files into images
- Files deleted in later layers remain accessible in earlier layers
- Use multi-stage builds to ensure secrets don't persist
- Scan images with `docker scan app:latest`