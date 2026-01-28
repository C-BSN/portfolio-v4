.PHONY: help build up down restart logs clean analyze test

# Variables
IMAGE_NAME := portfolio
TAG := latest
CONTAINER_NAME := portfolio-app
PORT := 80

help: ## Afficher l'aide
	@echo "Commandes disponibles pour le déploiement Docker:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build l'image Docker
	@echo "🐳 Building Docker image..."
	docker build -t $(IMAGE_NAME):$(TAG) .
	@echo "✅ Build terminé !"
	@docker images $(IMAGE_NAME):$(TAG)

up: ## Démarrer avec docker-compose
	@echo "🚀 Démarrage avec docker-compose..."
	docker-compose up -d
	@echo "✅ Application démarrée sur http://localhost:$(PORT)"

down: ## Arrêter docker-compose
	@echo "🛑 Arrêt de l'application..."
	docker-compose down

restart: down up ## Redémarrer l'application

logs: ## Afficher les logs
	docker-compose logs -f

run: build ## Build et run le container
	@echo "🚀 Démarrage du container..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	docker run -d \
	  --name $(CONTAINER_NAME) \
	  -p $(PORT):80 \
	  --restart unless-stopped \
	  $(IMAGE_NAME):$(TAG)
	@echo "✅ Container démarré sur http://localhost:$(PORT)"

stop: ## Arrêter le container
	@echo "🛑 Arrêt du container..."
	@docker stop $(CONTAINER_NAME) || true
	@docker rm $(CONTAINER_NAME) || true

ps: ## Voir les containers en cours
	@docker ps -f name=$(CONTAINER_NAME)

stats: ## Voir les statistiques du container
	@docker stats $(CONTAINER_NAME) --no-stream

shell: ## Accéder au shell du container
	@docker exec -it $(CONTAINER_NAME) sh

analyze: ## Analyser l'image Docker
	@echo "📊 Analyse de l'image $(IMAGE_NAME):$(TAG)"
	@echo ""
	@echo "Taille totale:"
	@docker images $(IMAGE_NAME):$(TAG) --format "{{.Size}}"
	@echo ""
	@echo "Layers:"
	@docker history $(IMAGE_NAME):$(TAG) --human --format "table {{.CreatedBy}}\t{{.Size}}"

clean: ## Nettoyer les images et containers
	@echo "🧹 Nettoyage..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(TAG) 2>/dev/null || true
	@docker system prune -f
	@echo "✅ Nettoyage terminé !"

test: ## Tester le healthcheck
	@echo "🏥 Test du healthcheck..."
	@docker exec $(CONTAINER_NAME) wget --quiet --tries=1 --spider http://localhost:80/ && echo "✅ Healthcheck OK" || echo "❌ Healthcheck FAILED"

dive: ## Analyser avec dive (nécessite dive installé)
	@command -v dive >/dev/null 2>&1 || { echo "❌ dive n'est pas installé. Installez-le avec: brew install dive"; exit 1; }
	dive $(IMAGE_NAME):$(TAG)

build-no-cache: ## Build sans cache
	@echo "🐳 Building sans cache..."
	docker build --no-cache -t $(IMAGE_NAME):$(TAG) .

prod: build up ## Build et déployer en production
	@echo "✅ Déploiement en production terminé !"
