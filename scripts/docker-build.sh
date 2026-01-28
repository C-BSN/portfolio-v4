#!/bin/bash

# Script de build Docker optimisé
# Usage: ./scripts/docker-build.sh [tag]

set -e

TAG=${1:-latest}
IMAGE_NAME="portfolio"

echo "🐳 Building Docker image: ${IMAGE_NAME}:${TAG}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Build l'image
docker build \
  -t ${IMAGE_NAME}:${TAG} \
  --progress=plain \
  .

echo ""
echo "✅ Build terminé avec succès !"
echo ""
echo "📊 Informations sur l'image:"
docker images ${IMAGE_NAME}:${TAG}

echo ""
echo "📦 Taille des layers:"
docker history ${IMAGE_NAME}:${TAG} --human

echo ""
echo "🚀 Pour démarrer le container:"
echo "   docker run -d -p 80:80 --name portfolio-app ${IMAGE_NAME}:${TAG}"
echo ""
echo "📖 Ou utilisez Docker Compose:"
echo "   docker-compose up -d"
