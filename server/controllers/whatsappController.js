import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadData, saveData } from '../store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'enquiries');

// Ensure uploads/enquiries directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const handleSendWhatsApp = async (req, res) => {
  try {
    const { name, phone, service, message, image } = req.body;

    // Validate inputs
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    const businessPhone = process.env.WHATSAPP_PHONE_NUMBER || '919944571226';
    const refId = 'VE-' + Math.floor(100000 + Math.random() * 900000);

    let savedPhotoUrl = null;

    // If an image (base64 data URL) is provided, save it to disk
    if (image && typeof image === 'string') {
      if (image.startsWith('data:image/')) {
        try {
          const matches = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            let extension = matches[1].toLowerCase();
            if (extension === 'jpeg') extension = 'jpg';
            const base64Data = matches[2];
            const fileName = `${refId}.${extension}`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

            // Build accessible public URL
            const protocol = req.protocol || 'http';
            const host = req.get('host') || 'localhost:5000';
            savedPhotoUrl = `${protocol}://${host}/uploads/enquiries/${fileName}`;
          }
        } catch (imgErr) {
          console.error('[Error saving uploaded image]:', imgErr.message);
        }
      } else if (image.startsWith('http://') || image.startsWith('https://')) {
        savedPhotoUrl = image;
      }
    }

    // Save enquiry to store
    const store = loadData();
    const newEnquiry = {
      id: refId,
      refId: refId,
      name: name.trim(),
      phone: phone ? phone.trim() : 'Not provided',
      service: service || 'Custom Blouse Embroidery',
      message: message ? message.trim() : '',
      image: savedPhotoUrl || image || null,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    store.enquiries = [newEnquiry, ...(store.enquiries || [])];
    saveData(store);

    // Pre-filled WhatsApp message format with direct photo attachment link
    let formattedMessage = `🧵 *VIJAI EMBROIDERY GROUPS - CUSTOM ORDER ENQUIRY*\n\n`;
    formattedMessage += `📌 *Enquiry ID:* #${refId}\n`;
    formattedMessage += `👤 *Customer Name:* ${newEnquiry.name}\n`;
    formattedMessage += `📞 *Phone:* ${newEnquiry.phone}\n`;
    formattedMessage += `🧵 *Service / Garment:* ${newEnquiry.service}\n`;
    
    if (newEnquiry.message) {
      formattedMessage += `📝 *Requirements / Location:* ${newEnquiry.message}\n`;
    }

    if (savedPhotoUrl) {
      formattedMessage += `\n📸 *CUSTOMER ATTACHED DESIGN PHOTO:*\n${savedPhotoUrl}\n_(Tap the link above to view uploaded design photo)_\n`;
    } else if (newEnquiry.image) {
      formattedMessage += `\n📸 *Design Reference:* Photo recorded with Ref #${refId}.\n`;
    }

    formattedMessage += `\n_Sent via Vijai Embroidery Groups Official Web App_`;

    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;

    return res.status(201).json({
      success: true,
      message: 'Enquiry recorded successfully',
      enquiry: newEnquiry,
      refId: refId,
      photoUrl: savedPhotoUrl,
      whatsappUrl: whatsappUrl
    });
  } catch (error) {
    console.error('[WhatsApp Enquiry Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

