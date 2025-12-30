# Quick MongoDB Setup Guide

## Option 1: MongoDB Community (Windows) - Easiest

### Step 1: Download MongoDB

1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - **Version:** Latest (e.g., 7.0.x)
   - **OS:** Windows
   - **Package:** MSI
3. Click "Download"

### Step 2: Install MongoDB

1. Run the downloaded MSI file
2. Follow the installer:
   - Accept license terms
   - Select "Complete" installation
   - Install MongoDB Compass (GUI tool) - recommended
3. Complete installation

### Step 3: Start MongoDB Service

```powershell
# Open PowerShell as Administrator and run:
net start MongoDB

# Verify it's running:
Get-Service MongoDB
```

### Step 4: Verify Connection

```powershell
cd d:\node\blogs
npm start

# Should show: "MongoDB Connected: localhost"
```

---

## Option 2: Docker (Recommended for Clean Setup)

### Step 1: Install Docker Desktop

- Download from: https://www.docker.com/products/docker-desktop
- Install and restart Windows

### Step 2: Start MongoDB Container

```powershell
# Pull MongoDB image (first time only)
docker pull mongo:latest

# Run MongoDB container
docker run -d --name cms-mongo -p 27017:27017 mongo:latest

# Verify it's running
docker ps

# Check logs
docker logs cms-mongo
```

### Step 3: Test Connection

```powershell
cd d:\node\blogs
npm start

# Should show: "MongoDB Connected: localhost"
```

### Step 4: Stop MongoDB (when done)

```powershell
docker stop cms-mongo
docker rm cms-mongo
```

---

## Option 3: MongoDB Atlas (Cloud - No Local Installation)

### Step 1: Create Free Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account with email

### Step 2: Create a Cluster

1. Click "Create"
2. Select "Shared" (Free tier)
3. Choose your region (closest to you)
4. Click "Create Cluster"

### Step 3: Get Connection String

1. Go to "Database" → "Connect"
2. Click "Drivers"
3. Copy the connection string
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/cms-db`

### Step 4: Update .env File

```env
# Replace localhost with Atlas connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/cms-db
```

### Step 5: Test Connection

```powershell
cd d:\node\blogs
npm start

# Should show: "MongoDB Connected: ..."
```

---

## Running Full API Tests

### After MongoDB is Running:

```powershell
# 1. Navigate to project
cd d:\node\blogs

# 2. Start the server
npm start

# 3. In another PowerShell window, run tests
node test-api.js
```

### Expected Output:

```
=== CMS Backend API Test Suite ===

✓ GET /api/health - Health Check (200)
✓ POST /api/admin/login - Admin Login (500 first time - DB empty)
✓ GET /api/content - Get Content Items (200)
✓ GET /api/pages - Get Pages (200)
✓ GET /api/admins - Get All Admins (401 - needs auth)
✓ GET /api/admin/profile - Get Admin Profile (401 - needs auth)

=== Test Summary ===
Total: 6, Passed: 6, Failed: 0
```

---

## Create Test Admin User

To fully test authentication, create an admin user first:

```powershell
# Use MongoDB CLI (if installed locally)
mongo

# Or use MongoDB Compass GUI:
# 1. Open MongoDB Compass
# 2. Connect to localhost:27017
# 3. Create database: cms-db
# 4. Create collection: admins
# 5. Insert document:
```

**Sample Admin Document:**

```json
{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "$2b$10$...", // bcrypt hash of "password123"
  "role": "super_admin",
  "isActive": true,
  "createdAt": ISODate("2024-12-29T00:00:00Z"),
  "updatedAt": ISODate("2024-12-29T00:00:00Z")
}
```

**OR use the API to create admin** (once MongoDB is running):

```powershell
# Test creating admin via API
$body = @{
    name = "Test Admin"
    email = "admin@test.com"
    password = "password123"
    role = "super_admin"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/admins" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

---

## Troubleshooting

### MongoDB not starting

```powershell
# Check if service is installed
Get-Service MongoDB

# If not found, reinstall MongoDB Community Edition
# Or use Docker instead
```

### Connection refused on localhost:27017

```powershell
# Verify MongoDB is running
netstat -ano | findstr :27017

# If nothing shown, MongoDB is not running
# Start it with: net start MongoDB (Windows)
# Or: mongod (for manual start)
```

### Port 5000 already in use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Then start server again
npm start
```

### "MONGODB_URI not found"

```powershell
# Verify .env file exists in d:\node\blogs
Test-Path d:\node\blogs\.env

# Check contents
Get-Content d:\node\blogs\.env
```

---

## Next Steps

1. ✅ **Choose MongoDB setup** (Local, Docker, or Atlas)
2. ✅ **Install/configure MongoDB**
3. ✅ **Verify connection** in server logs
4. ✅ **Run full test suite** with `node test-api.js`
5. ✅ **Review API_TEST_REPORT.md** for detailed results

---

**Current Status:** Server running, awaiting MongoDB connection for full testing
**Server Location:** http://localhost:5000
**Health Check:** ✅ Working
**API Docs:** See ADMIN_API_DOCUMENTATION.md
