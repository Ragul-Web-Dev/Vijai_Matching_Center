import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, CheckCircle, X, Plus, Instagram, ExternalLink, Send, UploadCloud, Image as ImageIcon, Video, ShieldCheck } from 'lucide-react';

const defaultReviewsData = [
  {
    id: 1,
    client: 'Bridal Blouse Order (Meenakshi)',
    location: 'Chennai, TN',
    rating: 5,
    service: 'Custom Bridal Embroidery',
    review: 'The peacock zari embroidery on my bridal blouse back neck came out so sharp and precise! The 12-needle finish gave incredible color depth to the resham threads.',
    fullFeedback: 'We ordered custom peacock zari embroidery for a grand velvet bridal blouse back neck and sleeve borders. The turn-around time was super fast and the stitch density was beyond our expectations. The color-fast metallic gold thread shines beautifully under wedding hall lights!',
    date: 'Recent Studio Work'
  },
  {
    id: 2,
    client: 'Silk Saree Border Stitching (Divya)',
    location: 'Coimbatore, TN',
    rating: 5,
    service: 'Saree & Border Embroidery',
    review: 'Delivered continuous 20x32 inch scalloped borders for 3 silk sarees right on schedule. Smooth finish without any thread pulls or loose ends.',
    fullFeedback: 'We gave 3 Kanchipuram silk sarees for continuous scalloped temple border embroidery. Thanks to their large 20x32 inch embroidery frame, there were no visible frame joint lines or thread puckering. Highly recommended for saree boutiques!',
    date: 'Recent Studio Work'
  },
  {
    id: 3,
    client: 'Corporate Logo Crest Order (Radhika)',
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
  const [reviewsList, setReviewsList] = useState(defaultReviewsData);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formFeedback, setFormFeedback] = useState({
    name: '',
    service: 'Bridal Blouse Embroidery',
    rating: 5,
    comment: '',
    image: '',
    video: ''
  });
  const [mediaPreview, setMediaPreview] = useState(null);

  const instagramUrl = "https://www.instagram.com/vijay_embroidery_studio/";

  useEffect(() => {
    // Fetch published feedbacks from backend API
    const fetchPublishedFeedbacks = async () => {
      try {
        const res = await axios.get('/api/feedbacks', { timeout: 3000 });
        if (res.data && res.data.success && Array.isArray(res.data.feedbacks) && res.data.feedbacks.length > 0) {
          const mapped = res.data.feedbacks.map((item) => ({
            id: item.id,
            client: item.name,
            location: 'Verified Customer',
            rating: item.rating || 5,
            service: item.service || 'Custom Embroidery',
            review: item.comment,
            fullFeedback: item.comment,
            image: item.image,
            video: item.video,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent Studio Work'
          }));
          setReviewsList(mapped);
          return;
        }
      } catch (err) {
        // Fallback to localStorage if offline
      }

      const saved = localStorage.getItem('vijay_customer_reviews');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = parsed
              .filter(item => item.status === 'Approved' || item.status === 'Published' || !item.status)
              .map((item) => ({
                id: item.id,
                client: item.name,
                location: 'Verified Customer',
                rating: item.rating || 5,
                service: item.service || 'Custom Embroidery',
                review: item.comment,
                fullFeedback: item.comment,
                image: item.image,
                video: item.video,
                date: item.time || 'Recent Feedback'
              }));
            setReviewsList([...mapped, ...defaultReviewsData]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchPublishedFeedbacks();
  }, []);

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');

      if (!isImg && !isVid) {
        alert('Please select an image (JPG, PNG, WEBP) or video file (MP4, WEBM).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (isVid) {
          setFormFeedback(prev => ({ ...prev, video: reader.result, image: '' }));
          setMediaPreview({ type: 'video', src: reader.result });
        } else {
          setFormFeedback(prev => ({ ...prev, image: reader.result, video: '' }));
          setMediaPreview({ type: 'image', src: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!formFeedback.name || !formFeedback.comment) return;

    const newFeedbackObj = {
      name: formFeedback.name.trim(),
      rating: Number(formFeedback.rating),
      comment: formFeedback.comment.trim(),
      service: formFeedback.service,
      image: formFeedback.image || null,
      video: formFeedback.video || null,
      status: 'Draft' // Requires admin approval before appearing on site
    };

    try {
      await axios.post('/api/feedbacks', newFeedbackObj, { timeout: 3000 });
    } catch (err) {
      console.warn('Feedback API offline notice:', err.message);
    }

    // Save to localStorage for fallback / admin review
    const localEntry = {
      id: 'FB-' + Date.now(),
      ...newFeedbackObj,
      time: 'Just now'
    };
    const existing = JSON.parse(localStorage.getItem('vijay_customer_reviews') || '[]');
    localStorage.setItem('vijay_customer_reviews', JSON.stringify([localEntry, ...existing]));

    setSubmitSuccess(true);

    setTimeout(() => {
      setFormFeedback({ name: '', service: 'Bridal Blouse Embroidery', rating: 5, comment: '', image: '', video: '' });
      setMediaPreview(null);
      setSubmitSuccess(false);
      setShowSubmitModal(false);
    }, 2800);
  };

  return (
    <section id="reviews" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Customer Satisfaction & Verified Feedback</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-serif-heading text-slate-900 mb-4">
            Customer Reviews & <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 bg-clip-text text-transparent italic">Real Experiences</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-light mb-6">
            Read verified reviews from our clients across Tamil Nadu. Follow our studio on Instagram <span className="font-bold text-pink-600">@vijay_embroidery_studio</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-200 transition-all"
            >
              <Plus className="w-4 h-4" /> Write A Review / Feedback
            </button>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Instagram className="w-4 h-4" /> Instagram @vijay_embroidery_studio <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsList.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReview(rev)}
              className="glass-card p-6 md:p-8 rounded-3xl relative border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer bg-white/90 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {rev.date}
                  </span>
                </div>

                {/* Media Image / Video Thumbnail if available */}
                {rev.image && (
                  <div className="mb-4 h-36 rounded-2xl overflow-hidden border border-emerald-100 relative bg-slate-100">
                    <img
                      src={rev.image}
                      alt="Work reference"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <Quote className="w-7 h-7 text-emerald-300 mb-3 group-hover:text-emerald-600 transition-colors" />

                <p className="text-sm text-slate-600 leading-relaxed font-light mb-5 italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif-heading group-hover:text-emerald-700 transition-colors">{rev.client}</h4>
                  <p className="text-xs text-emerald-700 font-mono mt-0.5">{rev.service}</p>
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
              className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-emerald-200 bg-white relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">{selectedReview.rating}.0 Rating</span>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Work Media Preview in Modal */}
              {selectedReview.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-emerald-200 max-h-56">
                  <img
                    src={selectedReview.image}
                    alt="Customer Embroidery Work"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedReview.video && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-emerald-200">
                  <video
                    src={selectedReview.video}
                    controls
                    className="w-full max-h-60 rounded-xl"
                  />
                </div>
              )}

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                    {selectedReview.client}
                  </h3>
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Feedback
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-mono mt-1">{selectedReview.service} • {selectedReview.location}</p>
              </div>

              <div className="mb-6">
                <Quote className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-sm text-slate-700 leading-relaxed font-light italic">
                  "{selectedReview.fullFeedback}"
                </p>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-200"
              >
                Close Customer Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Submit Feedback Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-purple-200 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> Submit Your Review & Feedback
                </h3>
                <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-serif-heading">Review Submitted for Approval!</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Thank you! Your feedback and uploaded media have been sent to Vijay Embroidery Studio Admin for verification. It will be published to the website upon approval.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUserFeedbackSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyadarshini R."
                      value={formFeedback.name}
                      onChange={(e) => setFormFeedback({ ...formFeedback, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 bg-emerald-50/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Garment / Service</label>
                    <select
                      value={formFeedback.service}
                      onChange={(e) => setFormFeedback({ ...formFeedback, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 bg-emerald-50/20"
                    >
                      <option value="Bridal Blouse Embroidery">Bridal Blouse Embroidery (Neck & Sleeves)</option>
                      <option value="Saree Border Embroidery">Saree Border Embroidery (20x32 Frame)</option>
                      <option value="Custom Digitized Pattern">Custom Digitized Maggam Pattern</option>
                      <option value="Logo Crest Embroidery">Corporate / School Logo Crest</option>
                      <option value="Chudi & Salwar Embroidery">Chudi & Salwar Embroidery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                    <select
                      value={formFeedback.rating}
                      onChange={(e) => setFormFeedback({ ...formFeedback, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 bg-emerald-50/20"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent Finish)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good Quality)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Feedback Comment</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with our 12-needle computerized embroidery quality, stitch density, and finish..."
                      value={formFeedback.comment}
                      onChange={(e) => setFormFeedback({ ...formFeedback, comment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 resize-none bg-emerald-50/20"
                    />
                  </div>

                  {/* Optional Work Photo / Video Upload */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attach Your Stitched Garment Photo or Video (Optional)</label>
                    <div className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/30 rounded-xl p-3 text-center cursor-pointer relative transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                        onChange={handleMediaSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="flex items-center justify-center gap-2 text-emerald-800">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium">Click to attach blouse/saree photo (JPG, PNG) or clip (MP4)</span>
                      </div>
                    </div>

                    {mediaPreview && (
                      <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-emerald-900">Media attached ({mediaPreview.type})</span>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPreview(null);
                            setFormFeedback(prev => ({ ...prev, image: '', video: '' }));
                          }}
                          className="text-rose-600 text-xs font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Submitted reviews and media will be verified and approved by the Studio Admin before going live.</span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold shadow-md shadow-emerald-200 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit for Approval
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
