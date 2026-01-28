# 🚀 Quick Start Docker - 3 Commandes

## Pour les pressés

```bash
# 1. Build
make build

# 2. Démarrer
make up

# 3. Ouvrir
open http://localhost:80
```

**C'est tout !** 🎉

---

## Alternative sans Makefile

```bash
# Build
docker build -t portfolio:latest .

# Démarrer
docker run -d -p 80:80 --name portfolio-app portfolio:latest

# Vérifier
docker ps
```

---

## Commandes utiles

```bash
make logs        # Voir les logs
make stats       # Statistiques
make stop        # Arrêter
make restart     # Redémarrer
make clean       # Tout nettoyer
```

---

## Validation

```bash
./scripts/validate-docker.sh
```

Vérifie que toutes les optimisations sont appliquées ✅

---

## Documentation complète

- **Guide complet**: [`DEPLOIEMENT_DOCKER.md`](DEPLOIEMENT_DOCKER.md)
- **Optimisations**: [`OPTIMIZATIONS_CHECKLIST.md`](OPTIMIZATIONS_CHECKLIST.md)
- **Guide rapide**: [`DOCKER_README.md`](DOCKER_README.md)

---

**Résultat**: Image ~50-60MB | Startup <2s | RAM ~128MB
