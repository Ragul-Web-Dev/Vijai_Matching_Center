import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Machinery from './components/Machinery';
import Services from './components/Services';
import OurEmbroideryWork from './components/OurEmbroideryWork';
import CatalogGallery from './components/CatalogGallery';
import CustomerReviews from './components/CustomerReviews';
import WhatsAppWidget from './components/WhatsAppWidget';
import AdminPanel from './components/AdminPanel';
import InteractiveTailoringBackground from './components/InteractiveTailoringBackground';
import { 
  Instagram, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  MessageCircle, 
  ArrowUpRight,
  Heart
} from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedDesign, setSelectedDesign] = useState(null);

  useEffect(() => {
    // Listen to browser navigation changes
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      if (window.location.pathname.startsWith('/admin')) {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial check for /admin/login or /admin/dashboard
    if (window.location.pathname.startsWith('/admin')) {
      setIsAdminOpen(true);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path.startsWith('/admin')) {
      setIsAdminOpen(true);
    } else {
      setIsAdminOpen(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDesign = (design) => {
    setSelectedDesign(design);
    scrollToSection('whatsapp');
  };

  const instagramUrl = "https://www.instagram.com/vijay_embroidery_studio/";

  return (
    <div className="min-h-screen bg-[#f8f6fc] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white relative">
      <InteractiveTailoringBackground />
      <Header 
        scrollToSection={scrollToSection} 
        onOpenAdmin={() => {
          navigateTo('/admin/dashboard');
        }} 
      />
      
      <main>
        <Hero scrollToSection={scrollToSection} />
        <Machinery />
        <Services />
        <OurEmbroideryWork scrollToSection={scrollToSection} />
        <CatalogGallery scrollToSection={scrollToSection} onSelectDesign={handleSelectDesign} />
        <CustomerReviews />
        <WhatsAppWidget selectedDesign={selectedDesign} />
      </main>

      {/* Secure Studio Admin Dashboard Modal & Routed View */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        initialView={currentPath === '/admin/login' ? 'login' : 'dashboard'}
        onNavigate={navigateTo}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.pathname.startsWith('/admin')) {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }
        }} 
      />

      {/* RICH MODERN FOOTER WITH STORE ADDRESS & CONTACT DETAILS */}
      <footer className="relative bg-slate-950 text-white pt-16 pb-8 border-t border-emerald-900/60 overflow-hidden">
        {/* Subtle Background Mesh Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/50">
            {/* Column 1: Studio Info & Branding */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-400 p-[1.5px] shadow-lg shadow-emerald-900/50">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-wider text-white font-serif-heading">
                    VIJAY <span className="text-emerald-400 italic font-light">EMBROIDERY</span>
                  </h3>
                  <p className="text-[10px] text-emerald-300/70 uppercase font-mono tracking-widest">Studio & Custom Tailoring</p>
                </div>
              </div>

              <p className="text-xs text-emerald-200/80 leading-relaxed font-light">
                South India's premier computerized 12-needle embroidery studio. Specializing in grand Maggam bridal blouses, silk saree borders, custom pattern digitizing, and corporate crests.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-300 hover:text-white hover:bg-pink-900/80 text-xs font-bold transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>@vijay_embroidery_studio</span>
                  <ArrowUpRight className="w-3 h-3 text-pink-400" />
                </a>
              </div>
            </div>

            {/* Column 2: Store Address & Map details */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono border-l-2 border-amber-400 pl-2.5">
                Store Location & Address
              </h4>

              <div className="space-y-3 text-xs text-emerald-200/90 font-light">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Vijay Embroidery Studio</p>
                    <p className="text-emerald-200/80 mt-0.5">
                      No. 12/B, Tailor Studio Street, Opp. Flower Market, Main Road, Tamil Nadu, India.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-[11px] text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Landmark: Near Grand Silk Bazaar & Main Bus Stop</span>
                </div>
              </div>
            </div>

            {/* Column 3: Direct Contact & Hours */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono border-l-2 border-emerald-500 pl-2.5">
                Contact & Studio Hours
              </h4>

              <div className="space-y-3 text-xs text-emerald-200/90">
                <a 
                  href="https://wa.me/919790449627" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400 font-mono">WhatsApp & Call</p>
                    <p className="font-bold text-white group-hover:text-emerald-300 transition-colors">+91 97904 49627</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-[11px]">
                    <p className="font-bold text-white">Studio Timings</p>
                    <p className="text-emerald-300/80">Mon – Sat: 9:00 AM – 9:00 PM</p>
                    <p className="text-emerald-300/80">Sun: 10:00 AM – 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Quick Navigation & Admin Portal */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono border-l-2 border-emerald-500 pl-2.5">
                Quick Links & Admin
              </h4>

              <ul className="space-y-2 text-xs text-emerald-200/80">
                <li>
                  <button onClick={() => scrollToSection('machinery')} className="hover:text-amber-300 transition-colors">
                    • 12-Needle Machinery Specs
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-amber-300 transition-colors">
                    • Embroidery & Stitching Services
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('catalog')} className="hover:text-amber-300 transition-colors">
                    • Design Catalog & Work
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('reviews')} className="hover:text-amber-300 transition-colors">
                    • Customer Feedbacks
                  </button>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('/admin/login')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 hover:from-emerald-800 hover:to-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Open Admin Portal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Specs */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
            <p>© {new Date().getFullYear()} Vijay Embroidery Studio. All rights reserved.</p>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-emerald-300">C Body 6G Pro</span>
              <span>•</span>
              <span className="text-amber-400">12 Needles</span>
              <span>•</span>
              <span className="text-pink-400">20×32 Frame</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
