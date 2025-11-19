# Device Sandbox Simulator

![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A full-stack web application that allows users to interact with and control virtual devices (Light and Fan) in a sandbox environment. Built with React (TypeScript) frontend and PHP backend with MySQL database.

![Demo](demo/demo.gif)

## 🎯 Features

- **Drag & Drop Interface** - Intuitive device placement on canvas
- **Real-time Device Control**
  - **Light**: Power toggle, brightness slider (0-100%), color temperature (warm, neutral, cool, pink)
  - **Fan**: Power toggle, speed control (0-100%)
- **Preset Management** - Save, load and delete device configurations
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Touch Support** - Full mobile touch interaction support
- **Persistent Storage** - All data saved to MySQL database
- **Clean Architecture** - Modular components with proper separation of concerns

---

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS 4.1** - Styling
- **React DnD** - Drag and drop functionality
- **React DnD Touch-Backend** - Touch support for tablet and mobile devices
- **Axios** - HTTP client
- **Context API** - State management

### Backend

- **PHP 8.4** - Server-side logic
- **MySQL 8.0+** - Database
- **Apache** - Web server
- **Custom MVC Architecture**
  - PSR-4 Autoloading
  - RESTful API design
  - Trait-based validation
  - Singleton database pattern

---

## 📋 Prerequisites

Ensure you have the following installed on your system:

### All Operating Systems

- **PHP** >= 8.1
- **MySQL** >= 8.0
- **Apache** >= 2.4 with `mod_rewrite` enabled
- **Node.js** >= 18.0 (includes npm)
- **Git** (for cloning the repository)

### Installation Links

#### Windows

- PHP: [https://windows.php.net/download/](https://windows.php.net/download/)
- MySQL: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- Apache: [https://www.apachelounge.com/download/](https://www.apachelounge.com/download/)
- Node.js: [https://nodejs.org/](https://nodejs.org/)
- XAMPP (All-in-one): [https://www.apachefriends.org/](https://www.apachefriends.org/)

#### macOS

```bash
# Using Homebrew
brew install php@8.4
brew install mysql
brew install httpd
brew install node
```

#### Linux (Ubuntu/Debian)

```bash
# Add PHP repository
sudo add-apt-repository ppa:ondrej/php
sudo apt update

# Install dependencies
sudo apt install php8.4 php8.4-mysql php8.4-cli php8.4-json php8.4-mbstring
sudo apt install mysql-server
sudo apt install apache2
sudo apt install nodejs npm
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mesbah-Tonmoy/Device-Sandbox-Simulator.git
cd Device-Sandbox-Simulator
```

### Step 2: Database Setup

#### 2.1 Create Database

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p
```

Then in MySQL prompt:

```sql
CREATE DATABASE device_sandbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Option B: Using phpMyAdmin**

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Click "New" in the sidebar
3. Database name: `device_sandbox`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

#### 2.2 Import Database Schema

**Option A: Command Line**

```bash
mysql -u root -p device_sandbox < database/schema.sql
```

**Option B: phpMyAdmin**

1. Select `device_sandbox` database
2. Click "Import" tab
3. Choose `database/schema.sql` file
4. Click "Go"

#### 2.3 Configure Database Connection

Edit `backend/.env`:

```ini
# Database Configuration
DB_HOST=localhost
DB_NAME=device_sandbox
DB_USER=root
DB_PASS=your_password_here
DB_CHARSET=utf8mb4

# Environment
ENV=development
```

**Important:** Replace `your_password_here` with your actual MySQL root password.

### Step 3: Backend Setup (Apache)

#### 3.1 Configure Apache Document Root

**Windows (XAMPP)**

1. Edit `C:\xampp\apache\conf\httpd.conf`
2. Find `DocumentRoot` and update:
   ```apache
   DocumentRoot "C:/xampp/htdocs"
   <Directory "C:/xampp/htdocs">
   ```

**macOS (Homebrew)**

1. Edit `/usr/local/etc/httpd/httpd.conf`
2. Update DocumentRoot to your projects folder

**Linux**

1. Edit `/etc/apache2/sites-available/000-default.conf`
2. Update DocumentRoot

#### 3.2 Copy Backend to Apache Directory

**Windows (XAMPP)**

```bash
# Copy backend folder
cp -r backend C:/xampp/htdocs/device-sandbox-simulator/
```

**macOS/Linux**

```bash
# Copy backend folder
sudo cp -r backend /var/www/html/device-sandbox-simulator/
sudo chown -R www-data:www-data /var/www/html/device-sandbox-simulator/
```

#### 3.3 Enable Apache mod_rewrite (if not enabled)

**Windows (XAMPP)**

- Edit `httpd.conf`
- Uncomment: `LoadModule rewrite_module modules/mod_rewrite.so`

**macOS**

```bash
sudo a2enmod rewrite
sudo apachectl restart
```

**Linux**

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### 3.4 Set Permissions

**macOS/Linux**

```bash
sudo chmod -R 755 /var/www/html/device-sandbox-simulator/
sudo chmod -R 777 /var/www/html/device-sandbox-simulator/backend/logs/
```

#### 3.5 Verify Backend

Open browser and navigate to:

```
http://localhost/device-sandbox-simulator/backend/api/devices/get.php
```

Expected response:

```json
{
  "success": true,
  "message": "No device on canvas"
}
```

### Step 4: Frontend Setup

#### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

#### 4.2 Configure API URL

Edit `frontend/src/utils/constants.ts`:

```typescript
// Update this line with your backend URL
export const API_BASE_URL =
  "http://localhost/device-sandbox-simulator/backend/api";
```

#### 4.3 Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another available port).

### Step 5: Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the Device Sandbox Simulator interface
3. Try dragging a Light or Fan device to the canvas
4. Test device controls (power, brightness/speed)
5. Save a preset and reload the page to verify persistence

---

## 🎮 Usage Guide

### Adding Devices

1. **Drag from Sidebar** - Click and drag a Light or Fan icon from the left sidebar
2. **Drop on Canvas** - Drop it anywhere on the "Testing Canvas" area
3. **Device appears centered** - The device will be placed in the center with its control panel

### Controlling Devices

#### Light Controls

- **Power Toggle** - Click to turn the light on/off
- **Brightness Slider** - Adjust brightness from 0-100%
- **Color Temperature** - Choose between Warm, Neutral, Cool, or Pink

#### Fan Controls

- **Power Toggle** - Click to turn the fan on/off
- **Speed Slider** - Adjust fan speed from 0-100%

### Managing Presets

1. **Save Preset**

   - Configure a device with desired settings
   - Click "Save Preset" button
   - Enter a unique name
   - Click "Save"

2. **Load Preset**

   - Drag a saved preset from the sidebar
   - Drop on canvas
   - Device will load with saved settings

3. **Delete Preset**
   - Click the trash icon on any preset in the sidebar
   - Click "OK" to confirm deletion

### Mobile Usage

- **Open Sidebar** - Tap the hamburger menu icon (☰)
- **Drag Devices** - Long-press and drag items
- **Touch Controls** - Tap toggles, slide controls work with touch
- **Close Sidebar** - Tap outside or the X button

---

## 📁 Project Structure

```
device-sandbox-simulator/
├── backend/
│   ├── api/
│   │   ├── devices/
│   │   │   ├── delete.php
│   │   │   ├── get.php
│   │   │   └── save.php
│   │   └── presets/
│   │       ├── delete.php
│   │       ├── get.php
│   │       ├── list.php
│   │       └── save.php
│   ├── config/
│   │   ├── Autoloader.php
│   │   ├── cors.php
│   │   └── env.php
│   ├── DeviceSandbox/
│   │   ├── Config/
│   │   │   ├── Database.php
│   │   │   └── Response.php
│   │   ├── Controllers/
│   │   │   └── BaseController.php
│   │   ├── Interfaces/
│   │   │   └── ModelInterface.php
│   │   ├── Models/
│   │   │   ├── BaseModel.php
│   │   │   ├── Device.php
│   │   │   └── Preset.php
│   │   └── Traits/
│   │       └── ValidatesDeviceSettings.php
│   ├── .env
│   ├── .env.example
│   └── .htaccess
│
├── database/
│   └── schema.sql
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Canvas/
    │   │   ├── Controls/
    │   │   ├── Devices/
    │   │   ├── Icons/
    │   │   ├── Modals/
    │   │   ├── Notification/
    │   │   └── Sidebar/
    │   ├── context/
    │   │   └── DeviceContext.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── utils/
    │   │   └── constants.ts
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 🏗️ Architecture Overview

### Backend Architecture

- **MVC Pattern** - Separation of concerns
- **PSR-4 Autoloading** - Modern PHP class loading
- **RESTful API** - Standard HTTP methods and status codes
- **Singleton Pattern** - Single database connection
- **Trait-based Validation** - Reusable validation logic
- **CORS Handling** - Secure cross-origin requests

### Frontend Architecture

- **Component-based** - Reusable React components
- **Context API** - Centralized state management
- **TypeScript** - Type-safe development
- **Custom Hooks** - Reusable logic (useDevice)
- **Service Layer** - API abstraction
- **Constants** - Centralized configuration

### Database Design

- **devices** table - Stores current device on canvas (only one)
- **presets** table - Stores saved device configurations
- **JSON columns** - Flexible settings storage
- **Proper indexing** - Optimized queries
- **Constraints** - Data integrity

---

## 🧪 API Documentation

### Base URL

```
http://localhost/device-sandbox-simulator/backend/api
```

### Endpoints

#### **Get Current Device**

```http
GET /devices/get.php
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "light",
    "settings": {
      "power": true,
      "brightness": 75,
      "colorTemp": "cool"
    }
  }
}
```

#### **Save Device**

```http
POST /devices/save.php
Content-Type: application/json

{
  "type": "light",
  "settings": {
    "power": false,
    "brightness": 0,
    "colorTemp": "warm"
  }
}
```

#### **Delete Device**

```http
DELETE /devices/delete.php
```

#### **Get All Presets**

```http
GET /presets/list.php
```

#### **Save Preset**

```http
POST /presets/save.php
Content-Type: application/json

{
  "name": "Bright Cool Light",
  "device_type": "light",
  "device_settings": {
    "power": true,
    "brightness": 100,
    "colorTemp": "cool"
  }
}
```

#### **Delete Preset**

```http
DELETE /presets/delete.php/{id}
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "Database connection failed"

```
Solution:
1. Check MySQL is running
2. Verify credentials in backend/.env
3. Ensure database 'device_sandbox' exists
```

**Problem:** "404 Not Found" on API endpoints

```
Solution:
1. Verify backend is in Apache htdocs directory
2. Check .htaccess file exists
3. Ensure mod_rewrite is enabled
4. Restart Apache
```

**Problem:** "CORS policy" errors in browser console

```
Solution:
1. Check backend/config/cors.php includes your frontend URL
2. Verify Apache mod_headers is enabled
3. Clear browser cache
```

**Problem:** "Permission denied" errors

```
Solution (Linux/macOS):
sudo chmod -R 755 /path/to/backend
sudo chown -R www-data:www-data /path/to/backend
```

### Frontend Issues

**Problem:** "Cannot connect to server"

```
Solution:
1. Verify backend URL in constants.ts
2. Check backend is running and accessible
3. Test API directly in browser
```

**Problem:** "Module not found" errors

```
Solution:
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🔒 Security Considerations

- ✅ Input sanitization in backend
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS configuration
- ✅ XSS protection headers
- ✅ Directory browsing disabled
- ✅ .env file protection
- ⚠️ **Note:** This is a development setup. For production:
  - Use environment-specific .env files
  - Enable HTTPS
  - Implement authentication
  - Add rate limiting
  - Use production database credentials

---

## 📄 License

This project is created for interview purposes and educational use.

---

## 👨‍💻 Author

Created by Md. Mesbah Hossain

---

## 📞 Support

For issues or questions:

1. Check the Troubleshooting section above
2. Review API documentation
3. Contact: mesbahhossain@gmail.com
