import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Send, 
  Plus, 
  Trash2, 
  RefreshCw, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Receipt, 
  ShieldCheck, 
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  Lock,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

export default function QuotationGenerator({ onNavigate }) {
  // Check admin token
  const token = localStorage.getItem('vijay_admin_token') || '';
  const isAdmin = Boolean(token) || localStorage.getItem('vijay_admin_logged_in') === 'true';

  const getAuthHeaders = () => {
    const t = localStorage.getItem('vijay_admin_token');
    return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
  };

  // Helper to get formatted date string (YYYY-MM-DD)
  const getTodayStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  // Current view: 'list' | 'editor'
  const [activeSubView, setActiveSubView] = useState('list');
  const [quotationList, setQuotationList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quotation Editor State
  const [quotationNo, setQuotationNo] = useState(`VE-QT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [quotationDate, setQuotationDate] = useState(getTodayStr(0));
  const [validTillDate, setValidTillDate] = useState(getTodayStr(15));
  const [status, setStatus] = useState('DRAFT');
  const [hasSeal, setHasSeal] = useState(false);
  const [approvedAt, setApprovedAt] = useState(null);
  const [sentAt, setSentAt] = useState(null);
  const [authorizedSignatory, setAuthorizedSignatory] = useState('Vijai Kumar R.');
  const [designation, setDesignation] = useState('Studio Administrator');

  // Customer State
  const [customer, setCustomer] = useState({
    name: 'Priyadarshini R.',
    phone: '9840123456',
    address: 'No. 45, Gandhi Road, Salem, Tamil Nadu - 636001'
  });

  // Items State
  const [items, setItems] = useState([
    {
      id: 1,
      description: 'Bridal Blouse Heavy Maggam Embroidery (Peacock Back-Neck & Double Sleeves)',
      qty: 1,
      rate: 3500,
      gstRate: 5
    },
    {
      id: 2,
      description: 'Kanchipuram Silk Saree Scalloped Gold Zari Border (20x32 Frame Area)',
      qty: 1,
      rate: 2200,
      gstRate: 5
    }
  ]);

  const [notes, setNotes] = useState('50% advance required to commence digitizing. Balance upon completion before delivery.');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Check if current quotation is locked (APPROVED or SENT)
  const isLocked = status === 'APPROVED' || status === 'SENT';

  // Fetch all quotations from API & localStorage
  const fetchQuotations = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/quotations');
      if (res.data && res.data.success) {
        setQuotationList(res.data.quotations || []);
      }
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('vijay_quotations_store') || '[]');
      setQuotationList(stored);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Calculation metrics
  const subtotal = items.reduce((acc, item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    return acc + (qty * rate);
  }, 0);

  const totalGst = items.reduce((acc, item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gstRate = Number(item.gstRate) || 0;
    const itemTotal = qty * rate;
    return acc + (itemTotal * (gstRate / 100));
  }, 0);

  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const grandTotal = Math.round(subtotal + totalGst);

  // Handle adding a new item row
  const handleAddItem = () => {
    if (isLocked) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        description: '',
        qty: 1,
        rate: 1000,
        gstRate: 5
      }
    ]);
  };

  // Handle updating an item row
  const handleUpdateItem = (id, field, value) => {
    if (isLocked) return;
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Handle deleting an item row
  const handleDeleteItem = (id) => {
    if (isLocked) return;
    if (items.length === 1) {
      alert('At least one item is required in the quotation.');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // Reset form for a brand new quotation
  const handleCreateNewQuotation = () => {
    setQuotationNo(`VE-QT-${Math.floor(1000 + Math.random() * 9000)}`);
    setQuotationDate(getTodayStr(0));
    setValidTillDate(getTodayStr(15));
    setStatus('DRAFT');
    setHasSeal(false);
    setApprovedAt(null);
    setSentAt(null);
    setCustomer({ name: '', phone: '', address: '' });
    setItems([
      {
        id: Date.now(),
        description: '',
        qty: 1,
        rate: 0,
        gstRate: 5
      }
    ]);
    setActiveSubView('editor');
  };

  // Load an existing quotation into the editor
  const handleLoadQuotation = (q) => {
    setQuotationNo(q.quotationNo || q.id);
    setQuotationDate(q.quotationDate || getTodayStr(0));
    setValidTillDate(q.validTillDate || getTodayStr(15));
    setStatus(q.status || 'DRAFT');
    setHasSeal(Boolean(q.hasSeal));
    setApprovedAt(q.approvedAt || null);
    setSentAt(q.sentAt || null);
    setCustomer(q.customer || { name: '', phone: '', address: '' });
    setItems(q.items && q.items.length > 0 ? q.items : [
      { id: Date.now(), description: 'Embroidery Service', qty: 1, rate: 0, gstRate: 5 }
    ]);
    setNotes(q.notes || '');
    setAuthorizedSignatory(q.authorizedSignatory || 'Vijai Kumar R.');
    setDesignation(q.designation || 'Studio Administrator');
    setActiveSubView('editor');
  };

  // Save quotation payload to API & local storage
  const saveQuotationToStore = async (overrides = {}) => {
    const finalSeal = overrides.hasSeal !== undefined ? overrides.hasSeal : hasSeal;
    const finalStatus = overrides.status !== undefined ? overrides.status : status;
    const finalApprovedAt = overrides.approvedAt !== undefined ? overrides.approvedAt : approvedAt;
    const finalSentAt = overrides.sentAt !== undefined ? overrides.sentAt : sentAt;

    const payload = {
      quotationNo,
      quotationDate,
      validTillDate,
      customer,
      items,
      subtotal,
      cgst,
      sgst,
      grandTotal,
      notes,
      hasSeal: finalSeal,
      hasSignature: false,
      status: finalStatus,
      approvedAt: finalApprovedAt,
      sentAt: finalSentAt,
      authorizedSignatory,
      designation
    };

    try {
      await axios.post('/api/quotations', payload, getAuthHeaders());
    } catch (err) {
      console.warn('API sync fallback to local storage:', err.message);
    }

    const localList = JSON.parse(localStorage.getItem('vijay_quotations_store') || '[]');
    const existingIdx = localList.findIndex(q => q.quotationNo === quotationNo || q.id === quotationNo);
    if (existingIdx !== -1) {
      localList[existingIdx] = payload;
    } else {
      localList.unshift(payload);
    }
    localStorage.setItem('vijay_quotations_store', JSON.stringify(localList));
    fetchQuotations();

    setSaveSuccessMsg('Quotation saved successfully in DRAFT mode.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 2. SEAL: Toggle official company round seal (Admin Only)
  const handleToggleSeal = async () => {
    if (!isAdmin) {
      alert('Only authenticated Studio Administrators can apply the official round seal.');
      return;
    }

    const nextSeal = !hasSeal;
    setHasSeal(nextSeal);

    try {
      await axios.patch(`/api/quotations/${encodeURIComponent(quotationNo)}/seal`, { hasSeal: nextSeal }, getAuthHeaders());
    } catch (err) {
      // Offline fallback
    }

    await saveQuotationToStore({ hasSeal: nextSeal });
  };

  // 3. GENERATE: Generate Without Seal
  const handleGenerateWithoutSeal = async () => {
    const prevSeal = hasSeal;
    setHasSeal(false);
    await saveQuotationToStore({ hasSeal: false, status: status === 'APPROVED' || status === 'SENT' ? status : 'DRAFT' });
    window.print();
  };

  // 3. GENERATE: Generate With Seal (Admin only)
  const handleGenerateWithSeal = async () => {
    if (!isAdmin) {
      alert('Only authenticated Studio Administrators can generate quotations with the company seal.');
      return;
    }
    setHasSeal(true);
    await saveQuotationToStore({ hasSeal: true, status: status === 'APPROVED' || status === 'SENT' ? status : 'DRAFT' });
    window.print();
  };

  // 4. ADMIN APPROVAL: Approve & Publish (DRAFT -> APPROVED)
  const handleApproveAndPublish = async () => {
    if (!isAdmin) {
      alert('Only authenticated Studio Administrators can approve quotations.');
      return;
    }

    const now = new Date().toISOString();
    setStatus('APPROVED');
    setApprovedAt(now);

    try {
      await axios.patch(`/api/quotations/${encodeURIComponent(quotationNo)}/approve`, {}, getAuthHeaders());
    } catch (err) {
      // Local fallback
    }

    await saveQuotationToStore({ status: 'APPROVED', approvedAt: now });
    alert(`Quotation #${quotationNo} has been APPROVED & PUBLISHED. It is now locked and ready to send to the customer.`);
  };

  // Helper to format date for WhatsApp message (e.g. 19 Sep 2026)
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  };

  // Helper to build public quotation URL without sending localhost or relative URLs
  const getPublicQuotationUrl = (qNo) => {
    const envBase = (
      import.meta.env.PUBLIC_BASE_URL ||
      import.meta.env.VITE_PUBLIC_BASE_URL ||
      import.meta.env.VITE_BASE_URL ||
      ''
    ).trim().replace(/\/+$/, '');

    if (envBase && !envBase.includes('localhost') && !envBase.includes('127.0.0.1')) {
      return `${envBase}/quotation/${encodeURIComponent(qNo)}`;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isLocal = !origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0');

    if (!isLocal && origin) {
      return `${origin.replace(/\/+$/, '')}/quotation/${encodeURIComponent(qNo)}`;
    }

    return `https://16w1ht27-3001.inc1.devtunnels.ms/quotation/${encodeURIComponent(qNo)}`;
  };

  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  // 5. SEND TO CUSTOMER: Open WhatsApp directly with prefilled plain-text quotation message & link
  const handleSendToCustomer = async (targetQNo) => {
    const qNumber = targetQNo || quotationNo;
    if (!qNumber) return;

    setIsSendingWhatsApp(true);
    setSaveSuccessMsg('');

    try {
      // Find quotation data to extract customer phone & total amount
      const targetQ = (quotationList || []).find(q => (q.quotationNo || q.id) === qNumber) || {};
      const targetPhoneRaw = targetQ.customer?.phone || (qNumber === quotationNo ? customer.phone : '');
      const targetAmount = targetQ.grandTotal !== undefined ? targetQ.grandTotal : grandTotal;

      const rawPhone = String(targetPhoneRaw || '').replace(/[^0-9]/g, '');
      let targetPhone = rawPhone;
      if (targetPhone.length === 10) {
        targetPhone = '91' + targetPhone;
      }

      if (!targetPhone || targetPhone.length < 10) {
        alert(`Please ensure a valid 10-digit customer phone number is specified for Quotation #${qNumber}.`);
        setIsSendingWhatsApp(false);
        return;
      }

      const quotationURL = getPublicQuotationUrl(qNumber);
      const formattedAmount = Number(targetAmount || 0).toLocaleString('en-IN');

      const messageText = 
`VIJAI EMBROIDERY GROUPS

Your quotation is ready.

Quotation No: ${qNumber}
Amount: Rs. ${formattedAmount}

View your quotation:
${quotationURL}

Thank you.`;

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;

      // Open WhatsApp with prefilled message
      window.open(whatsappUrl, '_blank');

      // Update quotation status to SENT on backend
      try {
        await axios.patch(`/api/quotations/${encodeURIComponent(qNumber)}/send`, {}, getAuthHeaders());
      } catch (patchErr) {
        console.warn('Backend mark sent notice:', patchErr.message);
      }

      const now = new Date().toISOString();
      if (qNumber === quotationNo) {
        setStatus('SENT');
        setSentAt(now);
      }

      // Update local storage store
      const localList = JSON.parse(localStorage.getItem('vijay_quotations_store') || '[]');
      const localIdx = localList.findIndex(q => (q.quotationNo || q.id) === qNumber);
      if (localIdx !== -1) {
        localList[localIdx].status = 'SENT';
        localList[localIdx].sentAt = now;
        localStorage.setItem('vijay_quotations_store', JSON.stringify(localList));
      }

      setSaveSuccessMsg(`WhatsApp opened for Quotation #${qNumber} and status updated to SENT.`);
      fetchQuotations();
    } catch (err) {
      console.error('Send to customer error:', err);
      alert(err.message || 'Failed to open WhatsApp');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Delete Quotation (Admin only)
  const handleDeleteQuotation = async (qNo) => {
    if (!isAdmin) {
      alert('Only administrators can delete quotations.');
      return;
    }
    if (!window.confirm(`Delete Quotation #${qNo}?`)) return;

    try {
      await axios.delete(`/api/quotations/${encodeURIComponent(qNo)}`, getAuthHeaders());
    } catch (err) {
      // Local fallback
    }

    const updated = quotationList.filter(q => q.quotationNo !== qNo && q.id !== qNo);
    setQuotationList(updated);
    localStorage.setItem('vijay_quotations_store', JSON.stringify(updated));

    if (activeSubView === 'editor' && quotationNo === qNo) {
      setActiveSubView('list');
    }
  };

  // Filtered quotation list
  const filteredQuotations = quotationList.filter(q => {
    const qStatus = (q.status || 'DRAFT').toUpperCase();
    const matchesStatus = statusFilter === 'All' || qStatus === statusFilter;
    const term = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (q.quotationNo && q.quotationNo.toLowerCase().includes(term)) ||
      (q.customer?.name && q.customer.name.toLowerCase().includes(term)) ||
      (q.customer?.phone && q.customer.phone.includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 6. QUOTATION LIST VIEW                                    */}
      {/* ======================================================== */}
      {activeSubView === 'list' ? (
        <div className="space-y-4">
          {/* Header & Controls Bar */}
          <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-brand-title flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                Quotation Management & Approval Workflow
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Status Flow: <span className="font-semibold text-amber-700">DRAFT</span> → <span className="font-semibold text-indigo-700">APPROVED</span> → <span className="font-semibold text-emerald-700">SENT</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={fetchQuotations}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Refresh quotations"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCreateNewQuotation}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Create Quotation
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quote #, customer, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Status Filter Tabs: All, DRAFT, APPROVED, SENT */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'DRAFT', 'APPROVED', 'SENT'].map((tab) => {
                const count = tab === 'All' 
                  ? quotationList.length 
                  : quotationList.filter(q => (q.status || 'DRAFT').toUpperCase() === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      statusFilter === tab
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quotations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white border-b border-slate-800">
                    <th className="py-3 px-4 font-mono font-bold">Quotation No</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-mono font-semibold text-right">Total</th>
                    <th className="py-3 px-4 font-semibold text-center">Seal</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {listLoading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                        Loading quotations...
                      </td>
                    </tr>
                  ) : filteredQuotations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No quotations found in this category. Click <strong>+ Create Quotation</strong> to start.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotations.map((q) => {
                      const qStatus = (q.status || 'DRAFT').toUpperCase();
                      return (
                        <tr key={q.quotationNo || q.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-950">
                            #{q.quotationNo}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{q.customer?.name || 'Valued Customer'}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{q.customer?.phone || '—'}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono">
                            {q.quotationDate || '—'}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                            ₹{Number(q.grandTotal || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {q.hasSeal ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                <ShieldCheck className="w-3 h-3 text-indigo-600" /> Sealed
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">No Seal</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              qStatus === 'SENT'
                                ? 'bg-teal-50 text-teal-800 border-teal-300'
                                : qStatus === 'APPROVED'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                              {qStatus === 'SENT' ? '✓ SENT' : qStatus === 'APPROVED' ? '✓ APPROVED' : 'DRAFT'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open in Editor / Preview */}
                              <button
                                onClick={() => handleLoadQuotation(q)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                title="Open Preview & Manage"
                              >
                                <Eye className="w-3 h-3" /> Preview
                              </button>

                              {/* WhatsApp Send Action if APPROVED or SENT */}
                              {(qStatus === 'APPROVED' || qStatus === 'SENT') && (
                                <button
                                  disabled={isSendingWhatsApp}
                                  onClick={() => handleSendToCustomer(q.quotationNo || q.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors disabled:opacity-60"
                                  title="Send quotation PDF to Customer WhatsApp"
                                >
                                  <Send className="w-3 h-3" /> Send
                                </button>
                              )}

                              {/* Delete if Admin */}
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteQuotation(q.quotationNo || q.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                  title="Delete Quotation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* QUOTATION EDITOR & A4 PREVIEW VIEW                       */
        /* ======================================================== */
        <div className="space-y-6">
          {/* Top Workflow Action Bar */}
          <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchQuotations();
                  setActiveSubView('list');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quotation List
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 font-brand-title">
                    Quotation #{quotationNo}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    status === 'SENT'
                      ? 'bg-teal-50 text-teal-800 border-teal-300'
                      : status === 'APPROVED'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    Status: {status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-light">
                  {isLocked ? 'Quotation is APPROVED & Locked from accidental editing.' : 'Quotation is currently in DRAFT status.'}
                </p>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 2. SEAL BUTTON (Admin Only) */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleToggleSeal}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 ${
                    hasSeal 
                      ? 'bg-indigo-700 text-white ring-2 ring-indigo-300' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300'
                  }`}
                  title="Click to apply or remove company round seal"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${hasSeal ? 'text-amber-300' : 'text-indigo-600'}`} />
                  {hasSeal ? '✓ Seal Applied' : 'Apply Seal'}
                </button>
              )}

              {/* 3. GENERATE BUTTONS: Without Seal & With Seal */}
              <button
                type="button"
                onClick={handleGenerateWithoutSeal}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Generate quotation preview/PDF without seal (Status: DRAFT)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Generate Without Seal</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleGenerateWithSeal}
                  className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Generate quotation preview/PDF with company round seal (Status: DRAFT)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Generate With Seal</span>
                </button>
              )}

              {/* 4. ADMIN APPROVAL: [ Approve & Publish ] (if DRAFT) */}
              {status === 'DRAFT' && isAdmin && (
                <button
                  type="button"
                  onClick={handleApproveAndPublish}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                  title="Approve and publish quotation, transitioning DRAFT -> APPROVED"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Approve & Publish</span>
                </button>
              )}

              {/* 5. SEND TO CUSTOMER: [ Send to Customer ] (after approval) */}
              {(status === 'APPROVED' || status === 'SENT') && (
                <button
                  type="button"
                  disabled={isSendingWhatsApp}
                  onClick={() => handleSendToCustomer(quotationNo)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 disabled:opacity-60"
                  title="Send quotation PDF document directly to customer's WhatsApp"
                >
                  {isSendingWhatsApp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending PDF...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 fill-white" />
                      <span>Send to Customer</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Locked Notice Banner */}
          {isLocked && (
            <div className="print:hidden p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Quotation Locked:</strong> This quotation is <strong>{status}</strong>. Line items and customer fields are locked from accidental editing.
              </span>
            </div>
          )}

          {saveSuccessMsg && (
            <div className="print:hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Split Grid: Left Editor & Right Live A4 Sheet Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: EDITABLE INPUT CONTROLS (Hidden on Print)   */}
            {/* ======================================================== */}
            <div className="print:hidden xl:col-span-5 space-y-4">
              
              {/* 1. Quotation Meta Details Card */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Quotation Meta
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Quote No.</label>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={quotationNo}
                      onChange={(e) => setQuotationNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-mono font-bold text-slate-800 disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Quote Date</label>
                    <input
                      type="date"
                      disabled={isLocked}
                      value={quotationDate}
                      onChange={(e) => setQuotationDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800 disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Valid Till</label>
                    <input
                      type="date"
                      disabled={isLocked}
                      value={validTillDate}
                      onChange={(e) => setValidTillDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800 disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Customer Details Card */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Customer Details
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Customer Full Name</label>
                      <input
                        type="text"
                        disabled={isLocked}
                        placeholder="e.g. Priyadarshini R."
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800 disabled:opacity-75"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">WhatsApp Phone Number</label>
                      <input
                        type="tel"
                        disabled={isLocked}
                        placeholder="9840123456"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800 disabled:opacity-75"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Customer Delivery Address & City</label>
                    <input
                      type="text"
                      disabled={isLocked}
                      placeholder="Address in Tamil Nadu..."
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800 disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Items & Services Form */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" /> Embroidery Line Items
                  </h4>
                  {!isLocked && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-emerald-100 text-xs space-y-2 relative">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-emerald-800 text-[11px] font-mono">Item #{index + 1}</span>
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          disabled={isLocked}
                          placeholder="Service Description (e.g. Bridal Blouse Maggam Embroidery)"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white text-slate-800 font-medium disabled:opacity-75"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500">Qty</label>
                          <input
                            type="number"
                            min="1"
                            disabled={isLocked}
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-center disabled:opacity-75"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500">Rate (₹)</label>
                          <input
                            type="number"
                            min="0"
                            disabled={isLocked}
                            value={item.rate}
                            onChange={(e) => handleUpdateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-right disabled:opacity-75"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500">GST %</label>
                          <select
                            disabled={isLocked}
                            value={item.gstRate}
                            onChange={(e) => handleUpdateItem(item.id, 'gstRate', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-75"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Admin Official Authorization & Round Seal Card */}
              {isAdmin && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 rounded-2xl border-2 border-indigo-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-700" />
                      Admin Official Seal Control
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hasSeal 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {hasSeal ? '✓ Company Seal Applied' : 'No Seal'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-tight">
                    Apply the authentic Vijay Embroidery round company seal near "Authorised Signatory". Status remains DRAFT until approved.
                  </p>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-indigo-200 shadow-xs">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Official Round Studio Seal</p>
                      <p className="text-[10px] text-slate-500">Vijay Embroidery Groups • Salem TN</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleSeal}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        hasSeal
                          ? 'bg-indigo-700 text-white ring-1 ring-indigo-400'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${hasSeal ? 'text-amber-300' : 'text-indigo-600'}`} />
                      {hasSeal ? 'Seal Active ✓' : 'Apply Seal'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: CLEAN A4 QUOTATION PREVIEW & PRINT SHEET   */}
            {/* ======================================================== */}
            <div className="xl:col-span-7 flex justify-center">
              
              {/* A4 Sheet Container */}
              <div 
                id="quotation-print-area"
                className="w-full max-w-[800px] bg-white border border-slate-300 rounded-2xl shadow-xl p-8 sm:p-10 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none"
                style={{ minHeight: '842px' }}
              >
                {/* Light Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-25deg] z-0">
                  <span className="text-7xl font-black font-brand-title text-slate-900 tracking-widest uppercase">
                    VIJAI EMBROIDERY
                  </span>
                </div>

                {/* Document Inner Wrapper */}
                <div className="relative z-10 space-y-5 text-slate-900">
                  
                  {/* TOP HEADER: Left Quotation Details & Right Logo */}
                  <div className="flex flex-row items-start justify-between gap-4 pb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-brand-title">
                          Quotation
                        </h1>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          status === 'SENT'
                            ? 'bg-teal-50 text-teal-800 border-teal-300'
                            : status === 'APPROVED'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <div className="pt-1 space-y-0.5 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-500">Quotation No:</span>
                          <span className="font-mono font-bold text-slate-900">#{quotationNo}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-500">Date:</span>
                          <span className="font-medium text-slate-800">{quotationDate}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-500">Valid Till Date:</span>
                          <span className="font-medium text-slate-800">{validTillDate}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <img 
                        src="/logo.png" 
                        alt="Vijai Embroidery Groups" 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl border border-purple-200/60 shadow-sm bg-white p-1"
                      />
                    </div>
                  </div>

                  {/* TWO EQUAL LAVENDER ROUNDED CARDS: Quotation From & Quotation For */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Lavender Card 1: Quotation From */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFFE] border border-[#DDD4F8] text-xs space-y-2 shadow-sm">
                      <h3 className="font-bold text-[#4C1D95] text-xs uppercase tracking-wider border-b border-[#DDD4F8]/80 pb-1.5">
                        Quotation From
                      </h3>
                      <div className="space-y-1 text-slate-800 pt-0.5">
                        <p className="font-bold text-slate-950 text-sm font-brand-title">Vijay Embroidery Studio</p>
                        <p className="text-slate-700 leading-snug">
                          131, Nagaramalai Main Road, Salem, Tamil Nadu, India - 636016
                        </p>
                        <div className="pt-1 text-[11px] font-mono space-y-0.5 text-slate-700">
                          <p><strong className="text-purple-950 font-semibold">GSTIN:</strong> 33CXUPN4686G1ZS</p>
                          <p><strong className="text-purple-950 font-semibold">PAN:</strong> CXUPN4686G</p>
                          <p><strong className="text-purple-950 font-semibold">Phone:</strong> +91 97904 49627</p>
                        </div>
                      </div>
                    </div>

                    {/* Lavender Card 2: Quotation For */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFFE] border border-[#DDD4F8] text-xs space-y-2 shadow-sm">
                      <h3 className="font-bold text-[#4C1D95] text-xs uppercase tracking-wider border-b border-[#DDD4F8]/80 pb-1.5">
                        Quotation For
                      </h3>
                      <div className="space-y-1.5 text-slate-800 pt-0.5">
                        <p className="font-bold text-slate-950 text-sm">
                          {customer.name || 'Valued Customer'}
                        </p>
                        <p className="text-slate-700">
                          <span className="font-semibold text-purple-950">Phone:</span> {customer.phone || '—'}
                        </p>
                        {customer.address ? (
                          <p className="text-slate-700 leading-snug">
                            <span className="font-semibold text-purple-950">Address:</span> {customer.address}
                          </p>
                        ) : (
                          <p className="text-slate-500 italic">Address: Tamil Nadu, India</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM OF HEADER: Country of Supply + Place of Supply */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">Country of Supply:</span>
                      <span className="font-bold text-slate-900">India</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">Place of Supply:</span>
                      <span className="font-bold text-slate-900">Tamil Nadu (33)</span>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-950 text-white border-b border-emerald-900">
                          <th className="py-2.5 px-3 font-mono font-bold w-10 text-center">#</th>
                          <th className="py-2.5 px-3 font-semibold">Service Description</th>
                          <th className="py-2.5 px-3 font-mono font-semibold text-center w-16">Qty</th>
                          <th className="py-2.5 px-3 font-mono font-semibold text-right w-24">Rate (₹)</th>
                          <th className="py-2.5 px-3 font-mono font-semibold text-center w-16">GST</th>
                          <th className="py-2.5 px-3 font-mono font-semibold text-right w-28">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                        {items.map((it, idx) => {
                          const itemTotal = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                          return (
                            <tr key={it.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                              <td className="py-2.5 px-3 font-medium text-slate-900">{it.description || 'Custom Embroidery Work'}</td>
                              <td className="py-2.5 px-3 text-center font-mono">{it.qty}</td>
                              <td className="py-2.5 px-3 text-right font-mono">₹{Number(it.rate).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">{it.gstRate}%</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹{itemTotal.toLocaleString('en-IN')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations Summary Section */}
                  <div className="flex justify-end">
                    <div className="w-full sm:w-72 space-y-2 text-xs border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>

                      {totalGst > 0 && (
                        <>
                          <div className="flex justify-between text-slate-600 text-[11px]">
                            <span>CGST (2.5%):</span>
                            <span className="font-mono">₹{Math.round(cgst).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 text-[11px]">
                            <span>SGST (2.5%):</span>
                            <span className="font-mono">₹{Math.round(sgst).toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      )}

                      <div className="pt-2 border-t-2 border-emerald-800 flex justify-between text-sm font-bold text-emerald-950">
                        <span>Grand Total:</span>
                        <span className="font-mono text-base font-black text-emerald-800">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions and Signature Section */}
                  <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end text-[10px]">
                    <div className="space-y-1 text-slate-500">
                      <p className="font-bold text-slate-700 uppercase tracking-wider font-mono">Terms & Conditions:</p>
                      <p>1. Quotation valid for 15 days from issue date.</p>
                      <p>2. 50% advance payment required to commence computerized design digitizing.</p>
                      <p>3. Balance payable upon completion prior to doorstep dispatch.</p>
                      <p>4. Doorstep delivery available across all Tamil Nadu districts.</p>
                    </div>

                    {/* Authorised Signatory & Round Seal Area */}
                    <div className="flex flex-col items-center sm:items-end justify-end space-y-1 select-none min-h-[90px]">
                      {hasSeal ? (
                        <div className="relative flex items-center justify-center sm:justify-end">
                          {/* Round Company Seal */}
                          <div className="relative w-20 h-20 mb-1 rotate-[-5deg] opacity-90 transition-transform hover:rotate-0">
                            <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-800 drop-shadow-xs">
                              {/* Outer Rings */}
                              <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.95" />
                              <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
                              <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />

                              {/* Curved Circular Text Top */}
                              <path id="sealTopGen" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
                              <text className="text-[10px] font-black uppercase tracking-[0.14em]" fill="currentColor">
                                <textPath href="#sealTopGen" startOffset="50%" textAnchor="middle">
                                  ★ VIJAY EMBROIDERY GROUPS ★
                                </textPath>
                              </text>

                              {/* Curved Circular Text Bottom */}
                              <path id="sealBottomGen" d="M 178 100 A 78 78 0 0 1 22 100" fill="none" />
                              <text className="text-[9.5px] font-bold uppercase tracking-[0.16em]" fill="currentColor">
                                <textPath href="#sealBottomGen" startOffset="50%" textAnchor="middle">
                                  • SALEM • TAMIL NADU •
                                </textPath>
                              </text>

                              {/* Center Star & Confirmation Badge */}
                              <g transform="translate(100, 100)" textAnchor="middle">
                                <path d="M 0 -34 L 2.5 -28 L 8.5 -28 L 3.5 -24 L 5.5 -18 L 0 -21 L -5.5 -18 L -3.5 -24 L -8.5 -28 L -2.5 -28 Z" fill="currentColor" opacity="0.9" />
                                <text y="-6" className="text-[11.5px] font-black tracking-wider uppercase font-mono" fill="currentColor">
                                  OFFICIAL
                                </text>
                                <text y="7" className="text-[8px] font-bold tracking-widest uppercase font-mono" fill="currentColor" opacity="0.9">
                                  STUDIO SEAL
                                </text>
                                <text y="19" className="text-[7.5px] font-semibold tracking-wider font-mono" fill="currentColor" opacity="0.8">
                                  SALEM - TN
                                </text>
                              </g>
                            </svg>

                            <div className="absolute inset-0 rounded-full pointer-events-none mix-blend-multiply opacity-20 bg-radial from-transparent to-indigo-900" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 flex items-center justify-center">
                          {isAdmin && (
                            <div className="print:hidden">
                              <button
                                type="button"
                                onClick={handleToggleSeal}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <ShieldCheck className="w-3 h-3 text-indigo-600" /> Apply Seal
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Authorised Signatory */}
                      <div className="border-t border-slate-300 pt-1 text-center sm:text-right w-44">
                        <p className="font-bold text-slate-900 font-mono text-[10px]">Authorised Signatory</p>
                        <p className="text-[9px] text-slate-500">Vijay Embroidery Studio • Salem</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
