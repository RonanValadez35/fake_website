# Purchase Agreement Portal

A professional web application for creating and managing purchase agreements.

## Features

- 📝 Create purchase agreements with a comprehensive form
- 💾 Save drafts for later editing
- 📥 Download agreements as text files
- 📧 Automatic email notifications when saving or downloading
- 🎨 Modern, professional UI design

## Setup

### Frontend

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken).

### Backend

See the [server README](./server/README.md) for detailed backend setup instructions.

Quick setup:

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.example .env
# Edit .env with your email configuration
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3001`.

## Running Both Frontend and Backend

You'll need to run both servers simultaneously:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm start
```

## Email Configuration

The backend sends email notifications when users:
- Save a draft
- Download an agreement

Configure your email settings in `server/.env`. See `server/README.md` for detailed instructions.

## Project Structure

```
fake_website/
├── src/              # Frontend React application
│   ├── FakeWebsite.jsx  # Main component
│   └── ...
├── server/           # Backend Express server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables (create this)
└── ...
```

## Technologies

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Email:** Nodemailer
