import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MessageCircle, UploadCloud, Grid, Star, Sparkles, Instagram, ShieldCheck, Layers } from 'lucide-react';

export default function Header({ scrollToSection, onOpenAdmin }) {
  const instagramUrl = "https://www.instagram.com/vijay_embroidery_studio/";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 px-3 md:px-6 py-3"
    >
      {/* Clean White Glassmorphism Navbar Container */}
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/90 backdrop-blur-xl border border-purple-200/80 shadow-lg shadow-purple-900/5 relative overflow-hidden px-4 md:px-6 py-2.5">
        
        <div className="relative z-10 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-500 p-[1.5px] shadow-md shadow-purple-300 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black tracking-wider text-slate-900 flex items-center gap-1 font-serif-heading">
                VIJAY <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent italic font-light">EMBROIDERY</span>
              </h1>
              <p className="text-[9px] text-purple-700/80 tracking-widest uppercase font-semibold font-mono">12-Needle Studio • Maggam Work</p>
            </div>
          </div>

          {/* Clean Nav Links Pills */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('machinery')}
              className="px-3.5 py-1.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600 group-hover:text-white" /> Machinery
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="px-3.5 py-1.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white" /> Services
            </button>
            <button
              onClick={() => scrollToSection('our-work')}
              className="px-3.5 py-1.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-600 group-hover:text-white" /> Our Work
            </button>
            <button
              onClick={() => scrollToSection('catalog')}
              className="px-3.5 py-1.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5 text-purple-600 group-hover:text-white" /> Catalog
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="px-3.5 py-1.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 group-hover:text-white" /> Reviews
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Instagram Link Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 transition-all hover:scale-105 shadow-sm"
              title="Instagram @vijay_embroidery_studio"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Admin Portal Modal Trigger */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* WhatsApp Quick CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('whatsapp')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs md:text-sm shadow-md shadow-purple-200 transition-all border border-purple-400/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
