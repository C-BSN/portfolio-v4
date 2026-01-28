#!/bin/bash

# Script de déploiement Docker
# Usage: ./scripts/docker-deploy.sh [port]

set -e

PORT=${1:-80}
IMAGE_NAME="portfolio:latest"
CONTAINER_NAME="portfolio-app"

echo "🚀 Déploiement du portfolio"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Arrêter et supprimer le container existant
if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
    echo "🛑 Arrêt du container existant..."
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
fi

# Démarrer le nouveau container
echo "▶️  Démarrage du nouveau container..."
docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${PORT}:80 \
  --restart unless-stopped \
  ${IMAGE_NAME}

# Attendre que le container soit prêt
echo "⏳ Vérification du healthcheck..."
sleep 5

# Vérifier le statut
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo ""
    echo "✅ Container démarré avec succès !"
    echo ""
    echo "📊 Informations du container:"
    docker ps -f name=${CONTAINER_NAME}
    echo ""
    echo "🌐 Application disponible sur: http://localhost:${PORT}"
    echo ""
    echo "📋 Commandes utiles:"
    echo "   Logs:    docker logs -f ${CONTAINER_NAME}"
    echo "   Stats:   docker stats ${CONTAINER_NAME}"
    echo "   Stop:    docker stop ${CONTAINER_NAME}"
else
    echo ""
    echo "❌ Erreur lors du démarrage du container"
    echo "Logs:"
    docker logs ${CONTAINER_NAME}
    exit 1
fi
