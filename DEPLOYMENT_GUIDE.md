# Deployment Guide - StockMaster

## 📦 Build & Deploy Instructions

### **Backend Build**

```bash
# Navigate to backend
cd backend

# Build (validates Node.js syntax)
npm run build

# Output: "Backend build successful - No compilation needed for Node.js"

# This prepares dependencies for production
npm install --production
```

### **Frontend Build**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build optimized production bundle
npm run build

# Output: Generates `/build` folder with optimized files
```

---

## 🚀 Production Deployment Steps

### **Step 1: Prepare Backend**

```bash
cd backend
npm run build
npm install --production
```

### **Step 2: Prepare Frontend**

```bash
cd frontend
npm run build
npm install --production
```

### **Step 3: Create .env File (Production)**

Backend `.env`:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-long-random-secret-key
JWT_EXPIRE=7d
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-app-password
```

### **Step 4: Deploy Backend**

**Option A: Heroku**
```bash
# Install Heroku CLI
# Login and create app
heroku create stockmaster-api
heroku config:set NODE_ENV=production
git push heroku main
```

**Option B: Railway/Render**
- Connect GitHub repo
- Set environment variables
- Auto-deploy on push

**Option C: Traditional Server (VPS)**
```bash
# SSH into server
ssh user@your-server

# Install Node.js, MongoDB
# Clone repository
git clone <repo-url>
cd backend
npm install --production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "stockmaster-api"
pm2 startup
pm2 save
```

### **Step 5: Deploy Frontend**

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

**Option B: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

**Option C: AWS S3 + CloudFront**
```bash
cd frontend
npm run build

# Upload dist/ to S3
aws s3 sync dist/ s3://your-bucket-name
```

---

## 📋 Deployment Checklist

- [ ] Backend build completes successfully
- [ ] Frontend build creates optimized bundle
- [ ] Environment variables set correctly
- [ ] MongoDB URI points to production database
- [ ] API CORS origin updated to frontend domain
- [ ] JWT secret is strong and unique
- [ ] SSL/TLS certificates installed
- [ ] Database backups configured
- [ ] Monitoring/logging setup
- [ ] Test all CRUD operations
- [ ] Security headers configured

---

## 🔍 Verify Deployment

```bash
# Check backend health
curl https://your-api-domain.com/api/health

# Should return:
# {"message":"StockMaster API is running!","timestamp":"...","environment":"production"}

# Test API endpoint
curl https://your-api-domain.com/api/warehouses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 Production File Structure

```
stockmaster-production/
├── backend/
│   ├── node_modules/
│   ├── routes/
│   ├── models/
│   ├── server.js
│   ├── .env (production)
│   └── package.json
├── frontend/
│   ├── dist/           # Built optimized files
│   ├── node_modules/
│   └── package.json
└── README.md
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install` first, check Node.js version |
| CORS errors | Update `FRONTEND_URL` in backend `.env` |
| Database connection | Verify `MONGODB_URI` credentials |
| API not responding | Check server logs with `pm2 logs` |
| Frontend blank page | Check browser console for errors, verify API URL |

---

## 💡 Quick Deploy Commands

```bash
# Build everything
npm run build  # (run in each folder)

# Test production build locally
# Backend
NODE_ENV=production npm start

# Frontend
npm run preview

# Deploy
vercel deploy --prod  # Frontend
heroku push         # Backend
```

---

**Now you're ready to deploy! 🚀**
