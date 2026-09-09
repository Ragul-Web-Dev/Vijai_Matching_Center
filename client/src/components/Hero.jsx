import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight, UploadCloud, Cpu, ShieldCheck, Star } from 'lucide-react';

export default function Hero({ scrollToSection }) {
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-100/40 via-purple-50/20 to-transparent">
      {/* Background Accent Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Tech Stack Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 text-xs font-semibold tracking-wide uppercase mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Computerized Embroidery Studio • Custom Stitching & Design</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-extrabold font-serif-heading tracking-tight text-slate-900 leading-tight mb-6"
        >
          Precision Computerized <br />
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent italic">
            Custom Embroidery
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
        >
          Welcome to <strong className="text-purple-700 font-semibold">Vijai Embroidery Groups</strong>. We specialize in intricate bridal blouse work, saree borders, salwar/chudi embroidery, corporate logo branding, and bespoke pattern creations powered by state-of-the-art 12-needle machinery.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('whatsapp')}
            className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base flex items-center gap-3 shadow-lg shadow-purple-200 border border-purple-400/30"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            <span>Inquire & Order via WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('machinery')}
            className="px-8 py-4 rounded-xl bg-white hover:bg-purple-50/50 text-purple-900 font-semibold text-base flex items-center gap-2 border border-purple-200 shadow-sm"
          >
            <Cpu className="w-5 h-5 text-purple-600" />
            <span>Explore Our Machinery</span>
          </motion.button>
        </motion.div>

        {/* Features highlight bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          {[
            { icon: '⚡', title: '1200 Stitches/Min', desc: 'High-speed precision embroidery', bg: 'bg-purple-100 text-purple-700' },
            { icon: '🧵', title: '12 Needles Auto-Change', desc: 'Rich multi-color thread detail', bg: 'bg-indigo-100 text-indigo-700' },
            { icon: '📐', title: '20 × 32 Frame Area', desc: 'Expansive heavy bridal designs', bg: 'bg-purple-100 text-purple-700' },
            { icon: '✨', title: '5000+ Design Library', desc: 'Custom motifs & patterns', bg: 'bg-indigo-100 text-indigo-700' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-md hover:border-purple-400 hover:shadow-lg transition-all"
            >
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center mb-2.5 font-bold shadow-sm`}>{item.icon}</div>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

