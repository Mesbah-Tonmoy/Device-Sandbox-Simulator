#!/bin/bash

# Device Sandbox Simulator - Setup Script for Linux/macOS
# This script automates the installation and configuration process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup
main() {
    clear
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║        Device Sandbox Simulator - Setup Script                ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""

    # Step 1: Check prerequisites
    print_header "Step 1: Checking Prerequisites"
    
    # Check PHP
    if command_exists php; then
        PHP_VERSION=$(php -r "echo PHP_VERSION;")
        print_success "PHP installed: v$PHP_VERSION"
        
        # Check if PHP version is >= 8.4
        if php -r "exit(version_compare(PHP_VERSION, '8.4.0', '>=') ? 0 : 1);"; then
            print_success "PHP version is compatible (>= 8.4)"
        else
            print_warning "PHP version is $PHP_VERSION. Recommended: >= 8.4"
        fi
    else
        print_error "PHP is not installed"
        print_info "Install: sudo apt install php8.4 (Ubuntu) or brew install php (macOS)"
        exit 1
    fi

    # Check MySQL
    if command_exists mysql; then
        MYSQL_VERSION=$(mysql --version | grep -oP '\d+\.\d+\.\d+' | head -1)
        print_success "MySQL installed: v$MYSQL_VERSION"
    else
        print_error "MySQL is not installed"
        print_info "Install: sudo apt install mysql-server (Ubuntu) or brew install mysql (macOS)"
        exit 1
    fi

    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed"
        print_info "Install from: https://nodejs.org/"
        exit 1
    fi

    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm installed: v$NPM_VERSION"
    else
        print_error "npm is not installed"
        exit 1
    fi

    echo ""
    sleep 1

    # Step 2: Database setup
    print_header "Step 2: Database Setup"
    
    print_info "Please enter your MySQL credentials:"
    read -p "MySQL username [root]: " DB_USER
    DB_USER=${DB_USER:-root}
    
    read -sp "MySQL password: " DB_PASS
    echo ""
    
    # Test connection
    print_info "Testing MySQL connection..."
    if mysql -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" >/dev/null 2>&1; then
        print_success "MySQL connection successful"
    else
        print_error "Failed to connect to MySQL. Please check your credentials."
        exit 1
    fi

    # Create database
    print_info "Creating database 'device_sandbox'..."
    mysql -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS device_sandbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    print_success "Database created"

    # Import schema
    if [ -f "database/schema.sql" ]; then
        print_info "Importing database schema..."
        mysql -u"$DB_USER" -p"$DB_PASS" device_sandbox < database/schema.sql 2>/dev/null
        print_success "Schema imported successfully"
    else
        print_error "schema.sql not found in database directory"
        exit 1
    fi

    echo ""
    sleep 1

    # Step 3: Backend configuration
    print_header "Step 3: Backend Configuration"
    
    # Create .env file
    if [ -f "backend/.env.example" ]; then
        print_info "Creating .env file..."
        cp backend/.env.example backend/.env
        
        # Update .env with user's credentials
        sed -i.bak "s/DB_USER=root/DB_USER=$DB_USER/" backend/.env
        sed -i.bak "s/DB_PASS=your_password_here/DB_PASS=$DB_PASS/" backend/.env
        rm backend/.env.bak
        
        print_success ".env file created and configured"
    else
        print_warning ".env.example not found, creating .env manually..."
        cat > backend/.env << EOF
DB_HOST=localhost
DB_NAME=device_sandbox
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_CHARSET=utf8mb4
ENV=development
DEBUG=true
EOF
        print_success ".env file created"
    fi

    # Detect Apache document root
    print_info "Detecting Apache configuration..."
    if [ -d "/var/www/html" ]; then
        APACHE_ROOT="/var/www/html"
    elif [ -d "/usr/local/var/www" ]; then
        APACHE_ROOT="/usr/local/var/www"
    elif [ -d "/opt/lampp/htdocs" ]; then
        APACHE_ROOT="/opt/lampp/htdocs"
    else
        print_warning "Could not detect Apache document root"
        read -p "Enter Apache document root path: " APACHE_ROOT
    fi

    print_info "Apache document root: $APACHE_ROOT"
    
    # Copy backend to Apache directory
    print_info "Copying backend to Apache directory..."
    TARGET_DIR="$APACHE_ROOT/device-sandbox-simulator/backend"
    
    sudo mkdir -p "$TARGET_DIR"
    sudo cp -r backend/* "$TARGET_DIR/"
    sudo chown -R www-data:www-data "$TARGET_DIR" 2>/dev/null || sudo chown -R $(whoami):staff "$TARGET_DIR"
    sudo chmod -R 755 "$TARGET_DIR"
    
    print_success "Backend files copied to $TARGET_DIR"

    # Check if mod_rewrite is enabled
    print_info "Checking Apache mod_rewrite..."
    if [ -f "/etc/apache2/mods-enabled/rewrite.load" ]; then
        print_success "mod_rewrite is enabled"
    else
        print_warning "mod_rewrite might not be enabled"
        print_info "Enable with: sudo a2enmod rewrite && sudo systemctl restart apache2"
    fi

    echo ""
    sleep 1

    # Step 4: Frontend setup
    print_header "Step 4: Frontend Setup"
    
    cd frontend
    
    print_info "Installing frontend dependencies..."
    npm install
    print_success "Dependencies installed"

    # Update API URL
    print_info "Configuring API URL..."
    API_URL="http://localhost/device-sandbox-simulator/backend/api"
    
    if [ -f "src/utils/constants.ts" ]; then
        sed -i.bak "s|export const API_BASE_URL = .*|export const API_BASE_URL = '$API_URL';|" src/utils/constants.ts
        rm src/utils/constants.ts.bak
        print_success "API URL configured: $API_URL"
    else
        print_warning "constants.ts not found, please update API_BASE_URL manually"
    fi

    cd ..

    echo ""
    sleep 1

    # Step 5: Verification
    print_header "Step 5: Verification"
    
    # Test backend
    print_info "Testing backend API..."
    BACKEND_URL="http://localhost/device-sandbox-simulator/backend/api/devices/get.php"
    
    if command_exists curl; then
        RESPONSE=$(curl -s "$BACKEND_URL")
        if echo "$RESPONSE" | grep -q "success"; then
            print_success "Backend API is responding correctly"
        else
            print_warning "Backend API response is unexpected"
            print_info "URL: $BACKEND_URL"
        fi
    else
        print_info "curl not available, skipping API test"
        print_info "Test manually: $BACKEND_URL"
    fi

    echo ""

    # Final message
    print_header "Setup Complete! 🎉"
    
    echo -e "${GREEN}Your Device Sandbox Simulator is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Start the frontend development server:"
    echo -e "   ${YELLOW}cd frontend && npm run dev${NC}"
    echo ""
    echo "2. Open your browser:"
    echo -e "   ${YELLOW}http://localhost:5173${NC}"
    echo ""
    echo "3. Backend API is available at:"
    echo -e "   ${YELLOW}$BACKEND_URL${NC}"
    echo ""
    echo "4. Test the application:"
    echo "   • Drag a Light or Fan to the canvas"
    echo "   • Adjust device settings"
    echo "   • Save a preset"
    echo "   • Refresh the page to verify persistence"
    echo ""
    print_info "For troubleshooting, see README.md"
    echo ""
}

# Run main function
main