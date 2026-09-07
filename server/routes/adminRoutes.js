import express from 'express';
import { generateAdminToken, requireAdminAuth } from '../auth.js';
import { loadData, saveData } from '../store.js';

const router = express.Router();

// POST /api/admin/login - Authenticate admin credentials
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'VijayAdmin@2026';

    if (
      (username && username.trim().toLowerCase() === validUsername.toLowerCase() && password === validPassword) ||
      (!username && password === validPassword)
    ) {
      const token = generateAdminToken();
      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful',
        token,
        admin: {
          username: validUsername,
          role: 'Studio Administrator',
          name: 'Vijay Embroidery Admin'
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid administrative password or username'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/verify - Verify session token
router.get('/verify', requireAdminAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    message: 'Admin session is active'
  });
});

// ==========================================
// PROTECTED ENQUIRY MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/admin/enquiries - List all enquiries with metrics
router.get('/enquiries', requireAdminAuth, (req, res) => {
  try {
    const store = loadData();
    const enquiries = store.enquiries || [];

    // Calculate metrics
    const total = enquiries.length;
    const newCount = enquiries.filter(e => e.status === 'New').length;
    const contactedCount = enquiries.filter(e => e.status === 'Contacted').length;
    const confirmedCount = enquiries.filter(e => e.status === 'Confirmed').length;
    const completedCount = enquiries.filter(e => e.status === 'Completed').length;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        new: newCount,
        contacted: contactedCount,
        confirmed: confirmedCount,
        completed: completedCount
      },
      enquiries
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/enquiries/:id/status - Update enquiry status
router.patch('/enquiries/:id/status', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['New', 'Contacted', 'Confirmed', 'Completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const store = loadData();
    const enquiryIndex = (store.enquiries || []).findIndex(e => e.id === id || e.refId === id);

    if (enquiryIndex === -1) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    store.enquiries[enquiryIndex].status = status;
    store.enquiries[enquiryIndex].updatedAt = new Date().toISOString();
    saveData(store);

    return res.status(200).json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      enquiry: store.enquiries[enquiryIndex]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/enquiries/:id - Delete enquiry
router.delete('/enquiries/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const store = loadData();
    const initialLen = (store.enquiries || []).length;
    store.enquiries = (store.enquiries || []).filter(e => e.id !== id && e.refId !== id);

    if (store.enquiries.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    saveData(store);
    return res.status(200).json({ success: true, message: 'Enquiry removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// PROTECTED FEEDBACK MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/admin/feedbacks - List all feedbacks (Draft & Published)
router.get('/feedbacks', requireAdminAuth, (req, res) => {
  try {
    const store = loadData();
    return res.status(200).json({
      success: true,
      feedbacks: store.feedbacks || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/feedbacks - Add verified customer review/media
router.post('/feedbacks', requireAdminAuth, (req, res) => {
  try {
    const { name, rating, comment, service, image, video, status } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Customer name and feedback comment are required' });
    }

    const store = loadData();
    const newFeedback = {
      id: 'FB-' + Date.now(),
      name: name.trim(),
      rating: Number(rating) || 5,
      service: service || 'Bridal Blouse Work',
      comment: comment.trim(),
      image: image || null,
      video: video || null,
      status: status === 'Draft' ? 'Draft' : 'Published',
      createdAt: new Date().toISOString()
    };

    store.feedbacks = [newFeedback, ...(store.feedbacks || [])];
    saveData(store);

    return res.status(201).json({
      success: true,
      message: 'Customer feedback saved successfully',
      feedback: newFeedback
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/feedbacks/:id - Update feedback status or contents
router.patch('/feedbacks/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, name, comment, rating, service, image, video } = req.body;

    const store = loadData();
    const index = (store.feedbacks || []).findIndex(f => f.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    if (status !== undefined) store.feedbacks[index].status = status;
    if (name !== undefined) store.feedbacks[index].name = name;
    if (comment !== undefined) store.feedbacks[index].comment = comment;
    if (rating !== undefined) store.feedbacks[index].rating = Number(rating);
    if (service !== undefined) store.feedbacks[index].service = service;
    if (image !== undefined) store.feedbacks[index].image = image;
    if (video !== undefined) store.feedbacks[index].video = video;

    store.feedbacks[index].updatedAt = new Date().toISOString();
    saveData(store);

    return res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: store.feedbacks[index]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/feedbacks/:id - Delete feedback
router.delete('/feedbacks/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const store = loadData();
    const initialLen = (store.feedbacks || []).length;
    store.feedbacks = (store.feedbacks || []).filter(f => f.id !== id);

    if (store.feedbacks.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    saveData(store);
    return res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
