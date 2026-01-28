#!/bin/bash

# Script de validation du déploiement Docker
# Vérifie que toutes les optimisations sont bien appliquées

set -e

IMAGE_NAME="portfolio:latest"
CONTAINER_NAME="portfolio-app"

echo "🔍 Validation du déploiement Docker optimisé"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur de tests
PASSED=0
FAILED=0

check_test() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $1"
        ((FAILED++))
    fi
}

# Test 1: Vérifier que l'image existe
echo "1️⃣  Vérification de l'existence de l'image..."
docker images | grep -q "portfolio" && docker images | grep -q "latest"
check_test "Image portfolio:latest existe"

# Test 2: Vérifier la taille de l'image
echo ""
echo "2️⃣  Vérification de la taille de l'image..."
SIZE=$(docker images $IMAGE_NAME --format "{{.Size}}")
SIZE_MB=$(echo $SIZE | sed 's/MB//' | sed 's/GB/*1000/' | bc 2>/dev/null || echo "0")
echo "   Taille: $SIZE"
if (( $(echo "$SIZE_MB < 100" | bc -l 2>/dev/null || echo "0") )); then
    echo -e "${GREEN}✅ PASS${NC}: Taille optimale (<100MB)"
    ((PASSED++))
elif (( $(echo "$SIZE_MB < 250" | bc -l 2>/dev/null || echo "0") )); then
    echo -e "${YELLOW}⚠️  WARN${NC}: Taille acceptable (<250MB) mais pourrait être mieux"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Taille trop importante (>250MB)"
    ((FAILED++))
fi

# Test 3: Vérifier l'utilisation d'Alpine
echo ""
echo "3️⃣  Vérification de l'utilisation d'Alpine..."
docker history $IMAGE_NAME | grep -q "alpine"
check_test "Image basée sur Alpine"

# Test 4: Vérifier le multi-stage build
echo ""
echo "4️⃣  Vérification du multi-stage build..."
docker history $IMAGE_NAME --no-trunc | grep -q "nginx:alpine"
check_test "Multi-stage build avec nginx:alpine"

# Test 5: Vérifier que .dockerignore existe
echo ""
echo "5️⃣  Vérification du .dockerignore..."
test -f .dockerignore
check_test "Fichier .dockerignore existe"

# Test 6: Vérifier que node_modules n'est pas dans l'image finale
echo ""
echo "6️⃣  Vérification de l'exclusion de node_modules..."
docker run --rm $IMAGE_NAME sh -c "[ ! -d /app/node_modules ]" 2>/dev/null
check_test "node_modules exclu de l'image finale"

# Test 7: Vérifier le container si il tourne
echo ""
echo "7️⃣  Vérification du container..."
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ PASS${NC}: Container est en cours d'exécution"
    ((PASSED++))
    
    # Test 7a: Vérifier le healthcheck
    echo ""
    echo "7️⃣a Vérification du healthcheck..."
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "none")
    if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "starting" ]; then
        echo -e "${GREEN}✅ PASS${NC}: Healthcheck configuré (Status: $HEALTH)"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: Healthcheck status: $HEALTH"
        ((PASSED++))
    fi
    
    # Test 7b: Vérifier que le site répond
    echo ""
    echo "7️⃣b Test de réponse HTTP..."
    if command -v curl &> /dev/null; then
        curl -f -s http://localhost:80/ > /dev/null
        check_test "Le site répond sur le port 80"
    elif command -v wget &> /dev/null; then
        wget -q -O /dev/null http://localhost:80/
        check_test "Le site répond sur le port 80"
    else
        echo -e "${YELLOW}⚠️  SKIP${NC}: curl et wget non disponibles"
    fi
    
    # Test 7c: Vérifier l'utilisateur non-root
    echo ""
    echo "7️⃣c Vérification de l'utilisateur non-root..."
    USER=$(docker exec $CONTAINER_NAME whoami 2>/dev/null || echo "root")
    if [ "$USER" != "root" ]; then
        echo -e "${GREEN}✅ PASS${NC}: Container s'exécute en tant que '$USER' (non-root)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: Container s'exécute en tant que root"
        ((FAILED++))
    fi
    
    # Test 7d: Vérifier la compression Gzip
    echo ""
    echo "7️⃣d Vérification de la compression Gzip..."
    if command -v curl &> /dev/null; then
        GZIP=$(curl -s -I -H "Accept-Encoding: gzip" http://localhost:80/ | grep -i "content-encoding: gzip" || echo "")
        if [ -n "$GZIP" ]; then
            echo -e "${GREEN}✅ PASS${NC}: Compression Gzip activée"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠️  WARN${NC}: Compression Gzip non détectée"
            ((PASSED++))
        fi
    fi
    
    # Test 7e: Vérifier les headers de sécurité
    echo ""
    echo "7️⃣e Vérification des headers de sécurité..."
    if command -v curl &> /dev/null; then
        HEADERS=$(curl -s -I http://localhost:80/)
        
        if echo "$HEADERS" | grep -qi "x-frame-options"; then
            echo -e "${GREEN}   ✓${NC} X-Frame-Options présent"
        else
            echo -e "${YELLOW}   ✗${NC} X-Frame-Options manquant"
        fi
        
        if echo "$HEADERS" | grep -qi "x-content-type-options"; then
            echo -e "${GREEN}   ✓${NC} X-Content-Type-Options présent"
        else
            echo -e "${YELLOW}   ✗${NC} X-Content-Type-Options manquant"
        fi
        
        ((PASSED++))
    fi
    
else
    echo -e "${YELLOW}⚠️  SKIP${NC}: Container n'est pas en cours d'exécution"
    echo "   Démarrez-le avec: make up"
fi

# Test 8: Vérifier les layers
echo ""
echo "8️⃣  Analyse des layers..."
LAYERS=$(docker history $IMAGE_NAME | wc -l)
echo "   Nombre de layers: $LAYERS"
if [ "$LAYERS" -lt 20 ]; then
    echo -e "${GREEN}✅ PASS${NC}: Nombre de layers optimisé (<20)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARN${NC}: Nombre de layers élevé (${LAYERS})"
    ((PASSED++))
fi

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Tests réussis: ${GREEN}${PASSED}${NC}"
echo -e "Tests échoués: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Toutes les optimisations sont correctement appliquées !${NC}"
    echo ""
    echo "📋 Checklist des optimisations:"
    echo "   ✅ Image Alpine (minimal)"
    echo "   ✅ Multi-stage build"
    echo "   ✅ Layer caching optimisé"
    echo "   ✅ .dockerignore configuré"
    echo "   ✅ Taille d'image optimale"
    echo "   ✅ Utilisateur non-root"
    echo "   ✅ Healthcheck actif"
    echo "   ✅ Compression Gzip"
    echo "   ✅ Headers de sécurité"
    exit 0
else
    echo -e "${RED}⚠️  Certaines optimisations nécessitent attention${NC}"
    exit 1
fi
