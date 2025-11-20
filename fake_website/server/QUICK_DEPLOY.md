# Quick Backend Deployment Guide

## 🚂 Railway (Fastest & Easiest - Recommended)

### 5-Minute Setup:

1. **Sign up:** https://railway.app (use GitHub)

2. **Deploy:**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repo
   - Railway auto-detects everything!

3. **Add Environment Variables:**
   - Go to project → **Variables** tab
   - Add these (copy from your local `.env`):
     ```
     EMAIL_SERVICE=gmail
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-16-char-app-password
     RECIPIENT_EMAIL=rvaladez2134@gmail.com
     FRONTEND_URL=https://your-vercel-app.vercel.app
     ```

4. **Get Your URL:**
   - Settings → Networking → Generate Domain
   - Copy URL: `https://your-app.railway.app`

5. **Update Frontend:**
   - In Vercel → Settings → Environment Variables
   - Update `VITE_API_URL` = `https://your-app.railway.app`

**Done!** ✅

---

## 🎨 Render (Alternative)

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Build: `npm install`
   - Start: `node server.js`
5. Add environment variables (same as Railway)
6. Deploy!

---

## ✅ Test Your Deployment

1. Visit: `https://your-backend.railway.app/api/health`
2. Should see: `{"status":"ok","timestamp":"..."}`
3. If working, update Vercel `VITE_API_URL`
4. Test form submission from frontend

---

## 🔧 Troubleshooting

**Server not starting?**
- Check logs in Railway/Render dashboard
- Verify all env variables are set

**CORS errors?**
- Make sure `FRONTEND_URL` is set in backend
- Update CORS in `server.js` if needed

**Email not sending?**
- Verify `EMAIL_PASSWORD` is App Password (16 chars)
- Check backend logs for specific error

---

## 📋 Environment Variables Checklist

Copy these to your deployment platform:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=rvaladez2134@gmail.com
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**That's it!** Your backend should be live! 🚀

