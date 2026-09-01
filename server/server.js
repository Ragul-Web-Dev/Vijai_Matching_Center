import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import uploadRoutes from './routes/uploadRoutes.js';
// import whatsappRoutes from './routes/whatsappRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
// connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vijai Tailoring Express Backend API is active',
    timestamp: new Date().toISOString(),
    stack: {
      framework: 'Express',
      database: 'MongoDB (Mongoose)',
      cloudStorage: 'Cloudinary',
      messaging: 'WhatsApp API Integration',
    },
  });
});

// app.use('/api/upload', uploadRoutes);
// app.use('/api/whatsapp', whatsappRoutes);

app.listen(PORT, () => {
  console.log(`[Express Server Running]: http://localhost:${PORT}`);
});
