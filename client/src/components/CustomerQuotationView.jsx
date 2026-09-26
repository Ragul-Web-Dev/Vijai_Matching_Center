import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download,
  Send, 
  Search, 
  FileText, 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  Phone, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import axios from 'axios';

export default function CustomerQuotationView({ quotationId, onClose }) {
  const [searchId, setSearchId] = useState(quotationId || '');
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuotation = async (idToFetch) => {
    if (!idToFetch || !idToFetch.trim()) {
      setError('Please enter a valid Quotation ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanId = idToFetch.trim().toUpperCase();
      const res = await axios.get(`/api/quotations/${encodeURIComponent(cleanId)}`);
      if (res.data && res.data.success && res.data.quotation) {
        const q = res.data.quotation;
        const qStatus = (q.status || 'DRAFT').toUpperCase();
        if (qStatus === 'DRAFT') {
          setError(`Quotation #${cleanId} is currently in DRAFT status and has not been approved yet.`);
          setQuotation(null);
        } else {
          setQuotation(q);
        }
      } else {
        setError(res.data?.message || 'Quotation not found.');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError(err.response.data?.message || `Quotation #${idToFetch} is in DRAFT status and is not yet available for customer viewing.`);
      } else {
        // Check localStorage fallback for approved quotation
        const localStore = JSON.parse(localStorage.getItem('vijay_quotations_store') || '[]');
        const found = localStore.find(q => 
          q.id?.toUpperCase() === idToFetch.trim().toUpperCase() || 
          q.quotationNo?.toUpperCase() === idToFetch.trim().toUpperCase()
        );
        if (found) {
          const foundStatus = (found.status || 'DRAFT').toUpperCase();
          if (foundStatus === 'APPROVED' || foundStatus === 'SENT') {
            setQuotation(found);
          } else {
            setError(`Quotation #${idToFetch} is currently in DRAFT status and has not been approved yet.`);
          }
        } else {
          setError(`Quotation #${idToFetch} not found. Please verify your Quotation Reference Number.`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quotationId) {
      fetchQuotation(quotationId);
    } else {
      setLoading(false);
    }
  }, [quotationId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId) {
      fetchQuotation(searchId);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!quotation) return;
    const qNo = quotation.quotationNo || quotation.id;
    const link = document.createElement('a');
    link.href = `/api/quotations/${encodeURIComponent(qNo)}/pdf`;
    link.download = `quotation-${qNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppContact = () => {
    if (!quotation) return;
    const businessPhone = '919944571226';
    let msg = 'VIJAI EMBROIDERY GROUPS - QUOTATION ENQUIRY\n\n';
    msg += 'Customer: ' + (quotation.customer?.name || 'Customer') + '\n';
    msg += 'Quotation Number: #' + quotation.quotationNo + '\n';
    msg += 'Total Amount: Rs. ' + Number(quotation.grandTotal || 0).toLocaleString('en-IN') + '\n\n';
    msg += 'Hello, I am contacting you regarding my quotation. Please guide me with next steps.';

    const encodedMsg = encodeURIComponent(msg);
    const url = `https://wa.me/${businessPhone}?text=${encodedMsg}`;
    window.open(url, '_blank');
  };

  const status = (quotation?.status || 'DRAFT').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-900/90 backdrop-blur-md py-6 px-3 sm:px-6 fixed inset-0 z-50 overflow-y-auto flex flex-col items-center">
      
      {/* Top Navbar Toolbar (Hidden on Print) */}
      <div className="print:hidden w-full max-w-4xl bg-white rounded-2xl p-4 mb-6 shadow-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-brand-title flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              Customer Quotation Portal
            </h2>
            <p className="text-[11px] text-slate-500 font-light">
              Official Vijai Embroidery Groups Price Estimate & Invoice Sheet
            </p>
          </div>
        </div>

        {/* Search by ID Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. VE-QT-8421"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 bg-slate-50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm"
          >
            Find
          </button>
        </form>

        {/* Action Buttons */}
        {quotation && (
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
              status === 'APPROVED' || status === 'SENT'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {status === 'SENT' ? '✓ SENT' : status === 'APPROVED' ? '✓ APPROVED' : 'DRAFT'}
            </span>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
              title="Download official PDF copy"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-slate-900 hover:from-emerald-700 hover:to-slate-800 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" /> Print
            </button>

            <button
              onClick={handleWhatsAppContact}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5 fill-white" /> WhatsApp Studio
            </button>
          </div>
        )}
      </div>

      {/* Main Document / Loading / Error Container */}
      {loading ? (
        <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center shadow-2xl border border-emerald-200 my-auto">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-brand-title">Retrieving Quotation...</h3>
          <p className="text-xs text-slate-500 font-light mt-1 font-mono">Fetching record for #{searchId}</p>
        </div>
      ) : error ? (
        <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center shadow-2xl border border-rose-200 my-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-brand-title">Quotation Not Found</h3>
          <p className="text-xs text-slate-600 font-light">{error}</p>
          <div className="pt-2">
            <p className="text-[11px] text-slate-400 mb-3 font-mono">Need assistance? Contact our studio on WhatsApp:</p>
            <a
              href="https://wa.me/919944571226?text=Hi%20Vijay%20Embroidery%2C%20I%20need%20help%20with%20my%20Quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700"
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp Support (+91 99445 71226)
            </a>
          </div>
        </div>
      ) : quotation ? (
        /* ======================================================== */
        /* CLEAN A4 QUOTATION SHEET (Customer Printable)           */
        /* ======================================================== */
        <div 
          id="quotation-print-area"
          className="w-full max-w-[800px] bg-white border border-slate-300 rounded-2xl shadow-2xl p-8 sm:p-10 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none mb-12"
          style={{ minHeight: '842px' }}
        >
          {/* Light Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-25deg] z-0">
            <span className="text-7xl font-black font-brand-title text-slate-900 tracking-widest uppercase">
              VIJAI EMBROIDERY
            </span>
          </div>

          {/* Document Content */}
          <div className="relative z-10 space-y-5 text-slate-900">
            
            {/* TOP HEADER: Left Quotation Details & Right Logo */}
            <div className="flex flex-row items-start justify-between gap-4 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-brand-title">
                    Quotation
                  </h1>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    status === 'APPROVED' || status === 'SENT'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="pt-1 space-y-0.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">Quotation No:</span>
                    <span className="font-mono font-bold text-slate-900">#{quotation.quotationNo}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">Date:</span>
                    <span className="font-medium text-slate-800">{quotation.quotationDate}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">Valid Till Date:</span>
                    <span className="font-medium text-slate-800">{quotation.validTillDate}</span>
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
                    {quotation.customer?.name || 'Valued Customer'}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-purple-950">Phone:</span> {quotation.customer?.phone || '—'}
                  </p>
                  {quotation.customer?.address ? (
                    <p className="text-slate-700 leading-snug">
                      <span className="font-semibold text-purple-950">Address:</span> {quotation.customer?.address}
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
                  {(quotation.items || []).map((it, idx) => {
                    const itemTotal = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
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
                  <span className="font-mono font-semibold text-slate-900">₹{Number(quotation.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>

                {(quotation.cgst > 0 || quotation.sgst > 0) && (
                  <>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>CGST:</span>
                      <span className="font-mono">₹{Math.round(quotation.cgst || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>SGST:</span>
                      <span className="font-mono">₹{Math.round(quotation.sgst || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                <div className="pt-2 border-t-2 border-emerald-800 flex justify-between text-sm font-bold text-emerald-950">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base font-black text-emerald-800">
                    ₹{Number(quotation.grandTotal || 0).toLocaleString('en-IN')}
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
                {quotation.hasSeal ? (
                  <div className="relative flex items-center justify-center sm:justify-end">
                    {/* Round Company Seal */}
                    <div className="relative w-20 h-20 mb-1 rotate-[-5deg] opacity-90 transition-transform hover:rotate-0">
                      <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-800 drop-shadow-xs">
                        {/* Outer Rings */}
                        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.95" />
                        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
                        <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />

                        {/* Curved Circular Text Top */}
                        <path id="sealTopCust" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
                        <text className="text-[10px] font-black uppercase tracking-[0.14em]" fill="currentColor">
                          <textPath href="#sealTopCust" startOffset="50%" textAnchor="middle">
                            ★ VIJAY EMBROIDERY GROUPS ★
                          </textPath>
                        </text>

                        {/* Curved Circular Text Bottom */}
                        <path id="sealBottomCust" d="M 178 100 A 78 78 0 0 1 22 100" fill="none" />
                        <text className="text-[9.5px] font-bold uppercase tracking-[0.16em]" fill="currentColor">
                          <textPath href="#sealBottomCust" startOffset="50%" textAnchor="middle">
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
                  <div className="h-12" />
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
      ) : null}
    </div>
  );
}
