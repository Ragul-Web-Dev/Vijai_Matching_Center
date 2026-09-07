import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Eye, Sparkles, Filter, Layers, CheckCircle2, X, ArrowRight } from 'lucide-react';

const catalogCategories = ['All', 'Blouse', 'Bridal', 'Salwar/Chudi', 'Saree Border', 'Logos & Tees', 'Custom Motifs'];

const catalogItems = [
  {
    id: 'CAT-01',
    title: 'Peacock Zari Back Neck Blouse',
    category: 'Blouse',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    alt: 'Designer blouse back neck embroidery with dual peacock motifs, gold zari, and intricate resham threadwork reference',
    stitchCount: '48,500 stitches',
    colors: 'Gold, Emerald, Metallic Ruby',
    tag: 'Bridal Blouse',
    code: 'VE-BL-101',
    description: 'Dual peacock motif with intricate floral creeper along neck & full sleeve length.'
  },
  {
    id: 'CAT-02',
    title: 'Royal Baraat Bridal Lehenga Border',
    category: 'Bridal',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    alt: 'Heavy bridal lehenga border with traditional baraat procession, elephant, and doli motifs in antique gold embroidery reference',
    stitchCount: '124,000 stitches',
    colors: 'Pure Antique Zari, Resham Red',
    tag: 'Heavy Bridal',
    code: 'VE-BR-204',
    description: 'Traditional procession figures with elephant & doli motifs across heavy silk skirts.'
  },
  {
    id: 'CAT-03',
    title: 'Kashmiri Floral Salwar Neckline',
    category: 'Salwar/Chudi',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    alt: 'Kashmiri-style salwar kameez neckline with dense floral and vine embroidery reference on silk fabric',
    stitchCount: '28,000 stitches',
    colors: 'Multi-Resham Silk Threads',
    tag: 'Ethnic Kurti',
    code: 'VE-SL-308',
    description: 'Dense neck yoke pattern with delicate vine extensions for Georgette & Cotton suits.'
  },
  {
    id: 'CAT-04',
    title: 'Scalloped Temple Border Silk Saree',
    category: 'Saree Border',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    alt: 'Silk saree scalloped temple border with gold zari and maroon resham threadwork reference',
    stitchCount: '86,200 stitches',
    colors: 'Rich Gold Zari & Maroon',
    tag: 'Saree Work',
    code: 'VE-SR-412',
    description: 'Continuous 20-inch frame scalloped border with spaced coin buttis on pallu.'
  },
  {
    id: 'CAT-05',
    title: 'Precision Corporate Crest Logo',
    category: 'Logos & Tees',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    alt: 'High-density precision embroidered corporate company crest emblem on polo shirt garment reference',
    stitchCount: '12,400 stitches',
    colors: 'Navy Blue, Gold Thread, White',
    tag: 'Uniform Logo',
    code: 'VE-LG-502',
    description: 'High-density crisp embroidery crest on polo collars and chest pockets.'
  },
  {
    id: 'CAT-06',
    title: 'Sacred Ganesha & Lotus Motif',
    category: 'Custom Motifs',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    alt: 'Detailed sacred Ganesha and lotus embroidery centerpiece motif in gold, coral, and green threads reference',
    stitchCount: '34,000 stitches',
    colors: 'Golden Yellow, Coral, Green',
    tag: 'Bespoke Motif',
    code: 'VE-CM-615',
    description: 'Custom vectorized centerpiece design for blouse backs, kurtas, and silk shawls.'
  }
];

export default function CatalogGallery({ scrollToSection, onSelectDesign }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState(null);

  const filteredItems = activeCategory === 'All'
    ? catalogItems
    : catalogItems.filter(item => item.category === activeCategory);

  const handleRequestDesign = (item) => {
    if (onSelectDesign) {
      onSelectDesign(item);
    }
    if (scrollToSection) {
      scrollToSection('whatsapp');
    }
  };

  return (
    <section id="catalog" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase mb-3">
            <Grid className="w-3.5 h-3.5 text-emerald-600" />
            <span>Studio Showcase & Pattern Gallery</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Design Catalog & <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 bg-clip-text text-transparent italic">Work Gallery</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-light">
            Click any pattern card to view full specifications or request custom computerized embroidery.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {catalogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white font-bold shadow-md shadow-emerald-200'
                  : 'glass-card text-slate-600 hover:text-emerald-700 border border-emerald-100 bg-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDesign(item)}
              className="glass-card rounded-3xl p-6 border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer bg-white/90 hover:shadow-xl"
            >
              <div>
                {/* Header info bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {item.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.tag}</span>
                </div>

                {/* Real Embroidery Photography Card with Badge */}
                <div className="h-48 rounded-2xl border border-emerald-100 relative overflow-hidden flex flex-col justify-between mb-5 bg-slate-900 group-hover:border-emerald-300 transition-colors shadow-inner">
                  <img
                    src={item.image}
                    alt={item.alt || item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

                  <div className="relative z-10 p-3 flex justify-between items-start">
                    <span className="text-[10px] text-slate-900 font-mono font-bold bg-white/90 px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur">
                      {item.stitchCount}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  
                  <div className="relative z-10 p-3">
                    <p className="text-[11px] text-amber-300 font-mono font-medium truncate">Palette: {item.colors}</p>
                    <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-widest mt-0.5">12-Needle Production Ready</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif-heading mb-2 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light mb-6">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-emerald-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDesign(item);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center border border-emerald-200 transition-all"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-emerald-700" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestDesign(item);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Enquire on WhatsApp</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Modal Popup */}
        <AnimatePresence>
          {selectedDesign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedDesign(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-emerald-200 bg-white relative shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-emerald-800 font-bold px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                    {selectedDesign.code}
                  </span>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Work Image */}
                {selectedDesign.image && (
                  <div className="h-52 rounded-2xl overflow-hidden mb-4 border border-emerald-100 relative shadow-sm">
                    <img
                      src={selectedDesign.image}
                      alt={selectedDesign.alt || selectedDesign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className="text-2xl font-bold font-serif-heading text-slate-900 mb-2">
                  {selectedDesign.title}
                </h3>
                <p className="text-xs text-slate-600 mb-6 font-light">{selectedDesign.description}</p>

                <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 mb-6 text-xs text-slate-700 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-emerald-900">{selectedDesign.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stitch Density:</span>
                    <span className="font-bold text-emerald-900">{selectedDesign.stitchCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thread Palette:</span>
                    <span className="font-bold text-emerald-900">{selectedDesign.colors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recommended Machine:</span>
                    <span className="font-bold text-emerald-700">C Body 6G Pro (12 Needles)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const item = selectedDesign;
                    setSelectedDesign(null);
                    handleRequestDesign(item);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>Enquire on WhatsApp / Request This Design</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
