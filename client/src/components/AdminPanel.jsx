import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Star, 
  Instagram, 
  X, 
  TrendingUp, 
  CheckCircle, 
  Trash2, 
  Plus, 
  Send, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Eye,
  Clock,
  ThumbsUp,
  Sparkles,
  Lock,
  LogOut,
  Image as ImageIcon,
  Video,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Receipt
} from 'lucide-react';
import axios from 'axios';
import QuotationGenerator from './QuotationGenerator';

export default function AdminPanel({ isOpen, onClose, initialView = 'dashboard', onNavigate }) {
  const [token, setToken] = useState(localStorage.getItem('vijay_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState(initialView === 'quotations' ? 'quotations' : 'enquiries'); // 'enquiries' | 'feedbacks' | 'quotations'

  useEffect(() => {
    if (initialView === 'quotations') {
      setActiveTab('quotations');
    }
  }, [initialView]);

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    confirmed: 0,
    completed: 0
  });

  const [enquiries, setEnquiries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  // Add feedback modal state
  const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    rating: 5,
    service: 'Bridal Blouse Work',
    comment: '',
    status: 'Published',
    image: '',
    video: ''
  });
  const [feedbackMediaPreview, setFeedbackMediaPreview] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const instagramHandle = "vijay_embroidery_studio";
  const instagramUrl = "https://www.instagram.com/vijay_embroidery_studio/";

  // Helper for auth headers
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/admin/verify', getAuthHeaders());
        if (res.data && res.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setToken('');
          localStorage.removeItem('vijay_admin_token');
        }
      } catch (err) {
        // If backend verify fails but offline token exists with standard password
        if (localStorage.getItem('vijay_admin_logged_in') === 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, [token]);

  // Fetch enquiries and feedbacks when authenticated
  const fetchData = async () => {
    if (!token && !isAuthenticated) return;

    try {
      // 1. Enquiries
      const enqRes = await axios.get('/api/admin/enquiries', getAuthHeaders());
      if (enqRes.data && enqRes.data.success) {
        setEnquiries(enqRes.data.enquiries || []);
        setStats(enqRes.data.stats || { total: 0, new: 0, contacted: 0, confirmed: 0, completed: 0 });
      }
    } catch (err) {
      // Offline fallback
      const storedEnqs = JSON.parse(localStorage.getItem('vijay_enquiries_log') || '[]');
      setEnquiries(storedEnqs);
      setStats({
        total: storedEnqs.length,
        new: storedEnqs.filter(e => e.status === 'New').length,
        contacted: storedEnqs.filter(e => e.status === 'Contacted').length,
        confirmed: storedEnqs.filter(e => e.status === 'Confirmed').length,
        completed: storedEnqs.filter(e => e.status === 'Completed').length
      });
    }

    try {
      // 2. Feedbacks
      const fbRes = await axios.get('/api/admin/feedbacks', getAuthHeaders());
      if (fbRes.data && fbRes.data.success) {
        setFeedbacks(fbRes.data.feedbacks || []);
      }
    } catch (err) {
      const storedFb = JSON.parse(localStorage.getItem('vijay_customer_reviews') || '[]');
      setFeedbacks(storedFb);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, token]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);

    try {
      const res = await axios.post('/api/admin/login', {
        username: loginForm.username,
        password: loginForm.password
      });

      if (res.data && res.data.success && res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('vijay_admin_token', res.data.token);
        localStorage.setItem('vijay_admin_logged_in', 'true');
        setIsAuthenticated(true);
        if (onNavigate) onNavigate('/admin/dashboard');
      } else {
        setLoginError(res.data.message || 'Login failed. Please verify password.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError('Authentication error. Please verify administrative password.');
      }
    } finally {
      setSubmittingLogin(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('/api/admin/logout', {}, getAuthHeaders());
      }
    } catch (err) {
      // Ignore network cleanup errors
    } finally {
      setToken('');
      setIsAuthenticated(false);
      localStorage.removeItem('vijay_admin_token');
      localStorage.removeItem('vijay_admin_logged_in');
      if (onNavigate) onNavigate('/admin/login');
    }
  };

  // Handle Status Update for Enquiry (New -> Contacted -> Confirmed -> Completed)
  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/admin/enquiries/${id}/status`, { status: newStatus }, getAuthHeaders());
    } catch (err) {
      console.warn('Status update API sync note:', err.message);
    }

    const updated = enquiries.map(e => (e.id === id || e.refId === id) ? { ...e, status: newStatus } : e);
    setEnquiries(updated);
    setStats({
      total: updated.length,
      new: updated.filter(e => e.status === 'New').length,
      contacted: updated.filter(e => e.status === 'Contacted').length,
      confirmed: updated.filter(e => e.status === 'Confirmed').length,
      completed: updated.filter(e => e.status === 'Completed').length
    });
    localStorage.setItem('vijay_enquiries_log', JSON.stringify(updated));
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return;

    try {
      await axios.delete(`/api/admin/enquiries/${id}`, getAuthHeaders());
    } catch (err) {
      console.warn('Delete enquiry API note:', err.message);
    }

    const updated = enquiries.filter(e => e.id !== id && e.refId !== id);
    setEnquiries(updated);
    setStats({
      total: updated.length,
      new: updated.filter(e => e.status === 'New').length,
      contacted: updated.filter(e => e.status === 'Contacted').length,
      confirmed: updated.filter(e => e.status === 'Confirmed').length,
      completed: updated.filter(e => e.status === 'Completed').length
    });
    localStorage.setItem('vijay_enquiries_log', JSON.stringify(updated));
  };

  // Toggle Feedback Published/Draft Status
  const handleToggleFeedbackStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await axios.patch(`/api/admin/feedbacks/${id}`, { status: nextStatus }, getAuthHeaders());
    } catch (err) {
      console.warn('Feedback status sync note:', err.message);
    }

    const updated = feedbacks.map(f => f.id === id ? { ...f, status: nextStatus } : f);
    setFeedbacks(updated);
    localStorage.setItem('vijay_customer_reviews', JSON.stringify(updated));
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;

    try {
      await axios.delete(`/api/admin/feedbacks/${id}`, getAuthHeaders());
    } catch (err) {
      console.warn('Delete feedback API note:', err.message);
    }

    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('vijay_customer_reviews', JSON.stringify(updated));
  };

  // Handle Feedback File Select
  const handleFeedbackFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      const isImg = file.type.startsWith('image/');

      if (!isImg && !isVid) {
        alert('Please select a valid image (JPG, PNG, WEBP) or video (MP4, WEBM).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (isVid) {
          setFeedbackForm(prev => ({ ...prev, video: reader.result, image: '' }));
          setFeedbackMediaPreview({ type: 'video', src: reader.result });
        } else {
          setFeedbackForm(prev => ({ ...prev, image: reader.result, video: '' }));
          setFeedbackMediaPreview({ type: 'image', src: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Feedback
  const handleAddFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.name.trim() || !feedbackForm.comment.trim()) {
      alert('Please fill out customer name and feedback comment.');
      return;
    }

    setIsSubmittingFeedback(true);
    const newEntry = {
      id: 'FB-' + Date.now(),
      name: feedbackForm.name.trim(),
      rating: Number(feedbackForm.rating),
      service: feedbackForm.service,
      comment: feedbackForm.comment.trim(),
      image: feedbackForm.image || null,
      video: feedbackForm.video || null,
      status: feedbackForm.status || 'Published',
      createdAt: new Date().toISOString()
    };

    try {
      await axios.post('/api/admin/feedbacks', newEntry, getAuthHeaders());
    } catch (err) {
      console.warn('Create feedback API note:', err.message);
    }

    const updated = [newEntry, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('vijay_customer_reviews', JSON.stringify(updated));

    setFeedbackForm({
      name: '',
      rating: 5,
      service: 'Bridal Blouse Work',
      comment: '',
      status: 'Published',
      image: '',
      video: ''
    });
    setFeedbackMediaPreview(null);
    setIsSubmittingFeedback(false);
    setShowAddFeedbackModal(false);
  };

  // Filtered enquiries list
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (enq.name && enq.name.toLowerCase().includes(q)) ||
      (enq.phone && enq.phone.includes(q)) ||
      (enq.refId && enq.refId.toLowerCase().includes(q)) ||
      (enq.service && enq.service.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200/80 max-h-[92vh] flex flex-col my-auto"
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/50 flex items-center justify-center bg-slate-950 shadow-md">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2 font-brand-title">
                VIJAI <span className="text-xs font-brand-luxury italic text-emerald-400 font-light">EMBROIDERY</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  🔒 Secure Admin Portal
                </span>
              </h2>
              <p className="text-[10.5px] text-emerald-300/80 font-mono">12-Needle Machinery Operations, Customer Enquiries & Verified Reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-700/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
                title="Securely Sign Out and Invalidate Token"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Loading / Login Screen vs Dashboard */}
        {authLoading ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs font-mono">Verifying administrative security session...</span>
          </div>
        ) : !isAuthenticated ? (
          /* ============================================================ */
          /* SECURE ADMIN LOGIN SCREEN (/admin/login)                      */
          /* ============================================================ */
          <div className="p-8 sm:p-12 flex-1 flex items-center justify-center bg-gradient-to-b from-slate-50 to-emerald-50/40">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-emerald-200/90 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm">
                  <Lock className="w-7 h-7 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-bold font-brand-title text-slate-900">Admin Sign In</h3>
                <p className="text-xs text-slate-600 font-light">
                  Protected administrative portal for managing customer WhatsApp orders and media reviews.
                </p>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10.5px] font-mono text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Brute-force Protected • Max 5 Attempts</span>
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-emerald-50/30 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-emerald-50/30 text-slate-900 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingLogin}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submittingLogin ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Access Admin Dashboard</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 text-[11px] text-slate-400 font-mono">
                Official Studio Portal • Salem Headquarters
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SECURE ADMIN DASHBOARD (/admin/dashboard)                     */
          /* ============================================================ */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Stats Banner */}
            <div className="bg-slate-50 border-b border-emerald-100 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-5 gap-3 shrink-0">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">New Enquiries</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{stats.new}</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Contacted</span>
                <p className="text-xl sm:text-2xl font-black text-amber-800 mt-1">{stats.contacted}</p>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Confirmed</span>
                <p className="text-xl sm:text-2xl font-black text-indigo-800 mt-1">{stats.confirmed}</p>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Completed</span>
                <p className="text-xl sm:text-2xl font-black text-teal-800 mt-1">{stats.completed}</p>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-white border-b border-emerald-100 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'enquiries'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> Customer Enquiries ({enquiries.length})
                </button>

                <button
                  onClick={() => setActiveTab('feedbacks')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'feedbacks'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  <Star className="w-4 h-4" /> Feedbacks & Media ({feedbacks.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('quotations');
                    if (onNavigate) onNavigate('/admin/quotations');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'quotations'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  <Receipt className="w-4 h-4" /> Quotations
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'feedbacks' && (
                  <button
                    onClick={() => setShowAddFeedbackModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Feedback
                  </button>
                )}
                <button
                  onClick={fetchData}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Contents (Scrollable) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-4">
              {/* ENQUIRIES TAB */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  {/* Filters Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="relative w-full md:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by name, phone, ref ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                      {['All', 'New', 'Contacted', 'Confirmed', 'Completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                            statusFilter === status
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enquiries Cards List */}
                  {filteredEnquiries.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
                      No enquiries matching your search criteria.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredEnquiries.map((enq) => (
                        <div
                          key={enq.id || enq.refId}
                          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                        >
                          {/* Left Details */}
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            {/* Reference Image Thumbnail if uploaded */}
                            {enq.image ? (
                              <button
                                onClick={() => setSelectedImageModal(enq.image)}
                                className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-200 bg-slate-100 shrink-0 relative group cursor-pointer"
                                title="Click to view full image"
                              >
                                <img
                                  src={enq.image}
                                  alt="Ref"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                  <Eye className="w-4 h-4" />
                                </div>
                              </button>
                            ) : (
                              <div className="w-16 h-16 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  #{enq.refId || enq.id}
                                </span>
                                <h4 className="font-bold text-sm text-slate-900">{enq.name}</h4>
                                <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  {enq.phone}
                                </span>
                              </div>

                              <p className="text-xs font-semibold text-emerald-800">
                                {enq.service}
                              </p>

                              {enq.message && (
                                <p className="text-xs text-slate-600 italic line-clamp-2">
                                  "{enq.message}"
                                </p>
                              )}

                              <div className="text-[10px] text-slate-400 font-mono pt-1">
                                Date: {enq.createdAt ? new Date(enq.createdAt).toLocaleString() : (enq.time || 'Recently')}
                              </div>
                            </div>
                          </div>

                          {/* Right Actions & Status Workflow */}
                          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                            {/* Status Selector */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-500 font-medium">Status:</span>
                              <select
                                value={enq.status || 'New'}
                                onChange={(e) => handleUpdateEnquiryStatus(enq.id || enq.refId, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                                  enq.status === 'New'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : enq.status === 'Contacted'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : enq.status === 'Confirmed'
                                    ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                    : 'bg-teal-50 text-teal-800 border-teal-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>

                            {/* WhatsApp Direct Reply */}
                            <a
                              href={`https://wa.me/${(enq.phone || '919790449627').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20Vijay%20Embroidery%20Studio%20regarding%20your%20order%20inquiry%20%23${encodeURIComponent(enq.refId || enq.id)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                            >
                              <Send className="w-3 h-3" /> WhatsApp
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id || enq.refId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FEEDBACKS TAB */}
              {activeTab === 'feedbacks' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Customer Feedbacks & Media Gallery</h4>
                      <p className="text-xs text-slate-500">Only feedbacks with status <strong className="text-emerald-700">"Published"</strong> appear on the public website.</p>
                    </div>

                    <button
                      onClick={() => setShowAddFeedbackModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Verified Review
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedbacks.map((fb) => (
                      <div
                        key={fb.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm flex flex-col justify-between gap-3 relative"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-sm text-slate-900">{fb.name}</h4>
                              <span className="text-xs text-emerald-800 font-medium">{fb.service}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                {'★'.repeat(fb.rating || 5)}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                fb.status === 'Published'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {fb.status}
                              </span>
                            </div>
                          </div>

                          {/* Media preview */}
                          {fb.image && (
                            <div className="mb-3 h-32 rounded-xl overflow-hidden border border-slate-200">
                              <img src={fb.image} alt="Work" className="w-full h-full object-cover" />
                            </div>
                          )}

                          {fb.video && (
                            <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 bg-black">
                              <video src={fb.video} controls className="w-full max-h-36" />
                            </div>
                          )}

                          <p className="text-xs text-slate-700 leading-relaxed italic">
                            "{fb.comment}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Recent'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleFeedbackStatus(fb.id, fb.status)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                                fb.status === 'Published'
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {fb.status === 'Published' ? 'Unpublish (Draft)' : 'Publish to Site'}
                            </button>

                            <button
                              onClick={() => handleDeleteFeedback(fb.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QUOTATIONS GENERATOR TAB */}
              {activeTab === 'quotations' && (
                <QuotationGenerator onNavigate={onNavigate} />
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* High-res Image Modal */}
      <AnimatePresence>
        {selectedImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImageModal(null)}
          >
            <div className="relative max-w-2xl w-full bg-white rounded-2xl p-2 overflow-hidden shadow-2xl">
              <button
                onClick={() => setSelectedImageModal(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={selectedImageModal}
                alt="Enquiry Full Preview"
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Verified Feedback Modal */}
      <AnimatePresence>
        {showAddFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-emerald-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> Add Verified Customer Review
                </h3>
                <button onClick={() => setShowAddFeedbackModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddFeedbackSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Divya M."
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                    <select
                      value={feedbackForm.rating}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Service / Garment</label>
                    <input
                      type="text"
                      placeholder="Bridal Blouse / Silk Saree"
                      value={feedbackForm.service}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={feedbackForm.status}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Published">Published (Live on Website)</option>
                      <option value="Draft">Draft (Admin Only)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Review Text</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter customer feedback details..."
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                {/* Media Attachment */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attach Customer/Work Photo or Video (Optional)</label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-3 text-center cursor-pointer relative bg-slate-50">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFeedbackFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      <span>Upload work image (JPG, PNG) or short video clip (MP4)</span>
                    </div>
                  </div>

                  {feedbackMediaPreview && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-700">Media attached ({feedbackMediaPreview.type})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackMediaPreview(null);
                          setFeedbackForm(prev => ({ ...prev, image: '', video: '' }));
                        }}
                        className="text-rose-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFeedbackModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Save Feedback
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
