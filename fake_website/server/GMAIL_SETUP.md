# Gmail App Password Setup Guide

## Why App Password?
Gmail doesn't allow regular passwords for third-party apps. You need to create an **App Password**.

## Step-by-Step Instructions

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the prompts to enable 2FA (if not already enabled)

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Type "Purchase Agreement Server"
4. Click **Generate**
5. Copy the 16-character password (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace `EMAIL_PASSWORD` in `server/.env` with the App Password:

```env
EMAIL_PASSWORD=abcdefghijklmnop
```
(Remove spaces if any - it should be 16 characters without spaces)

### Step 4: Restart Server
Stop the server (Ctrl+C) and restart:
```bash
npm start
```

## Important Notes
- ✅ Use the **App Password** (16 characters), NOT your regular Gmail password
- ✅ The App Password has no spaces
- ✅ Keep the App Password secure - treat it like a password
- ✅ You can revoke App Passwords anytime from the same page

## Troubleshooting
- If you get "Username and Password not accepted": You're using the wrong password
- If App Passwords option is missing: Enable 2FA first
- If still not working: Make sure you're using the email address that has 2FA enabled

