import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Sparkles, CheckCircle2, Crown, Gem, Scissors, BadgePercent, Palette, FileText, ArrowRight, X } from 'lucide-react';

const embroideryServices = [
  {
    id: 1,
    icon: Gem,
    title: 'Custom Blouse Embroidery',
    description: 'Exquisite necklines, deep back patterns, sleeve motifs, and zardozi-style thread work tailored to your exact measurements.',
    details: 'Our specialized 12-needle C Body 6G Pro machine delivers seamless Maggam-style neck borders, ornate back peacocks, and coin buttis with 0.1mm stitch precision.',
    tags: ['Maggam Work', 'Zari Threads', 'Back & Sleeve'],
    badge: 'Popular',
    estimatedTime: '2-4 Days',
    needleSetup: '12-Color Setup'
  },
  {
    id: 2,
    icon: Crown,
    title: 'Bridal Embroidery',
    description: 'Heavy ornate bridal lehenga motifs, peacock back-necks, royal palanquin themes, and custom wedding couple initials.',
    details: 'Grand bridal embroidery crafted with ultra-dense antique gold zari, metallic ruby resham, and customized couple initials incorporated directly into the pattern.',
    tags: ['Royal Bridal', 'Heavy Density', 'Custom Motifs'],
    badge: 'Signature',
    estimatedTime: '3-5 Days',
    needleSetup: 'Multi-Resham Zari'
  },
  {
    id: 3,
    icon: Shirt,
    title: 'Chudi & Salwar Embroidery',
    description: 'Intricate neck panels, side slit borders, and dupatta corner embroidery for daily, party, and festive salwar suits.',
    details: 'Pre-stitched and unstitched salwar kameez neck panels with rich floral scrollwork, geometrical thread accents, and soft skin-friendly underlay backing.',
    tags: ['Salwar Neckline', 'Dupatta Motif', 'Casual & Party'],
    badge: 'Daily & Party',
    estimatedTime: '1-2 Days',
    needleSetup: 'Color-Fast Cotton Thread'
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'Saree & Border Embroidery',
    description: 'Continuous rich scalloped borders, pallu highlight embroidery, and buttis across entire silk and designer sarees.',
    details: 'Accommodated in our massive 20 × 32 inch heavy embroidery frame. Allows seamless continuous scalloped borders without fabric repositioning line shifts.',
    tags: ['20x32" Border Frame', 'Pallu Motif', 'Silk & Net'],
    badge: 'Classic',
    estimatedTime: '3-6 Days',
    needleSetup: 'Continuous Frame'
  },
  {
    id: 5,
    icon: Scissors,
    title: 'T-Shirt Embroidery',
    description: 'High-density chest branding, pocket logo stitching, and sleeve crests on cotton, polo, and activewear t-shirts.',
    details: 'Durable corporate branding for polos, cotton t-shirts, and sports activewear using color-fast machine embroidery threads that survive hundreds of washes.',
    tags: ['Polo & Tees', 'Chest Crest', 'Color-Fast Thread'],
    badge: 'Apparel',
    estimatedTime: '1-3 Days',
    needleSetup: 'High-Density Crest'
  },
  {
    id: 6,
    icon: Palette,
    title: 'Logo Embroidery',
    description: 'Precision corporate logos, school crests, organization emblems, and uniform branding with high stitch resolution.',
    details: 'Convert vector logos, corporate fonts, and emblems into digitized stitch density maps optimized for uniforms, aprons, caps, and workwear.',
    tags: ['Corporate Branding', 'High Stitch Count', 'Bulk Orders'],
    badge: 'Corporate',
    estimatedTime: '1-3 Days',
    needleSetup: 'Vector Digitized'
  },
  {
    id: 7,
    icon: FileText,
    title: 'Custom Design Embroidery',
    description: 'Bring any drawing, photo reference, or vector graphics; our digital punchers convert them into exact machine stitch files.',
    details: 'Have a custom drawing or Pinterest image reference? Upload or send it to us on WhatsApp. Our in-house digitizers generate customized computerized embroidery stitch profiles for your garment.',
    tags: ['Vector-to-Stitch', 'Photo Reference', 'Unique Motifs'],
    badge: 'Custom Order',
    estimatedTime: '2-4 Days',
    needleSetup: 'Custom Punching'
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  const scrollToWhatsApp = () => {
    const el = document.getElementById('whatsapp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Craftsmanship</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Computerized <span className="text-purple-600 italic">Embroidery Services</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base font-light">
            Click on any service card to view complete specifications, stitching details, and request custom quotes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {embroideryServices.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedService(service)}
                className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-purple-100 hover:border-purple-400 transition-all flex flex-col justify-between cursor-pointer bg-white/80 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif-heading group-hover:text-purple-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-purple-100 mb-4">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-purple-600" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-purple-700 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Click to view details & pop-up modal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Popup Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-purple-200 bg-white relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    {React.createElement(selectedService.icon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      {selectedService.badge}
                    </span>
                    <h3 className="text-2xl font-bold font-serif-heading text-slate-900 mt-0.5">
                      {selectedService.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-slate-700 font-light leading-relaxed">
                  {selectedService.description}
                </p>
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 text-xs text-purple-950 font-light leading-relaxed">
                  <strong className="font-semibold text-purple-900 block mb-1">Craftsmanship Details:</strong>
                  {selectedService.details}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 font-mono">
                    <span className="text-slate-500 block text-[10px]">ESTIMATED DELIVERY</span>
                    <span className="font-bold text-purple-900">{selectedService.estimatedTime}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 font-mono">
                    <span className="text-slate-500 block text-[10px]">THREAD CAPACITY</span>
                    <span className="font-bold text-purple-900">{selectedService.needleSetup}</span>
                  </div>
                </div>

                <div className="pt-3">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Key Service Highlights:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-purple-100">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    scrollToWhatsApp();
                  }}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2"
                >
                  <span>Inquire This Service on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
