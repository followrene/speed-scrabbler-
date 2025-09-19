.PHONY: help install dev build lint type-check clean
.PHONY: contracts-compile contracts-test contracts-deploy contracts-deploy-alfajores contracts-deploy-celo

# Default target
help: ## Show this help message
	@echo "Speed Scrabbler - Development Commands"
	@echo "====================================="
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
install: ## Install all dependencies
	pnpm install

dev: ## Start development servers
	pnpm dev

build: ## Build all packages and apps
	pnpm build

lint: ## Lint all packages and apps
	pnpm lint

type-check: ## Run TypeScript type checking
	pnpm type-check

clean: ## Clean build artifacts
	pnpm clean

# Smart contract commands
contracts-compile: ## Compile smart contracts
	cd packages/hardhat && pnpm compile

contracts-test: ## Run smart contract tests
	cd packages/hardhat && pnpm test

contracts-deploy: ## Deploy contracts to local network
	cd packages/hardhat && pnpm deploy:local

contracts-deploy-alfajores: ## Deploy to Celo Alfajores testnet
	cd packages/hardhat && pnpm deploy:alfajores

contracts-deploy-celo: ## Deploy to Celo mainnet
	cd packages/hardhat && pnpm deploy:celo

# Game-specific commands
game-dev: ## Start only the game development server
	cd apps/web && pnpm dev

game-build: ## Build only the game application
	cd apps/web && pnpm build

# Utility commands
format: ## Format code with Prettier
	pnpm format

check-format: ## Check code formatting
	pnpm check-format

# Docker commands (if applicable)
docker-build: ## Build Docker image
	docker build -t speed-scrabbler .

docker-run: ## Run Docker container
	docker run -p 3000:3000 speed-scrabbler 