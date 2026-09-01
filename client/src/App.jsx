import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Machinery from './components/Machinery';
import Services from './components/Services';
import OurEmbroideryWork from './components/OurEmbroideryWork';
import CatalogGallery from './components/CatalogGallery';
import ImageUploader from './components/ImageUploader';
import CustomerReviews from './components/CustomerReviews';
import WhatsAppWidget from './components/WhatsAppWidget';
import BackendStatus from './components/BackendStatus';
import InteractiveTailoringBackground from './components/InteractiveTailoringBackground';

export default function App() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6fc] text-slate-800 font-sans selection:bg-purple-500 selection:text-white relative">
      <InteractiveTailoringBackground />
      <Header scrollToSection={scrollToSection} />
      <main>
        <Hero scrollToSection={scrollToSection} />
        <Machinery />
        <Services />
        <OurEmbroideryWork scrollToSection={scrollToSection} />
        <CatalogGallery scrollToSection={scrollToSection} />
        <ImageUploader />
        <CustomerReviews />
        <WhatsAppWidget />
        <BackendStatus />
      </main>

      <footer className="py-8 bg-purple-900 text-white border-t border-purple-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-purple-100">© {new Date().getFullYear()} Vijay Embroidery Studio. All rights reserved.</p>
            <p className="text-[11px] text-purple-200/80 mt-0.5">Computerized Embroidery • Custom Blouse • Bridal • Logos • Sarees</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-purple-200/90 font-mono text-[11px]">
            <span>C Body 6G Pro</span>
            <span>•</span>
            <span>12 Needles</span>
            <span>•</span>
            <span>1200 Stitches/Min</span>
            <span>•</span>
            <span>20×32 Frame</span>
            <span>•</span>
            <span>Cloudinary</span>
            <span>•</span>
            <span>WhatsApp Order</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

