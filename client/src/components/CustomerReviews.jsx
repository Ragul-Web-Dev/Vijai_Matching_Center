import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, CheckCircle, X, ArrowRight } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    client: 'Bridal Blouse Order',
    location: 'Chennai, TN',
    rating: 5,
    service: 'Custom Bridal Embroidery',
    review: 'The peacock zari embroidery on my bridal blouse back neck came out so sharp and precise! The 12-needle finish gave incredible color depth to the resham threads.',
    fullFeedback: 'We ordered custom peacock zari embroidery for a grand velvet bridal blouse back neck and sleeve borders. The turn-around time was super fast and the stitch density was beyond our expectations. The color-fast metallic gold thread shines beautifully under wedding hall lights!',
    date: 'Recent Studio Work'
  },
  {
    id: 2,
    client: 'Silk Saree Border Stitching',
    location: 'Coimbatore, TN',
    rating: 5,
    service: 'Saree & Border Embroidery',
    review: 'Delivered continuous 20x32 inch scalloped borders for 3 silk sarees right on schedule. Smooth finish without any thread pulls or loose ends.',
    fullFeedback: 'We gave 3 Kanchipuram silk sarees for continuous scalloped temple border embroidery. Thanks to their large 20x32 inch embroidery frame, there were no visible frame joint lines or thread puckering. Highly recommended for saree boutiques!',
    date: 'Recent Studio Work'
  },
  {
    id: 3,
    client: 'Corporate Logo Crest Order',
    location: 'Madurai, TN',
    rating: 5,
    service: 'Logo Embroidery',
    review: 'Had 100 polo shirts embroidered with our company logo emblem. Clean lettering, durable color-fast thread, and fast turnaround.',
    fullFeedback: 'Ordered 100 corporate polo activewear tees with customized logo chest crests. The digitized stitch punching rendered small company font letters crisply without distortion.',
    date: 'Recent Bulk Order'
  }
];

export default function CustomerReviews() {
  const [selectedReview, setSelectedReview] = useState(null);

  return (
    <section id="reviews" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5" />
            <span>Customer Satisfaction</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Customer Reviews & <span className="text-purple-600 italic">Feedback</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-light">
            Read verified feedback. Click any review card to open the complete customer review pop-up modal.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReview(rev)}
              className="glass-card p-8 rounded-3xl relative border border-purple-100 hover:border-purple-400 transition-all flex flex-col justify-between cursor-pointer bg-white/80 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-purple-700 font-mono bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {rev.date}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-purple-300 mb-4 group-hover:text-purple-500 transition-colors" />

                <p className="text-sm text-slate-600 leading-relaxed font-light mb-6 italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif-heading group-hover:text-purple-700 transition-colors">{rev.client}</h4>
                  <p className="text-xs text-purple-700 font-mono mt-0.5">{rev.service}</p>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Review Popup Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-purple-200 bg-white relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0 Star Rating</span>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                    {selectedReview.client}
                  </h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Order
                  </span>
                </div>
                <p className="text-xs text-purple-700 font-mono mt-1">{selectedReview.service} • {selectedReview.location}</p>
              </div>

              <div className="mb-6">
                <Quote className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-sm text-slate-700 leading-relaxed font-light italic">
                  "{selectedReview.fullFeedback}"
                </p>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200"
              >
                Close Customer Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
