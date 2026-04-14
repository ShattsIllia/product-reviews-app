#!/bin/bash

# Product Reviews App - Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Product Reviews App - Development Setup"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
log_info "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    log_error "Node.js not found. Please install Node.js 20.11+"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    log_error "pnpm not found. Install with: npm install -g pnpm"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker"
    exit 1
fi

log_success "All prerequisites installed"

# Install dependencies
log_info "Installing dependencies..."
pnpm install
log_success "Dependencies installed"

# Create .env file if doesn't exist
if [ ! -f .env ]; then
    log_info "Creating .env file..."
    cp .env.example .env
    log_success ".env created (update with your values)"
else
    log_success ".env already exists"
fi

# Start Docker containers
log_info "Starting Docker containers..."
docker-compose up -d
log_success "Docker containers started"

# Wait for database
log_info "Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
log_info "Running database migrations..."
pnpm db:migrate
log_success "Migrations completed"

# Seed database
log_info "Seeding database with demo data..."
pnpm db:seed
log_success "Database seeded"

# Done!
echo ""
log_success "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "  1. Update .env file if needed"
echo "  2. Run: pnpm dev (start both services)"
echo ""
echo "Services will be available at:"
echo "  Frontend:  http://localhost:4200"
echo "  Backend:   http://localhost:3000"
echo "  Database:  http://localhost:5432"
echo ""
echo "Demo credentials:"
echo "  Admin:  admin@example.com / admin123"
echo "  User1:  user1@example.com / password123"
echo "  User2:  user2@example.com / password123"
echo ""
