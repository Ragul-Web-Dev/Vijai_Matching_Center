import express from 'express';
import { requireAdminAuth, verifyAdminToken } from '../auth.js';
import { loadData, saveData } from '../store.js';
import { generateQuotationPdf } from '../utils/pdfGenerator.js';

const router = express.Router();

// Helper to check if request has valid admin token without blocking with middleware
const isReqAdmin = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return verifyAdminToken(token);
};

// Helper to normalize status strings to DRAFT | APPROVED | SENT
const normalizeStatus = (status) => {
  if (!status) return 'DRAFT';
  const s = String(status).toUpperCase();
  if (s === 'APPROVED' || s === 'CONFIRMED') return 'APPROVED';
  if (s === 'SENT') return 'SENT';
  return 'DRAFT';
};

// GET /api/quotations - List all quotations (sorted by newest)
router.get('/', (req, res) => {
  try {
    const store = loadData();
    const quotations = (store.quotations || []).map(q => ({
      ...q,
      status: normalizeStatus(q.status),
      hasSeal: Boolean(q.hasSeal)
    }));
    return res.status(200).json({
      success: true,
      quotations
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quotations/:id/pdf - Download or view official generated PDF
router.get('/:id/pdf', async (req, res) => {
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
      return res.status(404).json({ success: false, message: `Quotation #${id} not found.` });
    }

    const normalized = {
      ...quotation,
      status: normalizeStatus(quotation.status),
      hasSeal: Boolean(quotation.hasSeal)
    };

    const isAdmin = isReqAdmin(req);
    if (!isAdmin && normalized.status === 'DRAFT') {
      return res.status(403).json({
        success: false,
        message: `Quotation #${id} is in DRAFT status and PDF is not yet available.`
      });
    }

    const cleanId = normalized.quotationNo || normalized.id;
    const pdfPath = await generateQuotationPdf(normalized);

    return res.download(pdfPath, `quotation-${cleanId}.pdf`);
  } catch (err) {
    console.error('[Quotation PDF Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quotations/:id - Retrieve specific quotation by ID or Quotation No
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

    const normalized = {
      ...quotation,
      status: normalizeStatus(quotation.status),
      hasSeal: Boolean(quotation.hasSeal)
    };

    const isAdmin = isReqAdmin(req);
    // Security rule: only approved or sent quotations can be viewed by customers. Drafts are forbidden for non-admins.
    if (!isAdmin && normalized.status === 'DRAFT') {
      return res.status(403).json({
        success: false,
        message: `Quotation #${id} is currently in DRAFT status and is not yet available for customer viewing.`
      });
    }

    // Ensure PDF file exists in server/uploads/quotations/ before customer download link is created
    try {
      generateQuotationPdf(normalized);
    } catch (pdfErr) {
      console.error('[Generate PDF Error in GET /:id]:', pdfErr);
    }

    return res.status(200).json({
      success: true,
      quotation: normalized,
      pdfUrl: `/uploads/quotations/quotation-${normalized.quotationNo || normalized.id}.pdf`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/quotations - Create or update a quotation (DRAFT by default)
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
      hasSeal,
      authorizedSignatory,
      designation,
      status
    } = req.body;

    if (!quotationNo) {
      return res.status(400).json({ success: false, message: 'Quotation number is required' });
    }

    const isAdmin = isReqAdmin(req);
    const store = loadData();
    const quotations = store.quotations || [];

    const cleanId = quotationNo.trim().toUpperCase();
    const existingIndex = quotations.findIndex(q => q.id === cleanId || q.quotationNo === cleanId);
    const existing = existingIndex !== -1 ? quotations[existingIndex] : null;

    // Workflow Rules:
    // 1. If quotation is already APPROVED or SENT, non-admins cannot edit it.
    if (existing && normalizeStatus(existing.status) !== 'DRAFT' && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This quotation has been approved and locked. Only an administrator can modify it.'
      });
    }

    // 2. Seal state:
    // Only authenticated ADMIN can apply the round company seal.
    let finalHasSeal = false;
    if (isAdmin) {
      finalHasSeal = hasSeal !== undefined 
        ? Boolean(hasSeal) 
        : (existing ? Boolean(existing.hasSeal) : false);
    } else {
      finalHasSeal = existing ? Boolean(existing.hasSeal) : false;
    }

    // 3. Status state:
    // Default is always DRAFT when creating/saving unless admin explicitly sets APPROVED/SENT.
    let finalStatus = 'DRAFT';
    if (existing) {
      finalStatus = normalizeStatus(status || existing.status);
    } else {
      finalStatus = (isAdmin && status) ? normalizeStatus(status) : 'DRAFT';
    }

    const newQuotation = {
      id: cleanId,
      quotationNo: cleanId,
      quotationDate: quotationDate || (existing ? existing.quotationDate : new Date().toISOString().split('T')[0]),
      validTillDate: validTillDate || (existing ? existing.validTillDate : new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]),
      customer: customer || (existing ? existing.customer : { name: 'Valued Customer', phone: '', address: '' }),
      items: items || (existing ? existing.items : []),
      subtotal: Number(subtotal !== undefined ? subtotal : (existing ? existing.subtotal : 0)),
      cgst: Number(cgst !== undefined ? cgst : (existing ? existing.cgst : 0)),
      sgst: Number(sgst !== undefined ? sgst : (existing ? existing.sgst : 0)),
      grandTotal: Number(grandTotal !== undefined ? grandTotal : (existing ? existing.grandTotal : 0)),
      notes: notes !== undefined ? notes : (existing ? existing.notes : ''),
      hasSeal: finalHasSeal,
      hasSignature: false,
      authorizedSignatory: authorizedSignatory || (existing ? existing.authorizedSignatory : 'Vijai Kumar R.'),
      designation: designation || (existing ? existing.designation : 'Studio Administrator'),
      status: finalStatus,
      approvedAt: existing?.approvedAt || (finalStatus === 'APPROVED' ? new Date().toISOString() : null),
      approvedBy: existing?.approvedBy || (finalStatus === 'APPROVED' ? 'Vijai Embroidery Admin' : null),
      sentAt: existing?.sentAt || (finalStatus === 'SENT' ? new Date().toISOString() : null),
      updatedAt: new Date().toISOString(),
      createdAt: existing ? existing.createdAt : new Date().toISOString()
    };

    if (existingIndex !== -1) {
      quotations[existingIndex] = newQuotation;
    } else {
      quotations.unshift(newQuotation);
    }

    store.quotations = quotations;
    saveData(store);

    // Ensure PDF file is generated on disk before any download link is clicked
    try {
      generateQuotationPdf(newQuotation);
    } catch (pdfErr) {
      console.error('[Generate PDF Error in POST /api/quotations]:', pdfErr);
    }

    const envBase = (process.env.PUBLIC_BASE_URL || process.env.VITE_PUBLIC_BASE_URL || process.env.BASE_URL || '').trim().replace(/\/+$/, '');
    const path = `/quotation/${encodeURIComponent(cleanId)}`;
    let publicUrl = envBase ? `${envBase}${path}` : path;
    if (!envBase) {
      const host = req.get('host') || '';
      const isLocal = !host || host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
      if (!isLocal) {
        const protocol = req.protocol || 'https';
        publicUrl = `${protocol}://${host}${path}`;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation saved successfully in DRAFT status',
      quotation: newQuotation,
      publicUrl
    });
  } catch (err) {
    console.error('[Quotation Save Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/quotations/:id/seal - Admin applies or removes company round seal
router.patch('/:id/seal', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { hasSeal } = req.body;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const quotations = store.quotations || [];

    const idx = quotations.findIndex(q => 
      q.id === cleanQuery || 
      q.quotationNo === cleanQuery ||
      q.id.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Quotation #${id} not found.` });
    }

    const nextSeal = hasSeal !== undefined ? Boolean(hasSeal) : !Boolean(quotations[idx].hasSeal);
    quotations[idx].hasSeal = nextSeal;
    quotations[idx].updatedAt = new Date().toISOString();

    store.quotations = quotations;
    saveData(store);

    return res.status(200).json({
      success: true,
      message: nextSeal ? 'Official company round seal applied.' : 'Round seal removed.',
      quotation: quotations[idx]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/quotations/:id/approve - Admin Approves & Publishes Quotation (DRAFT -> APPROVED)
router.patch('/:id/approve', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const quotations = store.quotations || [];

    const idx = quotations.findIndex(q => 
      q.id === cleanQuery || 
      q.quotationNo === cleanQuery ||
      q.id.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Quotation #${id} not found.` });
    }

    quotations[idx].status = 'APPROVED';
    quotations[idx].approvedAt = new Date().toISOString();
    quotations[idx].approvedBy = 'Vijai Embroidery Admin';
    quotations[idx].updatedAt = new Date().toISOString();

    // Ensure PDF is generated on disk
    try {
      generateQuotationPdf(quotations[idx]);
    } catch (pdfErr) {
      console.error('[Generate PDF Error on Approve]:', pdfErr);
    }

    store.quotations = quotations;
    saveData(store);

    return res.status(200).json({
      success: true,
      message: `Quotation #${quotations[idx].quotationNo} approved and published successfully.`,
      quotation: quotations[idx]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/quotations/:id/send - Mark quotation as SENT to customer
router.patch('/:id/send', (req, res) => {
  try {
    const { id } = req.params;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const quotations = store.quotations || [];

    const idx = quotations.findIndex(q => 
      q.id === cleanQuery || 
      q.quotationNo === cleanQuery ||
      q.id.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Quotation #${id} not found.` });
    }

    quotations[idx].status = 'SENT';
    quotations[idx].sentAt = new Date().toISOString();
    quotations[idx].updatedAt = new Date().toISOString();

    // Ensure PDF is generated on disk
    try {
      generateQuotationPdf(quotations[idx]);
    } catch (pdfErr) {
      console.error('[Generate PDF Error on Send]:', pdfErr);
    }

    store.quotations = quotations;
    saveData(store);

    return res.status(200).json({
      success: true,
      message: `Quotation #${quotations[idx].quotationNo} marked as SENT.`,
      quotation: quotations[idx]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/quotations/:id/send-whatsapp - Simplified WhatsApp send helper (Marks status SENT and ensures PDF generated)
router.post('/:id/send-whatsapp', (req, res) => {
  try {
    const { id } = req.params;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const quotations = store.quotations || [];

    const idx = quotations.findIndex(q => 
      q.id === cleanQuery || 
      q.quotationNo === cleanQuery ||
      q.id.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );

    let quotation = idx !== -1 ? quotations[idx] : null;

    if (!quotation) {
      if (req.body && (req.body.quotationNo || req.body.customer)) {
        quotation = {
          id: cleanQuery,
          quotationNo: req.body.quotationNo || cleanQuery,
          quotationDate: req.body.quotationDate || new Date().toISOString().split('T')[0],
          validTillDate: req.body.validTillDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          customer: req.body.customer || { name: 'Valued Customer', phone: '', address: '' },
          items: req.body.items || [],
          subtotal: Number(req.body.subtotal) || 0,
          cgst: Number(req.body.cgst) || 0,
          sgst: Number(req.body.sgst) || 0,
          grandTotal: Number(req.body.grandTotal) || 0,
          notes: req.body.notes || '',
          hasSeal: Boolean(req.body.hasSeal),
          status: 'SENT',
          sentAt: new Date().toISOString(),
          authorizedSignatory: req.body.authorizedSignatory || 'Vijai Kumar R.',
          designation: req.body.designation || 'Studio Administrator',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        quotations.unshift(quotation);
      } else {
        return res.status(404).json({ success: false, message: `Quotation #${id} not found.` });
      }
    } else {
      quotation.status = 'SENT';
      quotation.sentAt = new Date().toISOString();
      quotation.updatedAt = new Date().toISOString();
    }

    try {
      generateQuotationPdf(quotation);
    } catch (pdfErr) {
      console.error('[Generate PDF Error in send-whatsapp]:', pdfErr);
    }

    store.quotations = quotations;
    saveData(store);

    return res.status(200).json({
      success: true,
      message: 'Quotation marked as SENT successfully',
      quotation: quotation
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/quotations/:id - Delete quotation (Admin only)
router.delete('/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const cleanQuery = (id || '').trim().toUpperCase();
    const store = loadData();
    const initialLen = (store.quotations || []).length;

    store.quotations = (store.quotations || []).filter(q => 
      q.id !== cleanQuery && 
      q.quotationNo !== cleanQuery &&
      q.id.replace(/[^0-9]/g, '') !== cleanQuery.replace(/[^0-9]/g, '')
    );

    if (store.quotations.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    saveData(store);
    return res.status(200).json({ success: true, message: 'Quotation deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
