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
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

export default function QuotationGenerator({ onNavigate }) {
  // Helper to get formatted date string (YYYY-MM-DD)
  const getTodayStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  // State for quotation details
  const [quotationNo, setQuotationNo] = useState(`VE-QT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [quotationDate, setQuotationDate] = useState(getTodayStr(0));
  const [validTillDate, setValidTillDate] = useState(getTodayStr(15));
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState(null);

  // State for customer details
  const [customer, setCustomer] = useState({
    name: 'Priyadarshini R.',
    phone: '9840123456',
    address: 'No. 45, Gandhi Road, Salem, Tamil Nadu - 636001'
  });

  // State for itemized services
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

  // Handle adding a new item row
  const handleAddItem = () => {
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
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Handle deleting an item row
  const handleDeleteItem = (id) => {
    if (items.length === 1) {
      alert('At least one item is required in the quotation.');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // Reset form to default / new quotation
  const handleNewQuotation = () => {
    setQuotationNo(`VE-QT-${Math.floor(1000 + Math.random() * 9000)}`);
    setQuotationDate(getTodayStr(0));
    setValidTillDate(getTodayStr(15));
    setIsConfirmed(false);
    setConfirmedAt(null);
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
  };

  // Toggle Confirm Quotation & Apply Digital Seal
  const handleConfirmQuotation = async () => {
    const nextStatus = !isConfirmed;
    const nowTime = nextStatus ? new Date().toISOString() : null;
    setIsConfirmed(nextStatus);
    setConfirmedAt(nowTime);

    // Save with updated status
    await saveQuotationToStore(nextStatus, nowTime);
  };

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

  // Save quotation to backend API & localStorage
  const saveQuotationToStore = async (confirmedOverride, confirmedAtOverride) => {
    const finalConfirmed = confirmedOverride !== undefined ? confirmedOverride : isConfirmed;
    const finalConfirmedAt = confirmedAtOverride !== undefined ? confirmedAtOverride : confirmedAt;

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
      isConfirmed: finalConfirmed,
      status: finalConfirmed ? 'confirmed' : 'pending',
      confirmedAt: finalConfirmedAt,
      verifiedBy: finalConfirmed ? 'Vijai Embroidery Admin' : null
    };

    try {
      await axios.post('/api/quotations', payload, { timeout: 3000 });
    } catch (err) {
      console.warn('Backend quotation sync notice, fallback to local storage:', err.message);
    }

    const localList = JSON.parse(localStorage.getItem('vijay_quotations_store') || '[]');
    const existingIdx = localList.findIndex(q => q.quotationNo === quotationNo || q.id === quotationNo);
    if (existingIdx !== -1) {
      localList[existingIdx] = payload;
    } else {
      localList.unshift(payload);
    }
    localStorage.setItem('vijay_quotations_store', JSON.stringify(localList));
  };

  // Print / Save as PDF handler
  const handlePrint = async () => {
    await saveQuotationToStore();
    window.print();
  };

  // WhatsApp Share handler
  const handleSendWhatsApp = async () => {
    await saveQuotationToStore();

    const cleanPhone = (customer.phone || '').replace(/[^0-9]/g, '');
    let targetPhone = cleanPhone;
    if (targetPhone.length === 10) {
      targetPhone = '91' + targetPhone;
    }
    if (!targetPhone) {
      targetPhone = '919944571226';
    }

    const publicDownloadUrl = `${window.location.origin}/quotation/${encodeURIComponent(quotationNo)}`;

    let msg = `🧵 *VIJAI EMBROIDERY GROUPS - OFFICIAL QUOTATION*\n\n`;
    msg += `👤 *Customer Name:* ${customer.name || 'Valued Customer'}\n`;
    msg += `📌 *Quotation Number:* #${quotationNo}\n`;
    msg += `📅 *Date:* ${quotationDate} (Valid till: ${validTillDate})\n`;
    msg += `🛡️ *Status:* ${isConfirmed ? '✅ CONFIRMED & DIGITALLY SEALED BY ADMIN' : '⏳ ESTIMATE'}\n\n`;
    msg += `📋 *Items & Services:*\n`;
    
    items.forEach((it, idx) => {
      const itemAmount = (Number(it.qty) || 0) * (Number(it.rate) || 0);
      msg += `${idx + 1}. ${it.description || 'Embroidery Service'} (Qty: ${it.qty} × ₹${it.rate}) = ₹${itemAmount}\n`;
    });

    msg += `\n💵 *Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n`;
    if (totalGst > 0) {
      msg += `📊 *GST (CGST ${cgst > 0 ? '2.5%' : '0%'} + SGST ${sgst > 0 ? '2.5%' : '0%'}):* ₹${Math.round(totalGst).toLocaleString('en-IN')}\n`;
    }
    msg += `💰 *Grand Total:* ₹${grandTotal.toLocaleString('en-IN')}\n\n`;
    msg += `📄 *VIEW & DOWNLOAD YOUR OFFICIAL PDF QUOTATION:*\n${publicDownloadUrl}\n_(Click the link above to view/download your official quotation PDF)_\n\n`;
    msg += `📍 *Studio Address:* Opp. Flower Market, Main Road, Salem, Tamil Nadu\n`;
    msg += `📞 *Studio Contact:* +91 99445 71226\n\n`;
    msg += `_Thank you for choosing Vijai Embroidery Groups! Please reply to confirm your order._`;

    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Quotation Action & Header Bar (Hidden during print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-brand-title flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-700" />
            Official Quotation & Estimate Generator
          </h3>
          <p className="text-xs text-slate-500 font-light">
            Create professional GST quotations, generate admin confirmed round seal, and share with customers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Generate / Confirm Button */}
          <button
            onClick={handleConfirmQuotation}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 ${
              isConfirmed 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white ring-2 ring-purple-300 animate-pulse hover:animate-none'
            }`}
            title="Generate & Verify with Official Digital Round Seal"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            {isConfirmed ? '✓ Confirmed (Sealed)' : 'Generate & Confirm Seal'}
          </button>

          <button
            onClick={handleNewQuotation}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Quote
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5 fill-white" /> Send on WhatsApp
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-slate-900 hover:from-emerald-700 hover:to-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" /> Print / Download PDF
          </button>
        </div>
      </div>

      {/* Split Grid: Left Editor & Right Live A4 Sheet Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: EDITABLE INPUT CONTROLS (Hidden on Print)   */}
        {/* ======================================================== */}
        <div className="print:hidden xl:col-span-5 space-y-4">
          
          {/* 1. Quotation Details Card */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Quotation Meta
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Quote No.</label>
                <input
                  type="text"
                  value={quotationNo}
                  onChange={(e) => setQuotationNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Quote Date</label>
                <input
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Valid Till</label>
                <input
                  type="date"
                  value={validTillDate}
                  onChange={(e) => setValidTillDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800"
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
                    placeholder="e.g. Priyadarshini R."
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9840123456"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Customer Delivery Address & City</label>
                <input
                  type="text"
                  placeholder="Address in Tamil Nadu..."
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800"
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
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-emerald-100 text-xs space-y-2 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-800 text-[11px] font-mono">Item #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Service Description (e.g. Bridal Blouse Maggam Embroidery)"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white text-slate-800 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500">Rate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500">GST %</label>
                      <select
                        value={item.gstRate}
                        onChange={(e) => handleUpdateItem(item.id, 'gstRate', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
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
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-brand-title">
                    Quotation
                  </h1>
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

                {/* Signature and Digital Round Seal Area */}
                <div className="flex flex-col items-center sm:items-end space-y-2">
                  {isConfirmed ? (
                    <div className="relative flex flex-col items-center sm:items-end">
                      {/* Authentic Digital Round Seal Stamp */}
                      <div className="relative flex items-center justify-center">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rotate-[-7deg] transition-transform hover:rotate-0 duration-300">
                          <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-800 drop-shadow-sm">
                            {/* Outer Rings */}
                            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3.5" opacity="0.95" />
                            <circle cx="100" cy="100" r="89" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3.5 2.5" opacity="0.85" />
                            
                            {/* Inner Ring */}
                            <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.9" />
                            <circle cx="100" cy="100" r="61" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

                            {/* Curved Circular Text Top */}
                            <path id="curveTopGen" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
                            <text className="text-[10px] font-black uppercase tracking-[0.14em]" fill="currentColor">
                              <textPath href="#curveTopGen" startOffset="50%" textAnchor="middle">
                                ★ VIJAI EMBROIDERY GROUPS ★
                              </textPath>
                            </text>

                            {/* Curved Circular Text Bottom */}
                            <path id="curveBottomGen" d="M 178 100 A 78 78 0 0 1 22 100" fill="none" />
                            <text className="text-[9.5px] font-bold uppercase tracking-[0.16em]" fill="currentColor">
                              <textPath href="#curveBottomGen" startOffset="50%" textAnchor="middle">
                                • SALEM, TAMIL NADU •
                              </textPath>
                            </text>

                            {/* Center Star & Confirmation Badge */}
                            <g transform="translate(100, 100)" textAnchor="middle">
                              <path d="M 0 -36 L 2.5 -29 L 9.5 -29 L 4 -24 L 6 -17 L 0 -21 L -6 -17 L -4 -24 L -9.5 -29 L -2.5 -29 Z" fill="currentColor" opacity="0.9" />
                              <text y="-8" className="text-[12.5px] font-black tracking-wider uppercase font-mono" fill="currentColor">
                                CONFIRMED
                              </text>
                              <text y="7" className="text-[8px] font-bold tracking-widest uppercase font-mono" fill="currentColor" opacity="0.9">
                                DIGITAL SEAL
                              </text>
                              <text y="19" className="text-[7.5px] font-semibold tracking-wider font-mono" fill="currentColor" opacity="0.8">
                                AUTH: ADMIN
                              </text>
                              <text y="30" className="text-[7px] font-mono" fill="currentColor" opacity="0.75">
                                {quotationDate || 'SALEM-TN'}
                              </text>
                            </g>
                          </svg>

                          {/* Ink Stamp Overlay Texture Effect */}
                          <div className="absolute inset-0 rounded-full pointer-events-none mix-blend-multiply opacity-25 bg-radial from-transparent to-indigo-900" />
                        </div>
                      </div>

                      {/* Script Signature & Title */}
                      <div className="mt-1 text-center sm:text-right">
                        <p className="font-brand-luxury italic font-bold text-slate-900 text-sm tracking-wider leading-none">
                          Vijai Kumar R.
                        </p>
                        <div className="border-t border-slate-300 pt-1 mt-1">
                          <p className="font-bold text-slate-900 font-mono text-[10px]">Authorized Signatory</p>
                          <p className="text-[9px] text-slate-500">Vijay Embroidery Studio • Salem</p>
                          <div className="mt-0.5 inline-flex items-center gap-1 text-[8.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Digitally Verified & Sealed by Admin</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full sm:w-56 p-3 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/60 text-center space-y-2">
                      <p className="text-[10px] font-semibold text-purple-900 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                        Unsealed • Pending Admin Confirmation
                      </p>
                      <button
                        type="button"
                        onClick={handleConfirmQuotation}
                        className="print:hidden w-full py-1.5 px-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" /> Confirm & Place Seal
                      </button>
                      <div className="pt-1 border-t border-purple-200">
                        <p className="font-bold text-slate-800 font-mono text-[10px]">Authorized Signatory</p>
                        <p className="text-[9px] text-slate-400">Vijay Embroidery Studio • Salem</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
