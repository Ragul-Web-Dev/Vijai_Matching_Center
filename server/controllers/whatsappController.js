import { loadData, saveData } from '../store.js';

export const handleSendWhatsApp = async (req, res) => {
  try {
    const { name, phone, service, message, image } = req.body;

    // Validate inputs
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    const businessPhone = process.env.WHATSAPP_PHONE_NUMBER || '919790449627';
    const refId = 'VE-' + Math.floor(100000 + Math.random() * 900000);

    // Save enquiry to store
    const store = loadData();
    const newEnquiry = {
      id: refId,
      refId: refId,
      name: name.trim(),
      phone: phone ? phone.trim() : 'Not provided',
      service: service || 'Custom Blouse Embroidery',
      message: message ? message.trim() : '',
      image: image || null,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    store.enquiries = [newEnquiry, ...(store.enquiries || [])];
    saveData(store);

    // Pre-filled WhatsApp message format
    let formattedMessage = `🧵 *Vijay Embroidery - Custom Order Enquiry*\n\n`;
    formattedMessage += `📌 *Enquiry ID:* #${refId}\n`;
    formattedMessage += `👤 *Customer Name:* ${newEnquiry.name}\n`;
    formattedMessage += `📞 *Phone:* ${newEnquiry.phone}\n`;
    formattedMessage += `🧵 *Service / Garment:* ${newEnquiry.service}\n`;
    
    if (newEnquiry.message) {
      formattedMessage += `📝 *Requirements / Location:* ${newEnquiry.message}\n`;
    }

    if (newEnquiry.image) {
      formattedMessage += `🖼️ *Reference Image:* Attached in Vijay Studio System (Ref #${refId}). Customer can also share the photo here in this chat.\n`;
    }

    formattedMessage += `\n_Sent via Vijay Embroidery Studio Official Web App_`;

    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;

    return res.status(201).json({
      success: true,
      message: 'Enquiry recorded successfully',
      enquiry: newEnquiry,
      refId: refId,
      whatsappUrl: whatsappUrl
    });
  } catch (error) {
    console.error('[WhatsApp Enquiry Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
