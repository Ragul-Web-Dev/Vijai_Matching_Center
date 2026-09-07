import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, ExternalLink, MapPin, Truck, ShieldCheck, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import { realTNDistrictPaths } from './tnDistrictPaths';

// Main Studio location
const salemHQ = { name: 'Salem', x: 195, y: 160, role: 'Central 12-Needle Master Studio' };

export default function WhatsAppWidget({ initialService, selectedDesign }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: initialService || 'Custom Blouse Embroidery',
    message: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [enquiryRefId, setEnquiryRefId] = useState('');
  const [base64Image, setBase64Image] = useState(null);

  // Update service if selectedDesign prop changes
  React.useEffect(() => {
    if (selectedDesign) {
      setFormData(prev => ({
        ...prev,
        service: `${selectedDesign.tag || selectedDesign.category || 'Custom'} - ${selectedDesign.title} (${selectedDesign.code})`,
        message: prev.message || `Interested in ${selectedDesign.title} (${selectedDesign.code}). Please confirm pricing & delivery.`
      }));
    }
  }, [selectedDesign]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        alert('Please select a JPG, JPEG, PNG, or WEBP image.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setBase64Image(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your name.');
      return;
    }

    setUploading(true);
    const refId = 'VE-' + Math.floor(100000 + Math.random() * 900000);
    setEnquiryRefId(refId);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim() || 'Not provided',
      service: formData.service,
      message: formData.message.trim(),
      image: base64Image || previewUrl || null
    };

    let generatedWhatsappUrl = '';

    try {
      // Try backend endpoint
      const res = await axios.post('/api/enquiries', payload, { timeout: 4000 });
      if (res.data && res.data.whatsappUrl) {
        generatedWhatsappUrl = res.data.whatsappUrl;
      }
    } catch (err) {
      console.warn('Backend API connection notice, generating direct WhatsApp URL:', err.message);
    }

    // Fallback WhatsApp URL formatting
    if (!generatedWhatsappUrl) {
      const businessPhone = '919790449627';
      let messageText = `🧵 *Vijay Embroidery - Custom Order Enquiry*\n\n`;
      messageText += `📌 *Enquiry ID:* #${refId}\n`;
      messageText += `👤 *Customer Name:* ${formData.name || 'Valued Customer'}\n`;
      messageText += `📞 *Phone:* ${formData.phone || 'Not provided'}\n`;
      messageText += `🧵 *Service / Garment:* ${formData.service}\n`;
      if (formData.message) {
        messageText += `📝 *Requirements / Location:* ${formData.message}\n`;
      }
      if (base64Image || selectedFile) {
        messageText += `🖼️ *Reference Image:* Attached in Vijay Studio System (Ref #${refId}). Customer can also attach photo directly in this chat.\n`;
      }
      messageText += `\n_Sent via Vijay Embroidery Studio Official Web App_`;
      generatedWhatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(messageText)}`;
    }

    // Backup to localStorage
    const newEnquiryObj = {
      id: refId,
      refId: refId,
      name: formData.name || 'Valued Customer',
      service: formData.service || 'Custom Embroidery',
      phone: formData.phone || '+91 97904 49627',
      message: formData.message,
      image: base64Image || (previewUrl ? 'Reference image attached' : null),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    const existingEnqs = JSON.parse(localStorage.getItem('vijay_enquiries_log') || '[]');
    localStorage.setItem('vijay_enquiries_log', JSON.stringify([newEnquiryObj, ...existingEnqs]));

    setWhatsappUrl(generatedWhatsappUrl);
    setUploading(false);
    setSubmitted(true);
  };

  return (
    <section id="whatsapp" className="py-20 relative bg-[#fcfbf7] overflow-hidden">
      {/* Subtle Background Emerald & Gold Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Statewide Service & Delivery Coverage</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900">
            From Salem to <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 bg-clip-text text-transparent italic">Every Corner of Tamil Nadu</span>
          </h2>
          
          <p className="text-slate-600 text-sm md:text-base mt-2.5 font-light max-w-2xl mx-auto">
            Order custom embroidery online. We fulfill doorstep delivery orders across Tamil Nadu directly from our main studio in Salem.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Doorstep Parcel Service & Delivery Coverage (Main Studio located in Salem)</span>
          </div>
        </div>

        {/* 2-Column Grid: Real GIS Tamil Nadu Map on Left, WhatsApp Inquiry Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: REAL GIS BOUNDARY TAMIL NADU MAP */}
          <div className="lg:col-span-6 glass-card p-6 md:p-8 rounded-3xl border border-emerald-200/80 bg-emerald-950 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
            
            {/* Header Badge */}
            <div className="relative z-10 flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Main Studio: Salem
                </span>
                <h3 className="text-xl font-bold font-serif-heading text-white mt-1.5">
                  Official Tamil Nadu District Boundary Map
                </h3>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-300 font-mono bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Doorstep Parcel Service</span>
              </div>
            </div>

            {/* REAL GIS TAMIL NADU DISTRICT BOUNDARY MAP SVG */}
            <div className="relative z-10 w-full h-[360px] md:h-[420px] bg-emerald-900/30 rounded-2xl border border-emerald-700/50 flex items-center justify-center p-2 overflow-hidden shadow-inner">
              
              <svg viewBox="0 0 450 480" className="w-full h-full max-w-[420px] max-h-[460px]">
                <defs>
                  {/* Subtle Spreading Glow */}
                  <radialGradient id="salemPulseSpread">
                    <stop offset="0%" stopColor="#ffffffff" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="emeraldSpreadArc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* REAL GIS TAMIL NADU DISTRICT BOUNDARY PATHS & ALL DISTRICT NAMES */}
                <g>
                  {realTNDistrictPaths.map((dist, idx) => {
                    const isSalem = dist.name.toLowerCase() === 'salem';
                    return (
                      <g key={idx}>
                        <path
                          d={dist.path}
                          fill={isSalem ? "rgba(245, 158, 11, 0.3)" : "rgba(6, 78, 59, 0.55)"}
                          stroke={isSalem ? "#dcdcdcff" : "#34d399"}
                          strokeWidth={isSalem ? "1.5" : "0.8"}
                          strokeLinejoin="round"
                          className="hover:fill-emerald-800/80 transition-colors cursor-pointer"
                        />
                        {/* District Name Label */}
                        <text
                          x={dist.cx}
                          y={dist.cy}
                          fill={isSalem ? "#ffffffff" : "#f8fafc"}
                          fontSize={isSalem ? "11" : "8"}
                          fontWeight={isSalem ? "bold" : "500"}
                          textAnchor="middle"
                          className="font-sans select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                        >
                          {dist.name}{isSalem ? ' ⭐' : ''}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* STATIC SALEM HIGHLIGHT GLOW & MAIN STUDIO PIN */}
                
                
              </svg>
            </div>

            {/* Main Studio Info Card */}
            <div className="relative z-10 mt-3 p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-9.5" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                    Salem ⭐ Main Studio
                  </h4>
                  <p className="text-[11px] text-emerald-500/90 mt-0.5">{salemHQ.role}</p>
                </div>
              </div>

              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40 shrink-0">
                Doorstep Delivery Across TN
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: WHATSAPP ENQUIRY FORM */}
          <div className="lg:col-span-6 glass-card p-8 md:p-10 rounded-3xl border border-emerald-200/80 relative overflow-hidden bg-white shadow-xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase mb-3">
                <MessageSquare className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>Direct Studio Order Form</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold font-serif-heading text-slate-900">
                Custom Order & <span className="text-emerald-700 italic">WhatsApp Inquiry</span>
              </h3>
              <p className="text-slate-600 text-xs md:text-sm mt-1.5 font-light mb-6">
                Submit your garment details below. We dispatch orders straight from Salem to your location anywhere in Tamil Nadu!
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyadarshini"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 97904 49627"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Embroidery Service / Garment</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / District in Tamil Nadu & Order Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Mention your delivery location in TN (e.g. Salem, Chennai, Coimbatore, Madurai, Trichy), fabric color, or design code..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                  />
                </div>

                {/* Optional Design / Reference Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Embroidery Design / Reference Photo (Optional)</span>
                    <span className="text-[10px] text-slate-400 font-normal">JPG, JPEG, PNG, WEBP</span>
                  </label>
                  
                  {previewUrl ? (
                    <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/30 p-2 flex items-center gap-3">
                      <img
                        src={previewUrl}
                        alt="Reference Design Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-emerald-200 shadow-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{selectedFile?.name || 'Reference Image'}</p>
                        <p className="text-[10px] text-emerald-700 font-mono mt-0.5">Image attached for enquiry</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-600 transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/30 rounded-xl p-3 text-center cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="flex items-center justify-center gap-2 text-emerald-800">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium">Click or drag reference design photo</span>
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all border border-emerald-400/30 disabled:opacity-75"
                >
                  {uploading ? (
                    <span className="animate-pulse">Processing Order...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-white" />
                      <span>Generate WhatsApp Embroidery Order</span>
                    </>
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="inline-block text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 mb-2">
                  Enquiry ID: #{enquiryRefId}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mb-1 font-serif-heading">Order Prepared & Recorded!</h4>
                <p className="text-xs text-slate-600 mb-4 font-light max-w-sm mx-auto">
                  Your enquiry has been saved to the studio system. Click below to open WhatsApp with your order details pre-filled.
                </p>

                {previewUrl && (
                  <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left flex items-start gap-2.5 text-[11px] text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Reference Photo Note:</strong> Your uploaded photo is safely registered with Ref ID <strong>#{enquiryRefId}</strong> in our studio. You can also attach it directly in your WhatsApp conversation.
                    </span>
                  </div>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Open WhatsApp Chat Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    removeFile();
                  }}
                  className="block mx-auto mt-4 text-xs text-emerald-700 hover:text-emerald-900 underline font-mono"
                >
                  Submit another inquiry
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
