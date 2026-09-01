import { sendWhatsAppNotification, generateWhatsAppLink } from '../services/whatsappService.js';

export const handleSendWhatsApp = async (req, res) => {
  try {
    const { name, service, message, phone } = req.body;

    const formattedMessage = `🧵 *Vijai Tailoring Inquiry*\n\n` +
      `*Name:* ${name || 'Valued Customer'}\n` +
      `*Service Required:* ${service || 'Custom Stitching'}\n` +
      `*Details:* ${message || 'No additional details'}\n\n` +
      `Sent via Vijai Tailoring Web App`;

    const recipientPhone = phone || process.env.WHATSAPP_PHONE_NUMBER || '919876543210';
    const result = await sendWhatsAppNotification({ recipient: recipientPhone, message: formattedMessage });

    return res.status(200).json({
      success: true,
      data: result,
      whatsappUrl: generateWhatsAppLink(recipientPhone, formattedMessage),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
