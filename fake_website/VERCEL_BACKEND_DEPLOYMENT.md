# Deploying Backend to Vercel (Serverless Functions)

Your backend is now configured as Vercel serverless functions! Both frontend and backend will be on the same Vercel project.

## ✅ What's Already Set Up

- ✅ `api/send-email.js` - Email sending endpoint
- ✅ `api/health.js` - Health check endpoint
- ✅ `vercel.json` - Configured for API routes
- ✅ Frontend updated to use relative API paths

## 🚀 Deployment Steps

### Step 1: Install Dependencies

Make sure `nodemailer` is installed in the root:

```bash
npm install nodemailer
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect the project
5. Click **"Deploy"**

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Environment Variables

**Critical:** Set these in Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables (for Production, Preview, and Development):

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
RECIPIENT_EMAIL=rvaladez2134@gmail.com
```

**Important:**
- `EMAIL_PASSWORD` must be a Gmail App Password (16 characters)
- Don't set `VITE_API_URL` - the frontend will use relative paths (`/api`)

### Step 4: Redeploy

After adding environment variables:
- Vercel will automatically redeploy
- Or manually trigger: **Deployments** → **Redeploy**

## 🧪 Testing

### Test Health Endpoint

Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### Test Email Endpoint

1. Visit your frontend: `https://your-app.vercel.app`
2. Fill out the form
3. Click "Save Draft" or "Download Agreement"
4. Check your email inbox

## 📁 Project Structure

```
fake_website/
├── api/                    # Serverless functions
│   ├── send-email.js      # Email API endpoint
│   └── health.js          # Health check
├── src/                    # Frontend React app
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies (includes nodemailer)
```

## 🔧 How It Works

- **Frontend:** Serves from `dist/` directory
- **API Routes:** Files in `api/` become serverless functions
  - `/api/send-email` → `api/send-email.js`
  - `/api/health` → `api/health.js`
- **Same Domain:** Both frontend and API on same Vercel domain
- **No CORS Issues:** Same origin = no CORS needed

## 🐛 Troubleshooting

### Email Not Sending

1. **Check Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify all are set correctly
   - Make sure `EMAIL_PASSWORD` is App Password (not regular password)

2. **Check Vercel Logs:**
   - Go to your project → **Deployments**
   - Click on latest deployment → **Functions** tab
   - Check logs for errors

3. **Test Locally:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Run locally
   vercel dev
   ```

### Build Errors

- Ensure `nodemailer` is in `package.json` dependencies
- Run `npm install` before deploying
- Check Vercel build logs

### API Not Found (404)

- Verify `vercel.json` has the API rewrite rules
- Check that `api/` folder is in the root directory
- Ensure files are named correctly (`send-email.js`, `health.js`)

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_SERVICE` | Yes | `gmail` (or other service) |
| `EMAIL_USER` | Yes | Your Gmail address |
| `EMAIL_PASSWORD` | Yes | Gmail App Password (16 chars) |
| `RECIPIENT_EMAIL` | Yes | Where to send form submissions |

## ✅ Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Health endpoint works: `/api/health`
- [ ] Form submission works
- [ ] Emails are being sent
- [ ] Check Vercel logs for any errors

## 🎉 Benefits of Vercel Serverless

- ✅ **Same Domain:** Frontend and backend together
- ✅ **No CORS:** Same origin = no CORS issues
- ✅ **Auto-scaling:** Serverless functions scale automatically
- ✅ **Free Tier:** Generous free tier for serverless functions
- ✅ **Fast Deployments:** Quick builds and deployments
- ✅ **Easy Management:** One project for everything

Your backend is now ready to deploy on Vercel! 🚀

