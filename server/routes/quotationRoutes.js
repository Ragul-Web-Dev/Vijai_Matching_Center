import express from 'express';
import { loadData, saveData } from '../store.js';

const router = express.Router();

// POST /api/quotations - Save or update a quotation
router.post('/', (req, res) => {
  try {
    const { 
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
      isConfirmed,
      status,
      confirmedAt,
      verifiedBy
    } = req.body;

    if (!quotationNo) {
      return res.status(400).json({ success: false, message: 'Quotation number is required' });
    }

    const store = loadData();
    const quotations = store.quotations || [];

    const cleanId = quotationNo.trim().toUpperCase();
    const existingIndex = quotations.findIndex(q => q.id === cleanId || q.quotationNo === cleanId);

    const newQuotation = {
      id: cleanId,
      quotationNo: cleanId,
      quotationDate: quotationDate || new Date().toISOString().split('T')[0],
      validTillDate: validTillDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      customer: customer || { name: 'Valued Customer', phone: '', address: '' },
      items: items || [],
      subtotal: Number(subtotal) || 0,
      cgst: Number(cgst) || 0,
      sgst: Number(sgst) || 0,
      grandTotal: Number(grandTotal) || 0,
      notes: notes || '',
      isConfirmed: isConfirmed !== undefined ? Boolean(isConfirmed) : (existingIndex !== -1 ? Boolean(quotations[existingIndex].isConfirmed) : false),
      status: status || (isConfirmed ? 'confirmed' : (existingIndex !== -1 ? quotations[existingIndex].status || 'pending' : 'pending')),
      confirmedAt: confirmedAt || (isConfirmed ? (existingIndex !== -1 && quotations[existingIndex].confirmedAt ? quotations[existingIndex].confirmedAt : new Date().toISOString()) : null),
      verifiedBy: verifiedBy || (isConfirmed ? 'Vijai Embroidery Admin' : null),
      updatedAt: new Date().toISOString(),
      createdAt: existingIndex !== -1 ? quotations[existingIndex].createdAt : new Date().toISOString()
    };

    if (existingIndex !== -1) {
      quotations[existingIndex] = newQuotation;
    } else {
      quotations.unshift(newQuotation);
    }

    store.quotations = quotations;
    saveData(store);

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5173';
    // Public download & view link for the customer
    const publicUrl = `${protocol}://${host}/quotation/${encodeURIComponent(cleanId)}`;

    return res.status(200).json({
      success: true,
      message: 'Quotation saved successfully',
      quotation: newQuotation,
      publicUrl: publicUrl
    });
  } catch (err) {
    console.error('[Quotation Save Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quotations - List all quotations
router.get('/', (req, res) => {
  try {
    const store = loadData();
    return res.status(200).json({
      success: true,
      quotations: store.quotations || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quotations/:id - Retrieve specific quotation by ID or Quotation No (e.g. VE-QT-1234 or 1234)
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const quotations = store.quotations || [];

    const quotation = quotations.find(q => 
      q.id === cleanQuery || 
      q.quotationNo === cleanQuery ||
      q.id.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: `Quotation #${id} not found. Please verify your Quotation ID.`
      });
    }

    return res.status(200).json({
      success: true,
      quotation
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/quotations/:id/confirm - Confirm & digitally verify quotation with round seal
router.put('/:id/confirm', (req, res) => {
  try {
    const { id } = req.params;
    const { verifiedBy } = req.body;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const quotations = store.quotations || [];

    const idx = quotations.findIndex(q => 
      q.id === cleanQuery || 
      q.quotationNo === cleanQuery ||
      q.id.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: `Quotation #${id} not found.`
      });
    }

    quotations[idx].isConfirmed = true;
    quotations[idx].status = 'confirmed';
    quotations[idx].confirmedAt = new Date().toISOString();
    quotations[idx].verifiedBy = verifiedBy || 'Vijai Embroidery Admin';
    quotations[idx].updatedAt = new Date().toISOString();

    store.quotations = quotations;
    saveData(store);

    return res.status(200).json({
      success: true,
      message: 'Quotation confirmed and digitally stamped with official seal.',
      quotation: quotations[idx]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
