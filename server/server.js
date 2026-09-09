import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import whatsappRoutes from './routes/whatsappRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Static uploads directory for customer design photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vijay Embroidery Express Backend API is active',
    timestamp: new Date().toISOString(),
    features: [
      'Customer WhatsApp Enquiries',
      'Secure Admin Dashboard API',
      'Enquiry Status Workflow',
      'Verified Customer Media Feedbacks'
    ]
  });
});

import quotationRoutes from './routes/quotationRoutes.js';

// API Routes
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotations', quotationRoutes);

app.listen(PORT, () => {
  console.log(`[Express Server Running]: http://localhost:${PORT}`);
});
