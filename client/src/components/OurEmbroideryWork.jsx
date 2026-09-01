import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, UploadCloud, X, Eye, CheckCircle2 } from 'lucide-react';

const categories = ['All', 'Blouse', 'Bridal', 'Traditional', 'Custom', 'Logo'];

const workItems = [
  {
    id: 1,
    title: 'Peacock Zari Back Neck Blouse',
    category: 'Blouse',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Dense golden zari stitching with emerald resham highlights.',
    details: 'Crafted for raw silk bridal blouse fabric. Features double peacock symmetry back neck with dense floral vine sleeve extensions.',
    stitches: '54,200 stitches',
    colors: 'Pure Gold Zari, Metallic Emerald, Ruby Resham'
  },
  {
    id: 2,
    title: 'Royal Baraat Bridal Lehenga Motif',
    category: 'Bridal',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy ornate wedding couple and floral palanquin borders.',
    details: 'Custom bridal lehenga border motif depicting traditional wedding procession, palanquin (doli), and royal elephant figures.',
    stitches: '142,000 stitches',
    colors: 'Antique Gold Thread, Crimson Resham, Silver Accents'
  },
  {
    id: 3,
    title: 'Kashmiri Silk Kurti Neckline',
    category: 'Traditional',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    description: 'Intricate traditional threadwork on raw silk fabric.',
    details: 'Intricate Kashmiri floral neck yoke design suited for silk, cotton, and georgette kurti panels.',
    stitches: '32,500 stitches',
    colors: 'Multi-Resham Silk Threads'
  },
  {
    id: 4,
    title: 'Bespoke Floral Motif Pattern',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    description: 'Vectorized custom floral embroidery digitized for 12 needles.',
    details: 'Custom photo-reference floral motif converted into digital embroidery punching files with gradient thread shading.',
    stitches: '38,900 stitches',
    colors: 'Pastel Rose, Coral, Sage Green'
  },
  {
    id: 5,
    title: 'Precision Corporate Crest Logo',
    category: 'Logo',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'High-density crisp embroidery logo on polo activewear.',
    details: 'High-stitch-density corporate logo emblem stitched on polo shirts, aprons, and uniform pockets.',
    stitches: '14,800 stitches',
    colors: 'Navy Blue, Gold Thread, Pure White'
  },
  {
    id: 6,
    title: 'Sleeve Border & Scallop Work',
    category: 'Blouse',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy scalloped elbow sleeve embroidery with coin buttis.',
    details: 'Elbow-length blouse sleeve pattern featuring dense scalloped border trim and spaced coin buttis.',
    stitches: '41,000 stitches',
    colors: 'Antique Gold Zari & Deep Maroon'
  }
];

export default function OurEmbroideryWork({ scrollToSection }) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedWork, setSelectedWork] = useState(null);

  const filteredWork = activeTab === 'All'
    ? workItems
    : workItems.filter(item => item.category === activeTab);

  return (
    <section id="our-work" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Showcase</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Our <span className="text-purple-600 italic">Embroidery Work</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-light">
            Explore our showcase. Click on any work item to open a full details popup modal.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                activeTab === cat
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-200'
                  : 'glass-card text-slate-600 hover:text-purple-700 border border-purple-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredWork.map((item) => (
              <motion.div
                key={item.id}
                layout
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedWork(item)}
                className="glass-card rounded-3xl overflow-hidden border border-purple-100 hover:border-purple-400 transition-all group flex flex-col justify-between cursor-pointer bg-white/80 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden bg-purple-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/90 text-purple-700 border border-purple-200 backdrop-blur shadow-sm">
                    {item.category}
                  </span>

                  <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-purple-900 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur">
                      <Eye className="w-4 h-4 text-purple-600" /> Click to Zoom & View Popup
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 font-serif-heading mb-2 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="text-xs text-purple-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2 border-t border-purple-100">
                    <span>View Work Details Modal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 glass-card p-8 md:p-10 rounded-3xl border border-purple-200 text-center relative overflow-hidden bg-white shadow-md">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-100 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-2xl md:text-3xl font-bold font-serif-heading text-slate-900 mb-2">
            Have Your Own Design?
          </h3>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-6 font-light">
            Send us your design and we'll turn your idea into embroidery.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('upload')}
            className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm inline-flex items-center gap-2 shadow-md shadow-purple-200 border border-purple-400/30"
          >
            <UploadCloud className="w-4 h-4 text-white" />
            <span>Request Custom Design</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Work Item Detailed Popup Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-purple-200 bg-white relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  {selectedWork.category} Studio Work
                </span>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-purple-200 mb-5 bg-purple-50 shadow-md">
                <img
                  src={selectedWork.image}
                  alt={selectedWork.title}
                  className="w-full max-h-72 object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold font-serif-heading text-slate-900 mb-2">
                {selectedWork.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
                {selectedWork.details}
              </p>

              <div className="space-y-2 bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs font-mono text-slate-700 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Stitch Density:</span>
                  <span className="font-bold text-purple-900">{selectedWork.stitches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thread Palette:</span>
                  <span className="font-bold text-purple-900">{selectedWork.colors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Embroidery Machine:</span>
                  <span className="font-bold text-purple-700">C Body 6G Pro (12 Needles)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedWork(null);
                  scrollToSection('whatsapp');
                }}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2"
              >
                <span>Order Similar Embroidery Pattern via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
