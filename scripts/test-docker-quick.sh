#!/bin/bash

# Test rapide du déploiement Docker
# Usage: ./scripts/test-docker-quick.sh

set -e

echo "🧪 Test Rapide du Déploiement Docker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Fichiers essentiels
echo "1️⃣  Vérification des fichiers..."
FILES=("Dockerfile" ".dockerignore" "docker-compose.yml" "nginx.conf" "Makefile")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file manquant"
        exit 1
    fi
done

# Test 2: Build
echo ""
echo "2️⃣  Build de l'image..."
if docker build -t portfolio:test . > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Build réussi"
else
    echo -e "${RED}❌${NC} Build échoué"
    exit 1
fi

# Test 3: Taille
echo ""
echo "3️⃣  Vérification de la taille..."
SIZE=$(docker images portfolio:test --format "{{.Size}}")
echo "   Taille: $SIZE"

# Test 4: Lancer le container
echo ""
echo "4️⃣  Démarrage du container..."
docker run -d --name portfolio-test -p 8888:80 portfolio:test > /dev/null 2>&1
sleep 3

# Test 5: HTTP response
echo ""
echo "5️⃣  Test de réponse HTTP..."
if curl -f -s http://localhost:8888/ > /dev/null; then
    echo -e "${GREEN}✅${NC} Le site répond"
else
    echo -e "${RED}❌${NC} Le site ne répond pas"
    docker logs portfolio-test
    docker stop portfolio-test > /dev/null 2>&1
    docker rm portfolio-test > /dev/null 2>&1
    docker rmi portfolio:test > /dev/null 2>&1
    exit 1
fi

# Cleanup
echo ""
echo "6️⃣  Nettoyage..."
docker stop portfolio-test > /dev/null 2>&1
docker rm portfolio-test > /dev/null 2>&1
docker rmi portfolio:test > /dev/null 2>&1
echo -e "${GREEN}✅${NC} Nettoyage terminé"

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Tous les tests sont passés !${NC}"
echo ""
echo "Votre déploiement Docker est prêt !"
echo ""
echo "Pour démarrer:"
echo "  make build && make up"
echo ""
echo "Taille finale: $SIZE"
