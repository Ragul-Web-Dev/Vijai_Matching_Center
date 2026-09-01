import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Eye, Sparkles, Filter, Layers, CheckCircle2, X, ArrowRight } from 'lucide-react';

const catalogCategories = ['All', 'Blouse', 'Bridal', 'Salwar/Chudi', 'Saree Border', 'Logos & Tees', 'Custom Motifs'];

const catalogItems = [
  {
    id: 'CAT-01',
    title: 'Peacock Zari Back Neck Blouse',
    category: 'Blouse',
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
    stitchCount: '34,000 stitches',
    colors: 'Golden Yellow, Coral, Green',
    tag: 'Bespoke Motif',
    code: 'VE-CM-615',
    description: 'Custom vectorized centerpiece design for blouse backs, kurtas, and silk shawls.'
  }
];

export default function CatalogGallery({ scrollToSection }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState(null);

  const filteredItems = activeCategory === 'All'
    ? catalogItems
    : catalogItems.filter(item => item.category === activeCategory);

  return (
    <section id="catalog" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Grid className="w-3.5 h-3.5" />
            <span>Studio Showcase</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Design Catalog & <span className="text-purple-600 italic">Work Gallery</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-light">
            Click any pattern card to open full design specifications and WhatsApp order popup.
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
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-200'
                  : 'glass-card text-slate-600 hover:text-purple-700 border border-purple-100'
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
              className="glass-card rounded-3xl p-6 border border-purple-100 hover:border-purple-400 transition-all flex flex-col justify-between group cursor-pointer bg-white/80 hover:shadow-xl"
            >
              <div>
                {/* Header info bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {item.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.tag}</span>
                </div>

                {/* Decorative Visual Embroidery Pattern Placeholder */}
                <div className="h-40 rounded-2xl bg-gradient-to-tr from-purple-100 via-purple-50 to-indigo-100 border border-purple-200 p-4 relative overflow-hidden flex flex-col justify-between mb-5 group-hover:border-purple-300 transition-colors">
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-purple-300/20 rounded-full blur-xl" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-purple-900 font-mono tracking-wider bg-white/80 px-2 py-0.5 rounded backdrop-blur shadow-sm">
                      {item.stitchCount}
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-xs text-purple-950 font-mono">Palette: {item.colors}</p>
                    <p className="text-[10px] text-purple-700 font-bold uppercase tracking-widest mt-0.5">Machine-Ready Pattern</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif-heading mb-2 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light mb-6">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-purple-100">
                <button
                  className="flex-1 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-purple-200 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>View Details Popup</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToSection('whatsapp');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-200"
                >
                  Order
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
                className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-purple-200 bg-white relative shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-purple-700 font-bold px-3 py-1 rounded-full bg-purple-100 border border-purple-200">
                    {selectedDesign.code}
                  </span>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl font-bold font-serif-heading text-slate-900 mb-2">
                  {selectedDesign.title}
                </h3>
                <p className="text-xs text-slate-600 mb-6 font-light">{selectedDesign.description}</p>

                <div className="space-y-3 bg-purple-50/70 p-4 rounded-2xl border border-purple-100 mb-6 text-xs text-slate-700 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-purple-900">{selectedDesign.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stitch Density:</span>
                    <span className="font-bold text-purple-900">{selectedDesign.stitchCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thread Palette:</span>
                    <span className="font-bold text-purple-900">{selectedDesign.colors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recommended Machine:</span>
                    <span className="font-bold text-purple-700">C Body 6G Pro (12 Needles)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDesign(null);
                    scrollToSection('whatsapp');
                  }}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2"
                >
                  <span>Order This Design via WhatsApp</span>
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
