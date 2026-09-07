import express from 'express';
import { handleSendWhatsApp } from '../controllers/whatsappController.js';

const router = express.Router();

// Public endpoint for submitting customer design/WhatsApp enquiries
router.post('/', handleSendWhatsApp);

export default router;
