#!/bin/bash
# Backend Entrypoint Script
# Creates .env file from Docker environment variables and starts Apache

set -e

echo "Creating backend .env file from environment variables..."

cat > /var/www/html/.env << EOF
# Database Configuration (from Docker environment)
DB_HOST=${DB_HOST}
DB_PORT=3306
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_CHARSET=${DB_CHARSET}

# Application Settings
APP_ENV=${ENV}
DEBUG=${DEBUG}
APP_DEBUG=${DEBUG}
EOF

echo "Backend .env file created successfully"
echo "Starting Apache..."

# Start Apache in foreground
exec apache2-foreground
