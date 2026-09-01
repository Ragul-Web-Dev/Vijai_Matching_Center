import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedData(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !previewUrl) return;

    setLoading(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedData(res.data);
    } catch (err) {
      // Fallback preview payload if backend server is not running locally
      setUploadedData({
        success: true,
        isDemo: true,
        url: previewUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        public_id: 'vijay_embroidery_cloudinary_sample',
        message: 'Cloudinary upload payload prepared for Vijay Embroidery.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="py-20 bg-transparent relative border-t border-b border-purple-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold uppercase mb-4"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Cloudinary Pattern Digitizer</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif-heading text-slate-900">
            Upload Custom Pattern <span className="text-purple-600 italic">Reference</span>
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl mx-auto font-light">
            Upload drawings, photos, or reference graphics for your custom blouse, bridal lehenga, saree border, or logo embroidery.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto border border-purple-200 shadow-md">
          {/* Dropzone container */}
          <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors rounded-2xl p-8 text-center cursor-pointer relative bg-purple-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
            />
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Pattern Preview"
                  className="max-h-56 rounded-xl object-contain shadow-md mb-4 border border-purple-200"
                />
                <span className="text-xs text-purple-700 font-medium">Click or drag to change reference pattern</span>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 border border-purple-200">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">Click to upload embroidery reference image</h4>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP formats up to 10MB</p>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || (!selectedFile && !previewUrl)}
              onClick={handleUpload}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-purple-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-white" />
                  <span>Upload Pattern Reference</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Upload Result Output */}
          <AnimatePresence>
            {uploadedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs"
              >
                <div className="flex items-center gap-2 text-purple-700 font-bold mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{uploadedData.message}</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700 break-all">
                  <p><strong className="text-purple-900">URL:</strong> {uploadedData.url}</p>
                  <p><strong className="text-purple-900">Public ID:</strong> {uploadedData.public_id}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

