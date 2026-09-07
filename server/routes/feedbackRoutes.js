import express from 'express';
import { loadData, saveData } from '../store.js';

const router = express.Router();

// GET /api/feedbacks - Public endpoint returning ONLY Published feedbacks
router.get('/', (req, res) => {
  try {
    const store = loadData();
    const published = (store.feedbacks || []).filter(f => f.status === 'Published');
    return res.status(200).json({
      success: true,
      feedbacks: published
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/feedbacks - Public submission (set to 'Draft' or 'Published' based on policy)
router.post('/', (req, res) => {
  try {
    const { name, rating, comment, service, image, video } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }

    const store = loadData();
    const newFeedback = {
      id: 'FB-' + Date.now(),
      name: name.trim(),
      rating: Number(rating) || 5,
      service: service || 'Custom Embroidery',
      comment: comment.trim(),
      image: image || null,
      video: video || null,
      status: 'Draft', // Saved as Draft pending Admin Approval
      createdAt: new Date().toISOString()
    };

    store.feedbacks = [newFeedback, ...(store.feedbacks || [])];
    saveData(store);

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
