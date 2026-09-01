import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Maximize, Monitor, Disc, HardDrive, ShieldAlert, Sparkles, Layers, Scissors, X, ArrowRight, CheckCircle2 } from 'lucide-react';

const machineSpecs = [
  {
    icon: Cpu,
    label: 'Machine Model',
    value: 'C Body 6G Pro',
    detail: 'Industrial Computerized Embroidery Unit',
    popupTitle: 'C Body 6G Pro Industrial Platform',
    popupDesc: 'Engineered with heavy-duty cast frame technology, Japanese-engineered servo motors, and high-speed multi-axis motion controller for sub-millimeter needle precision.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  },
  {
    icon: Layers,
    label: 'Multi-Needle Capacity',
    value: '12 Needles',
    detail: 'Seamless 12-color thread setup without manual re-threading',
    popupTitle: '12-Needle Automated Thread System',
    popupDesc: 'Holds 12 distinct thread spools simultaneously (Gold Zari, Silver Zari, Resham colors). Switches colors automatically in milliseconds without stopping the embroidery run.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200'
  },
  {
    icon: Zap,
    label: 'Ultra Precision Speed',
    value: 'Up to 1200 stitches/min',
    detail: 'High speed output with micro-precision needle placement',
    popupTitle: '1,200 Stitches Per Minute Production',
    popupDesc: 'Operates at up to 1200 RPM stitch velocity, allowing complex 50,000+ stitch bridal blouse back-necks to be finished cleanly in a fraction of normal tailoring time.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  },
  {
    icon: Maximize,
    label: 'Embroidery Frame Area',
    value: '20 × 32 inches',
    detail: 'Expansive embroidery field for full bridal back-necks & sarees',
    popupTitle: '20 × 32 Inch Massive Border Frame',
    popupDesc: 'Our expansive 20x32 frame fits entire bridal blouse backs, heavy lehenga panels, and continuous saree borders without needing fabric re-clamping.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200'
  },
  {
    icon: Monitor,
    label: 'Smart Display Control',
    value: '10-inch Touchscreen',
    detail: 'Real-time design visualization and dynamic stitch mapping',
    popupTitle: '10-inch Color HD Touchscreen Control',
    popupDesc: 'Displays real-time digital needle mapping, live stitch progress tracking, color sequence previewing, and dynamic pattern scaling before stitching starts.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  },
  {
    icon: Sparkles,
    label: 'Thread Management',
    value: 'Auto Colour Changing',
    detail: 'Automatic sequence transitions for intricate multi-hued motifs',
    popupTitle: 'Automated Color Transition Engine',
    popupDesc: 'Computerized solenoid actuators automatically select and switch active thread needles according to the digitized pattern blueprint.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  },
  {
    icon: Scissors,
    label: 'Automated Trimming',
    value: 'Automatic Thread Trimming',
    detail: 'Clean jump-stitch trimming for flawless, smooth finish',
    popupTitle: 'Automated Jump-Stitch Thread Trimmer',
    popupDesc: 'Under-bed thread blades automatically slice jump threads between motifs, giving a clean, polished garment surface free of messy thread ends.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200'
  },
  {
    icon: ShieldAlert,
    label: 'Quality Safety',
    value: 'Thread-Break Detection',
    detail: 'Instant automated sensors prevent skipped stitches or errors',
    popupTitle: 'Optical Thread-Break Sensors',
    popupDesc: 'Sensors monitor tension on every needle. If a thread breaks, the machine instantly pauses automatically so no stitches are ever skipped.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  },
  {
    icon: Disc,
    label: 'Pattern Repository',
    value: '5000 Unique Designs',
    detail: 'Pre-loaded traditional, modern, and floral embroidery library',
    popupTitle: '5,000+ Pre-Loaded Embroidery Pattern Library',
    popupDesc: 'Library of ready-to-stitch designs including peacock back-necks, mangalgiri borders, floral creepers, zardozi motifs, and religious emblems.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200'
  },
  {
    icon: HardDrive,
    label: 'Design Memory Storage',
    value: '32 GB Design Storage',
    detail: 'Stores thousands of high-density custom customer patterns',
    popupTitle: '32GB On-Board Pattern Memory',
    popupDesc: 'Stores repeat customer designs, shop catalog files, and custom logos for instant re-ordering without needing re-digitizing fees.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  }
];

export default function Machinery() {
  const [selectedSpec, setSelectedSpec] = useState(null);

  return (
    <section id="machinery" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Industrial Craftsmanship</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Precision Behind <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent italic">Every Stitch</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-light">
            Powered by high-performance Japanese-engineered computerized multi-needle technology. Click any spec box for detailed feature popups.
          </p>
        </div>

        {/* Machine Highlight Hero Card with Official Machine Poster Photo */}
        <div className="mb-12 glass-card p-6 md:p-8 rounded-3xl border border-purple-200 relative overflow-hidden bg-white shadow-md">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Machine Photo */}
            <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => setSelectedSpec(machineSpecs[0])}>
              <div className="rounded-2xl overflow-hidden border-2 border-purple-200 shadow-lg relative bg-white p-2">
                <img
                  src="/c-body-6g-pro-machine.jpg"
                  alt="Vijay Embroidery C Body 6G Pro Machine Poster"
                  className="w-full h-auto max-h-[420px] object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Machine Details */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md text-white flex-shrink-0">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      FULLY AUTOMATED AI
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-serif-heading mt-0.5">
                      C Body 6G Pro Model
                    </h3>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light mt-3">
                  Advanced Intelligent computerized multi-needle embroidery machine equipped with A15 Pro software, 10-inch touchscreen display, automated thread trimming, thread-break detection sensors, and 5,000 unique pre-loaded designs.
                </p>
              </div>

              {/* Badges bar */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 flex items-center gap-1.5">
                  👍 1 Year Free Service & 5 Years Warranty
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center gap-1.5">
                  🚚 All Over Tamil Nadu Doorstep Delivery
                </span>
              </div>

              {/* Quick Spec Metrics */}
              <div className="grid grid-cols-3 gap-3 border-t border-purple-100 pt-4 bg-purple-50/50 p-4 rounded-2xl">
                <div className="text-center cursor-pointer hover:bg-purple-100/50 rounded-xl p-1 transition-colors" onClick={() => setSelectedSpec(machineSpecs[2])}>
                  <p className="text-xl md:text-2xl font-extrabold text-purple-700 font-serif-heading">1200</p>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium">Stitches / Min</p>
                </div>
                <div className="text-center border-l border-r border-purple-200 px-2 cursor-pointer hover:bg-purple-100/50 rounded-xl p-1 transition-colors" onClick={() => setSelectedSpec(machineSpecs[1])}>
                  <p className="text-xl md:text-2xl font-extrabold text-indigo-600 font-serif-heading">12</p>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium">Needles</p>
                </div>
                <div className="text-center cursor-pointer hover:bg-purple-100/50 rounded-xl p-1 transition-colors" onClick={() => setSelectedSpec(machineSpecs[3])}>
                  <p className="text-xl md:text-2xl font-extrabold text-purple-700 font-serif-heading">20×32"</p>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium">Frame Area</p>
                </div>
              </div>

              {/* Studio Contact Footer */}
              <div className="p-3.5 rounded-xl bg-purple-900 text-white border border-purple-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
                <div>
                  <span className="text-purple-300 font-bold">Contact Us:</span> <a href="tel:9790449627" className="text-purple-100 hover:text-white font-bold underline">9790449627</a>
                </div>
                <div className="text-purple-200 text-[11px] text-center sm:text-right">
                  131, Sri Devaki Complex, Alagapuram, Salem 636016
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Machine Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {machineSpecs.map((spec) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.label}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSpec(spec)}
                className="glass-card p-5 rounded-2xl border border-purple-100 hover:border-purple-400 transition-all flex flex-col justify-between cursor-pointer bg-white/80 hover:shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${spec.bg} border ${spec.border} ${spec.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-purple-700 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">POPUP</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{spec.label}</h4>
                  <p className="text-sm font-bold text-slate-800 mt-1 group-hover:text-purple-700 transition-colors">{spec.value}</p>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 leading-tight font-light border-t border-purple-100 pt-2 flex items-center justify-between">
                  <span>{spec.detail}</span>
                  <ArrowRight className="w-3 h-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Spec Popup Modal */}
      <AnimatePresence>
        {selectedSpec && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedSpec(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-purple-200 bg-white relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${selectedSpec.bg} border ${selectedSpec.border} ${selectedSpec.color} flex items-center justify-center shadow-sm`}>
                    {React.createElement(selectedSpec.icon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">MACHINE SPECIFICATION</span>
                    <h3 className="text-xl font-bold font-serif-heading text-slate-900">
                      {selectedSpec.label}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSpec(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 mb-4">
                <h4 className="text-lg font-bold text-purple-900 font-serif-heading mb-1">{selectedSpec.popupTitle}</h4>
                <p className="text-xs text-purple-950 font-bold font-mono">{selectedSpec.value}</p>
              </div>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light mb-6">
                {selectedSpec.popupDesc}
              </p>

              <div className="space-y-2 pt-3 border-t border-purple-100 mb-6 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Guaranteed high-density stitch accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-purple-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Compatible with Silk, Net, Velvet, Cotton, and Activewear</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSpec(null)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200"
              >
                Close Specification Modal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
