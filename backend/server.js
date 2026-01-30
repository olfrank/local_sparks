const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Resend } = require('resend');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
const ROOT_DIR = path.join(__dirname);
dotenv.config({ path: path.join(ROOT_DIR, '.env') });

// MongoDB connection
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

const hasMongo = !!mongoUrl && !!dbName;

// Connect to MongoDB
if (hasMongo) {
  mongoose.connect(mongoUrl, { dbName })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      // Don't kill server if email is configured
      if (!process.env.RESEND_API_KEY) process.exit(1);
    });
} else {
  console.log('MongoDB not configured (skipping).');
}

// Define StatusCheck Schema
const statusCheckSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
  },
  client_name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
}, {
  versionKey: false, // Don't include __v field
});

// Transform to exclude _id and use id instead
statusCheckSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

const StatusCheck = mongoose.model('StatusCheck', statusCheckSchema, 'status_checks');

// Contact request schema (fallback when Resend not configured)
const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  town: { type: String, required: true },
  bestTime: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
}, { versionKey: false });
const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema, 'contact_requests');

// Resend client (used when RESEND_API_KEY is set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendContactEmail({ name, email, phone, town, time }) {
  const from = process.env.MAILER_FROM;
  const to = process.env.MAILER_TO || 'olle@callguard360.com';
  if (!from || !resend) throw new Error('Mailer not configured');
  return await resend.emails.send({
    from,
    to,
    subject: 'New CallGuard enquiry',
    html: `
      <h2>New enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Town:</strong> ${town}</p>
      <p><strong>Best time to call:</strong> ${time}</p>
    `,
  });
}

async function sendCustomerConfirmationEmail({ to, name }) {
  const from = process.env.MAILER_FROM;
  if (!from || !resend) throw new Error('Mailer not configured');
  return await resend.emails.send({
    from,
    to,
    reply_to: 'ollie@callguard360.com',
    subject: "Your CallGuard fit check",
    html: `
      <h2>Hey, ${name}</h2>
      <p>Thanks for requesting a 5‑minute fit check. We'll be in touch at the time you gave us.</p>
      <p>If anything changes, just reply to this email.</p>
      <p>— Ollie, from CallGuard</p>
    `,
  });
}

// Create Express app
const app = express();

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['*'];

app.use(cors({
  origin: corsOrigins.includes('*') ? true : corsOrigins,
  credentials: true,
  methods: ['*'],
  allowedHeaders: ['*'],
}));

// Middleware to parse JSON
app.use(express.json());

// API Routes
const apiRouter = express.Router();

// Root endpoint
apiRouter.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// POST /api/status - Create a status check
apiRouter.post('/status', async (req, res) => {
  try {
    const { client_name } = req.body;

    if (!client_name) {
      return res.status(400).json({ error: 'client_name is required' });
    }

    const statusCheck = new StatusCheck({
      id: uuidv4(),
      client_name,
      timestamp: new Date(),
    });

    await statusCheck.save();

    // Return the status check (without _id due to schema transform)
    res.status(201).json({
      id: statusCheck.id,
      client_name: statusCheck.client_name,
      timestamp: statusCheck.timestamp.toISOString(),
    });
  } catch (error) {
    console.error('Error creating status check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/status - Get all status checks
apiRouter.get('/status', async (req, res) => {
  try {
    const statusChecks = await StatusCheck.find({})
      .limit(1000)
      .lean(); // Use lean() to get plain JavaScript objects

    // Transform the results to match the expected format
    const formattedChecks = statusChecks.map(check => ({
      id: check.id,
      client_name: check.client_name,
      timestamp: check.timestamp instanceof Date 
        ? check.timestamp.toISOString() 
        : check.timestamp,
    }));

    res.json(formattedChecks);
  } catch (error) {
    console.error('Error fetching status checks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contact - Submit fit check / callback form; send enquiry to you + confirmation to customer
apiRouter.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, town, bestTime } = req.body;

    if (!name || !email || !phone || !town || !bestTime) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'town', 'bestTime'],
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      town: town.trim(),
      bestTime: bestTime.trim(),
    };

    if (resend && process.env.MAILER_FROM) {
      await sendContactEmail({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        town: payload.town,
        time: payload.bestTime,
      });
      await sendCustomerConfirmationEmail({
        to: payload.email,
        name: payload.name,
      });
    } else if (hasMongo) {
      await ContactRequest.create(payload);
      console.log('Contact form submitted (Resend not configured). Saved to DB:', payload);
    } else {
      console.log('Contact form submitted (no email + no DB). Payload:', payload);
    }

    res.status(201).json({ success: true, message: 'Thank you — we\'ll be in touch.' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to submit. Please try again or call directly.' });
  }
});

// Mount API router
app.use('/api', apiRouter);

// Configure logging
const logger = {
  info: (message) => console.log(`${new Date().toISOString()} - INFO - ${message}`),
  error: (message) => console.error(`${new Date().toISOString()} - ERROR - ${message}`),
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
