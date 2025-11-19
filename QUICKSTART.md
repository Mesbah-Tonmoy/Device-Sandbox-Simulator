# Quick Start Guide

## ⚡ Prerequisites

Make sure you have:

- ✅ PHP 8.1+
- ✅ MySQL 8.0+
- ✅ Apache (or XAMPP/MAMP/WAMP)
- ✅ Node.js 18+

---

## 🚀 5-Minute Setup

### Step 1: Database (2 minutes)

```bash
# Create database
mysql -u root -p
```

```sql
CREATE DATABASE device_sandbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

```bash
# Import schema
mysql -u root -p device_sandbox < database/schema.sql
```

### Step 2: Configure Backend (1 minute)

Edit `backend/.env`:

```ini
DB_HOST=localhost
DB_NAME=device_sandbox
DB_USER=root
DB_PASS=your_mysql_password
```

### Step 3: Setup Apache (1 minute)

**Copy backend to Apache directory:**

**Windows (XAMPP):**

```bash
cp -r backend C:\xampp\htdocs\device-sandbox-simulator\backend
```

**Mac/Linux:**

```bash
sudo cp -r backend /var/www/html/device-sandbox-simulator/
```

**Test backend:**
Open: `http://localhost/device-sandbox-simulator/backend/api/devices/get.php`

Expected: `{"success":true,"message":"No device on canvas"}`

### Step 4: Frontend (1 minute)

```bash
cd frontend
npm install
```

Edit `frontend/src/utils/constants.ts`:

```typescript
export const API_BASE_URL =
  "http://localhost/device-sandbox-simulator/backend/api";
```

```bash
npm run dev
```

Open: `http://localhost:5173`

---

## ✅ Verify It Works

1. Drag Light icon to canvas
2. Toggle power ON
3. Adjust brightness
4. Click "Save Preset"
5. Refresh page - device should persist

---

## 🐛 Common Issues

**Backend 404 Error:**

```bash
# Enable Apache mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**CORS Error:**

- Check `backend/config/cors.php` allows localhost
- Clear browser cache

**Database Connection Failed:**

- Verify MySQL is running
- Check credentials in `.env`

---

## 📞 Need Help?

See full README.md for detailed instructions and troubleshooting.
