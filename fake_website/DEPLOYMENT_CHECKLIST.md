# Vercel Deployment Checklist

## Pre-Deployment

- [ ] Test build locally: `npm run build`
- [ ] Verify build completes without errors
- [ ] Test the app locally with `npm run preview`
- [ ] Backend server is deployed and accessible
- [ ] Backend CORS is configured to allow your Vercel domain

## Vercel Configuration

- [ ] Create Vercel account or login
- [ ] Import project (via Git or drag & drop)
- [ ] Verify framework detection: **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

## Environment Variables (Vercel Dashboard)

Go to **Settings → Environment Variables** and add:

- [ ] `VITE_API_URL` = Your backend URL
  - Example: `https://your-backend.railway.app`
  - Or: `https://your-backend.render.com`
  - Make sure to set for: Production, Preview, Development

## Backend Configuration

- [ ] Backend is deployed and running
- [ ] Backend `.env` has correct email credentials
- [ ] Backend CORS allows your Vercel domain
- [ ] Backend health check works: `https://your-backend.com/api/health`

## Post-Deployment

- [ ] Visit your Vercel deployment URL
- [ ] Test form submission
- [ ] Click "Save Draft" - verify email is sent
- [ ] Click "Download Agreement" - verify email is sent
- [ ] Check email inbox for submissions
- [ ] Verify no console errors in browser

## Troubleshooting

If emails aren't sending:
- [ ] Check backend logs
- [ ] Verify `VITE_API_URL` is correct in Vercel
- [ ] Check browser console for API errors
- [ ] Verify backend CORS settings

If build fails:
- [ ] Check Vercel build logs
- [ ] Ensure all dependencies are in `package.json`
- [ ] Try building locally first: `npm run build`

## Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod
```

