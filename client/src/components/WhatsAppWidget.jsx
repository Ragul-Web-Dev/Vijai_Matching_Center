import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function WhatsAppWidget() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Custom Blouse Embroidery',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/whatsapp/send', formData);
      if (res.data && res.data.whatsappUrl) {
        setWhatsappUrl(res.data.whatsappUrl);
      } else {
        const text = encodeURIComponent(`Hi Vijay Embroidery, I am ${formData.name}. Service required: ${formData.service}. Note: ${formData.message}`);
        setWhatsappUrl(`https://wa.me/919876543210?text=${text}`);
      }
      setSubmitted(true);
    } catch (err) {
      const text = encodeURIComponent(`Hi Vijay Embroidery, I am ${formData.name}. Service required: ${formData.service}. Note: ${formData.message}`);
      setWhatsappUrl(`https://wa.me/919876543210?text=${text}`);
      setSubmitted(true);
    }
  };

  return (
    <section id="whatsapp" className="py-20 relative bg-[#f8f6fc]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-purple-200 relative overflow-hidden bg-white shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold uppercase mb-3">
              <MessageSquare className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
              <span>Direct Studio Inquiry Engine</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif-heading text-slate-900">
              Custom Enquiry & Order via <span className="text-purple-600 italic">WhatsApp</span>
            </h2>
            <p className="text-slate-600 text-sm mt-2 font-light">
              Send your embroidery requirements, fabric details, and design code directly to master digitizers.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyadarshini"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Embroidery Service / Garment</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Custom Blouse Embroidery">Custom Blouse Embroidery (Neck & Sleeves)</option>
                  <option value="Bridal Embroidery">Bridal Embroidery (Heavy Zari & Motifs)</option>
                  <option value="Chudi & Salwar Embroidery">Chudi & Salwar Embroidery</option>
                  <option value="Saree & Border Embroidery">Saree & Border Embroidery (20x32 Frame)</option>
                  <option value="T-Shirt Embroidery">T-Shirt & Apparel Embroidery</option>
                  <option value="Logo Embroidery">Corporate / School Logo Embroidery</option>
                  <option value="Custom Design Embroidery">Custom Design Vector Digitizing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Instructions / Design Code / Quantity</label>
                <textarea
                  rows={3}
                  placeholder="Mention fabric color, design code (e.g. VE-BL-101), thread preference, or delivery timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-200 transition-all border border-purple-400/30"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Generate WhatsApp Embroidery Order</span>
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif-heading">Enquiry Ready to Send!</h3>
              <p className="text-xs text-slate-600 mb-6 font-light">
                Click below to open WhatsApp and send your order details directly to Vijay Embroidery master studio.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Open WhatsApp Chat</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setSubmitted(false)}
                className="block mx-auto mt-4 text-xs text-purple-700 hover:text-purple-900 underline font-mono"
              >
                Submit another embroidery inquiry
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

