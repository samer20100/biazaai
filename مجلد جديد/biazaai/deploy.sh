#!/bin/bash

# Biazaai Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/$TIMESTAMP"

echo "🚀 Starting Biazaai deployment for $ENVIRONMENT environment..."

# Load environment-specific variables
if [ -f "./.env.$ENVIRONMENT" ]; then
    source "./.env.$ENVIRONMENT"
    echo "✅ Loaded environment variables from .env.$ENVIRONMENT"
else
    echo "⚠️  No .env.$ENVIRONMENT file found, using defaults"
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "📂 Backup directory created: $BACKUP_DIR"

# Backup database (if MongoDB is running)
if command -v mongodump &> /dev/null; then
    echo "💾 Backing up MongoDB..."
    mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/db" || echo "⚠️  MongoDB backup failed, continuing..."
else
    echo "⚠️  mongodump not found, skipping database backup"
fi

# Backup uploads directory
if [ -d "./server/uploads" ]; then
    echo "💾 Backing up uploads..."
    cp -r ./server/uploads "$BACKUP_DIR/uploads" || echo "⚠️  Uploads backup failed"
fi

# Stop existing containers
echo "🛑 Stopping existing Docker containers..."
docker-compose down || true

# Pull latest images (if using registry)
# docker-compose pull

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Run database migrations (if any)
echo "📊 Running database migrations..."
docker-compose exec backend node src/migrations/run.js || echo "⚠️  No migrations found or migration failed"

# Health check
echo "🏥 Performing health check..."
sleep 10
curl -f http://localhost:5000/api/health || {
    echo "❌ Health check failed!"
    docker-compose logs backend
    exit 1
}

echo "✅ Health check passed!"

# Clear old backups (keep last 5)
echo "🧹 Cleaning old backups..."
ls -dt ./backups/* | tail -n +6 | xargs rm -rf 2>/dev/null || true

echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 MongoDB: mongodb://localhost:27017"
echo "📝 Logs: docker-compose logs -f"

# Display deployment summary
echo ""
echo "📋 Deployment Summary:"
echo "   Environment: $ENVIRONMENT"
echo "   Timestamp: $TIMESTAMP"
echo "   Backup: $BACKUP_DIR"
echo "   Status: ✅ Running"

exit 0