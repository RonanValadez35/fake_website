import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS configuration - allow requests from frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Add your Vercel URL here
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // For production, you might want to be more restrictive
      // For now, allow all origins (you can restrict this later)
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());

// Email configuration
const createTransporter = () => {
  // Support for both service-based (Gmail) and SMTP configurations
  if (process.env.EMAIL_SERVICE === 'smtp' || process.env.EMAIL_HOST) {
    // Custom SMTP configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Service-based configuration (Gmail, Outlook, etc.)
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }
};

// Format form data for email
const formatEmailContent = (formData, action) => {
  const sections = [
    { title: 'Agreement Information', fields: ['agreementDate', 'closingDate', 'governingLaw'] },
    { title: 'Party Information', fields: ['buyerName', 'buyerAddress', 'sellerName', 'sellerAddress'] },
    { title: 'Transaction Details', fields: ['assetDescription', 'purchasePrice', 'paymentTerms'] },
    { title: 'Legal Provisions', fields: ['warranties', 'covenants', 'indemnification', 'disputeResolution'] },
    { title: 'Signatures', fields: ['buyerSignature', 'buyerTitle', 'sellerSignature', 'sellerTitle', 'signatureDate'] },
  ];

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 25px; padding: 15px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px; }
        .field { margin-bottom: 12px; }
        .label { font-weight: bold; color: #1e293b; margin-bottom: 4px; }
        .value { color: #475569; padding: 8px; background: white; border-radius: 4px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Purchase Agreement Form Submission</h1>
          <p>Action: <strong>${action}</strong></p>
          <p>Submitted: ${new Date().toLocaleString()}</p>
        </div>
  `;

  sections.forEach(section => {
    const hasData = section.fields.some(field => formData[field]);
    if (hasData) {
      html += `<div class="section"><h2>${section.title}</h2>`;
      section.fields.forEach(field => {
        if (formData[field]) {
          const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          html += `
            <div class="field">
              <div class="label">${label}:</div>
              <div class="value">${formData[field].replace(/\n/g, '<br>')}</div>
            </div>
          `;
        }
      });
      html += `</div>`;
    }
  });

  html += `
        <div class="footer">
          <p>This is an automated email from the Purchase Agreement Portal.</p>
          <p>Do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
  try {
    const { formData, action } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const recipientEmail = process.env.RECIPIENT_EMAIL;
    if (!recipientEmail) {
      console.error('RECIPIENT_EMAIL not configured');
      return res.status(500).json({ error: 'Email recipient not configured' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Purchase Agreement Portal" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Purchase Agreement ${action === 'save' ? 'Draft Saved' : 'Downloaded'} - ${formData.buyerName || 'New Agreement'}`,
      html: formatEmailContent(formData, action),
      text: `Purchase Agreement ${action}\n\n${JSON.stringify(formData, null, 2)}`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully for ${action} action to ${recipientEmail}`);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // More helpful error messages
    let errorMessage = 'Failed to send email';
    if (error.message.includes('Invalid login') || error.message.includes('BadCredentials')) {
      errorMessage = 'Invalid email credentials. Please check your EMAIL_USER and EMAIL_PASSWORD in .env file. Make sure you\'re using an App Password for Gmail.';
    } else if (error.message.includes('Application-specific password')) {
      errorMessage = 'Gmail requires an App Password. Please generate one at https://myaccount.google.com/apppasswords';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Could not connect to email server. Check your internet connection.';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email recipient: ${process.env.RECIPIENT_EMAIL || 'Not configured'}`);
});

