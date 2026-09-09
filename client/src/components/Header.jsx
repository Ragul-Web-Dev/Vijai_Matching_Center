import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MessageCircle, UploadCloud, Grid, Star, Sparkles, Instagram, ShieldCheck, Layers, FileText } from 'lucide-react';

export default function Header({ scrollToSection, onOpenAdmin, onOpenQuotation }) {
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
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md shadow-purple-900/10 group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-950 border border-purple-200">
              <img 
                src="/logo.png" 
                alt="Vijai Embroidery Groups Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-brand-title text-lg md:text-[21px] font-extrabold tracking-[0.14em] text-slate-950 group-hover:text-purple-700 transition-colors drop-shadow-sm leading-tight">
                  VIJAI
                </h1>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500" />
              </div>
              <p className="font-brand-modern text-[9.5px] md:text-[10px] font-black tracking-[0.22em] uppercase bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent leading-none mt-0.5">
                Embroidery Groups
              </p>
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

            {/* Download Quotation by ID CTA */}
            <button
              onClick={onOpenQuotation}
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
              title="Download / Track Quotation by ID"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Download Quote</span>
            </button>

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
