.PHONY: help up down restart logs clean publish

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: ## Start Docker containers
	docker-compose -f docker-compose.local.yaml up

down: ## Stop Docker containers
	docker-compose -f docker-compose.local.yaml down

restart: ## Restart Docker containers
	docker-compose -f docker-compose.local.yaml restart

logs: ## Show Docker container logs
	docker-compose -f docker-compose.local.yaml logs -f

clean: ## Clean Docker volumes and images
	docker-compose -f docker-compose.local.yaml down -v
	docker system prune -f
	rm -rf .next

publish: ## Deploy NextJS Application
	@echo "Deploying NextJS Application"
	./scripts/publish.sh