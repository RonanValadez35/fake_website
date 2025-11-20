# Backend Server for Purchase Agreement Portal

This server handles email notifications when users save drafts or download agreements.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory (copy from `env.example`):

```bash
cp env.example .env
```

Edit `.env` with your email configuration:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Recipient Email (where form submissions will be sent)
RECIPIENT_EMAIL=recipient@example.com

# Server Port
PORT=3001
```

### 3. Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an App Password for "Mail"
4. Use this App Password (not your regular password) in `EMAIL_PASSWORD`

### 4. Other Email Services

For other email services (Outlook, Yahoo, custom SMTP), update the configuration:

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

You may need to update `server.js` to use SMTP configuration for non-Gmail services.

### 5. Run the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/send-email`

Sends form data via email.

**Request Body:**
```json
{
  "formData": {
    "buyerName": "John Doe",
    "sellerName": "Jane Smith",
    ...
  },
  "action": "save" | "download"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Notes

- The server uses CORS to allow requests from the frontend
- Email sending failures won't block the user action (saves/downloads will still work)
- Check server logs for email sending status

