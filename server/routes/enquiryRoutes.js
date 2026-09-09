import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleSendWhatsApp } from '../controllers/whatsappController.js';
import { loadData } from '../store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'enquiries');

const router = express.Router();

// Public endpoint for submitting customer design/WhatsApp enquiries
router.post('/', handleSendWhatsApp);

// Direct image retrieval endpoint for WhatsApp shared links
router.get('/image/:refId', (req, res) => {
  const { refId } = req.params;
  const store = loadData();
  const enquiry = (store.enquiries || []).find(e => e.id === refId || e.refId === refId);

  // Check on disk first
  const exts = ['.png', '.jpg', '.jpeg', '.webp'];
  for (const ext of exts) {
    const filePath = path.join(UPLOADS_DIR, `${refId}${ext}`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  // Check if store holds URL or base64
  if (enquiry && enquiry.image) {
    if (enquiry.image.startsWith('http')) {
      return res.redirect(enquiry.image);
    }
    if (enquiry.image.startsWith('data:image/')) {
      const parts = enquiry.image.split(',');
      const imgBuffer = Buffer.from(parts[1], 'base64');
      const mime = parts[0].match(/:(.*?);/)[1];
      res.setHeader('Content-Type', mime);
      return res.send(imgBuffer);
    }
  }

  return res.status(404).json({ success: false, message: 'Design photo not found' });
});

export default router;

