# Backend Deployment Guide

This guide covers deploying the Purchase Agreement Portal backend to various platforms.

## Quick Platform Comparison

| Platform | Free Tier | Ease | Best For |
|----------|-----------|------|----------|
| **Railway** | ✅ Yes | ⭐⭐⭐⭐⭐ | Easiest, great for beginners |
| **Render** | ✅ Yes | ⭐⭐⭐⭐ | Simple, reliable |
| **Heroku** | ❌ No | ⭐⭐⭐ | Established, but paid |
| **Fly.io** | ✅ Yes | ⭐⭐⭐ | Global edge deployment |

---

## 🚂 Railway (Recommended - Easiest)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended) or email

### Step 2: Deploy
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"** (or upload code)
3. Select your repository
4. Railway auto-detects Node.js

### Step 3: Configure Environment Variables
Go to your project → **Variables** tab, add:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=rvaladez2134@gmail.com
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=3001
```

### Step 4: Get Your Backend URL
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.railway.app`)

### Step 5: Update Frontend
In Vercel, update `VITE_API_URL` to your Railway URL.

---

## 🎨 Render

### Step 1: Create Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Deploy
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name:** `purchase-agreement-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### Step 3: Environment Variables
In **Environment** section, add:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=rvaladez2134@gmail.com
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Step 4: Deploy
Click **"Create Web Service"**
- Render will build and deploy
- Get your URL: `https://your-app.onrender.com`

---

## 🚀 Heroku

### Step 1: Install Heroku CLI
```bash
brew install heroku/brew/heroku  # macOS
# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login
```bash
heroku login
```

### Step 3: Create App
```bash
cd server
heroku create your-app-name
```

### Step 4: Set Environment Variables
```bash
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set RECIPIENT_EMAIL=rvaladez2134@gmail.com
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 5: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Step 6: Get URL
```bash
heroku open
# Or check: heroku info
```

---

## 🪰 Fly.io

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Initialize
```bash
cd server
fly launch
```
- Follow prompts
- Select region
- Don't deploy yet

### Step 4: Set Secrets
```bash
fly secrets set EMAIL_SERVICE=gmail
fly secrets set EMAIL_USER=your-email@gmail.com
fly secrets set EMAIL_PASSWORD=your-app-password
fly secrets set RECIPIENT_EMAIL=rvaladez2134@gmail.com
fly secrets set FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 5: Deploy
```bash
fly deploy
```

---

## 🔧 Environment Variables Checklist

All platforms need these variables:

- [ ] `EMAIL_SERVICE` = `gmail`
- [ ] `EMAIL_USER` = Your Gmail address
- [ ] `EMAIL_PASSWORD` = Gmail App Password (16 characters)
- [ ] `RECIPIENT_EMAIL` = Where to send form submissions
- [ ] `FRONTEND_URL` = Your Vercel frontend URL
- [ ] `PORT` = Usually auto-set by platform (3001 for local)

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible: `https://your-backend.com/api/health`
- [ ] Health check returns: `{"status":"ok"}`
- [ ] Update `VITE_API_URL` in Vercel with backend URL
- [ ] Test form submission from frontend
- [ ] Verify emails are being sent
- [ ] Check backend logs for errors

---

## 🐛 Troubleshooting

### Server Won't Start
- Check logs in platform dashboard
- Verify all environment variables are set
- Ensure Node.js version is compatible (>=18)

### Email Not Sending
- Verify `EMAIL_PASSWORD` is App Password (not regular password)
- Check backend logs for specific error
- Test email credentials locally first

### CORS Errors
- Update `FRONTEND_URL` in backend environment variables
- Or update CORS in `server.js` to allow your Vercel domain

### Port Issues
- Most platforms set `PORT` automatically
- Don't hardcode port in production
- Use `process.env.PORT || 3001`

---

## 📝 Quick Commands

### Check Deployment Status
```bash
# Railway
railway status

# Render
# Check dashboard

# Heroku
heroku logs --tail

# Fly.io
fly status
fly logs
```

### Update Environment Variables
```bash
# Heroku
heroku config:set KEY=value

# Fly.io
fly secrets set KEY=value

# Railway/Render: Use dashboard
```

---

## 🔗 Next Steps

After backend is deployed:
1. Copy your backend URL
2. Update `VITE_API_URL` in Vercel
3. Test the full flow: Form → Save/Download → Email
4. Monitor logs for any issues

