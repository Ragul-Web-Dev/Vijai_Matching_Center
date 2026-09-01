import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MessageCircle, UploadCloud, Server, Grid, Star, Sparkles } from 'lucide-react';

export default function Header({ scrollToSection }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel px-4 md:px-8 py-3.5 border-b border-purple-200/50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-300 text-white font-extrabold">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold font-serif-heading tracking-wide text-purple-950 flex items-center gap-1.5">
              VIJAY <span className="text-purple-600 font-light italic">EMBROIDERY</span>
            </h1>
            <p className="text-[10px] text-purple-700/80 tracking-wider uppercase font-medium">Computerized Custom Embroidery Studio</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs md:text-sm font-medium text-slate-700">
          <button onClick={() => scrollToSection('machinery')} className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-600" /> Our Machinery
          </button>
          <button onClick={() => scrollToSection('services')} className="hover:text-purple-600 transition-colors">
            Services
          </button>
          <button onClick={() => scrollToSection('our-work')} className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" /> Our Work
          </button>
          <button onClick={() => scrollToSection('catalog')} className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-purple-600" /> Catalog & Work
          </button>
          <button onClick={() => scrollToSection('upload')} className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-indigo-500" /> Custom Upload
          </button>
          <button onClick={() => scrollToSection('reviews')} className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" /> Reviews
          </button>
          <button onClick={() => scrollToSection('status')} className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-600" /> API Health
          </button>
        </nav>

        {/* WhatsApp Quick CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollToSection('whatsapp')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs md:text-sm shadow-md shadow-purple-200 transition-all border border-purple-400/30"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp Order</span>
        </motion.button>
      </div>
    </motion.header>
  );
}

