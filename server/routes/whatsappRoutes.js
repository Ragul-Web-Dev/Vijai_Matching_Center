import express from 'express';
import { handleSendWhatsApp } from '../controllers/whatsappController.js';

const router = express.Router();

router.post('/send', handleSendWhatsApp);

export default router;
