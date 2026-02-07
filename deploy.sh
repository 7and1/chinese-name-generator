#!/bin/bash

# ============================================================================
# Chinese Name Generator - Production Deployment Script
# ============================================================================
# Supports: Cloudflare Pages, Vercel, Docker
# Usage: ./deploy.sh [command] [options]
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="chinese-name"
BUILD_DIR=".next"
OUT_DIR="out"

# ============================================================================
# Helper Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# ============================================================================
# Environment Validation
# ============================================================================

validate_env() {
    log_info "Validating environment..."

    # Check required tools
    check_command "node"
    check_command "pnpm"

    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js 18+ is required. Current version: $(node -v)"
        exit 1
    fi

    # Check for required environment variables
    if [ -f ".env.local" ]; then
        log_info "Found .env.local"
    elif [ -f ".env" ]; then
        log_info "Found .env"
    else
        log_warning "No .env file found. Using defaults."
    fi

    log_success "Environment validation passed"
}

# ============================================================================
# Build Functions
# ============================================================================

install_deps() {
    log_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    log_success "Dependencies installed"
}

run_lint() {
    log_info "Running linter..."
    pnpm lint || {
        log_warning "Lint warnings found. Continuing..."
    }
}

run_tests() {
    log_info "Running tests..."
    pnpm test || {
        log_error "Tests failed. Aborting deployment."
        exit 1
    }
    log_success "All tests passed"
}

build_app() {
    log_info "Building application..."

    # Clean previous build
    rm -rf "$BUILD_DIR" "$OUT_DIR"

    # Build
    pnpm build

    log_success "Build completed"
}

# ============================================================================
# Deployment Functions
# ============================================================================

deploy_cloudflare() {
    log_info "Deploying to Cloudflare Pages..."

    check_command "wrangler"

    # Build for static export if needed
    if [ "$1" == "--static" ]; then
        log_info "Building static export..."
        NEXT_OUTPUT=export pnpm build
        wrangler pages deploy "$OUT_DIR" --project-name="$PROJECT_NAME"
    else
        # Deploy with Next.js on Cloudflare
        wrangler pages deploy "$BUILD_DIR" --project-name="$PROJECT_NAME"
    fi

    log_success "Deployed to Cloudflare Pages"
}

deploy_vercel() {
    log_info "Deploying to Vercel..."

    check_command "vercel"

    if [ "$1" == "--prod" ]; then
        vercel --prod
    else
        vercel
    fi

    log_success "Deployed to Vercel"
}

deploy_docker() {
    log_info "Building Docker image..."

    check_command "docker"

    # Build Docker image
    docker build -t "$PROJECT_NAME:latest" .

    if [ "$1" == "--push" ]; then
        REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
        IMAGE_NAME="${REGISTRY}/${PROJECT_NAME}:latest"

        log_info "Pushing to registry: $IMAGE_NAME"
        docker tag "$PROJECT_NAME:latest" "$IMAGE_NAME"
        docker push "$IMAGE_NAME"
    fi

    log_success "Docker image built"
}

# ============================================================================
# Database Functions
# ============================================================================

db_migrate() {
    log_info "Running database migrations..."
    pnpm db:push
    log_success "Database migrations completed"
}

db_seed() {
    log_info "Seeding database..."
    pnpm data:import
    log_success "Database seeded"
}

# ============================================================================
# Health Check
# ============================================================================

health_check() {
    local URL="${1:-http://localhost:3000}"
    log_info "Running health check on $URL..."

    # Wait for server to be ready
    local MAX_ATTEMPTS=30
    local ATTEMPT=0

    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        if curl -s "$URL/api/health" > /dev/null 2>&1; then
            log_success "Health check passed"
            return 0
        fi
        ATTEMPT=$((ATTEMPT + 1))
        sleep 2
    done

    log_error "Health check failed after $MAX_ATTEMPTS attempts"
    return 1
}

# ============================================================================
# Full Deployment Pipeline
# ============================================================================

full_deploy() {
    local TARGET="${1:-vercel}"
    local ENV="${2:-preview}"

    log_info "Starting full deployment pipeline..."
    log_info "Target: $TARGET, Environment: $ENV"

    # Step 1: Validate environment
    validate_env

    # Step 2: Install dependencies
    install_deps

    # Step 3: Run linter
    run_lint

    # Step 4: Run tests
    run_tests

    # Step 5: Build
    build_app

    # Step 6: Deploy
    case "$TARGET" in
        cloudflare)
            deploy_cloudflare
            ;;
        vercel)
            if [ "$ENV" == "prod" ]; then
                deploy_vercel --prod
            else
                deploy_vercel
            fi
            ;;
        docker)
            deploy_docker --push
            ;;
        *)
            log_error "Unknown deployment target: $TARGET"
            exit 1
            ;;
    esac

    log_success "Deployment pipeline completed!"
}

# ============================================================================
# CLI Interface
# ============================================================================

show_help() {
    echo "Chinese Name Generator - Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  validate        Validate environment and dependencies"
    echo "  install         Install dependencies"
    echo "  lint            Run linter"
    echo "  test            Run tests"
    echo "  build           Build the application"
    echo "  deploy          Deploy to target platform"
    echo "    --cloudflare  Deploy to Cloudflare Pages"
    echo "    --vercel      Deploy to Vercel (default)"
    echo "    --docker      Build and push Docker image"
    echo "    --prod        Deploy to production"
    echo "  db:migrate      Run database migrations"
    echo "  db:seed         Seed the database"
    echo "  health          Run health check"
    echo "  full            Run full deployment pipeline"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh full vercel prod    # Full pipeline to Vercel production"
    echo "  ./deploy.sh deploy --cloudflare # Deploy to Cloudflare"
    echo "  ./deploy.sh test                # Run tests only"
}

# Main entry point
main() {
    case "${1:-help}" in
        validate)
            validate_env
            ;;
        install)
            install_deps
            ;;
        lint)
            run_lint
            ;;
        test)
            run_tests
            ;;
        build)
            build_app
            ;;
        deploy)
            case "${2:---vercel}" in
                --cloudflare)
                    deploy_cloudflare "${3:-}"
                    ;;
                --vercel)
                    deploy_vercel "${3:-}"
                    ;;
                --docker)
                    deploy_docker "${3:-}"
                    ;;
                --prod)
                    deploy_vercel --prod
                    ;;
                *)
                    deploy_vercel "${2:-}"
                    ;;
            esac
            ;;
        db:migrate)
            db_migrate
            ;;
        db:seed)
            db_seed
            ;;
        health)
            health_check "${2:-http://localhost:3000}"
            ;;
        full)
            full_deploy "${2:-vercel}" "${3:-preview}"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
