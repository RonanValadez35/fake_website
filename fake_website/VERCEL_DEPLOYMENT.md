# Deploying to Vercel

This guide will help you deploy the Purchase Agreement Portal frontend to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your backend server deployed (or running locally for testing)
- Git repository (optional, but recommended)

## Step 1: Prepare Your Code

1. **Ensure your code is ready:**
   ```bash
   npm run build
   ```
   This should complete without errors.

2. **Set up environment variables** (see Step 3)

## Step 2: Deploy via Vercel Dashboard

### Option A: Deploy via Vercel Website (Easiest)

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Or drag and drop your project folder
4. Vercel will auto-detect it's a Vite project
5. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production: `vercel --prod`

## Step 3: Configure Environment Variables

**Important:** Set these in Vercel for the serverless functions.

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**

2. Add these variables (for Production, Preview, and Development):
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `your-email@gmail.com`
   - `EMAIL_PASSWORD` = `your-16-char-app-password` (Gmail App Password)
   - `RECIPIENT_EMAIL` = `rvaladez2134@gmail.com`

3. **Note:** You don't need `VITE_API_URL` - the frontend uses relative paths (`/api`) since everything is on the same domain.

## Step 4: Backend is Already Included!

✅ Your backend is now part of this Vercel project as serverless functions in the `api/` folder:
- `/api/send-email` - Handles email sending
- `/api/health` - Health check endpoint

No separate backend deployment needed! Everything runs on Vercel.

## Step 5: Update CORS (Backend)

Make sure your backend allows requests from your Vercel domain:

In `server/server.js`, update CORS:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'
  ]
}));
```

Or allow all origins (for development):
```javascript
app.use(cors({
  origin: '*'
}));
```

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Fill out the form
3. Click "Save Draft" or "Download Agreement"
4. Check your email inbox for the submission

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally first

### API Connection Errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend CORS settings
- Ensure backend is running and accessible

### Environment Variables Not Working
- Vercel requires a redeploy after adding environment variables
- Make sure variable names start with `VITE_` for Vite projects
- Check that variables are set for the correct environment (Production/Preview/Development)

## Continuous Deployment

Once connected to Git:
- Every push to main branch = automatic production deployment
- Pull requests = preview deployments

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls
```

