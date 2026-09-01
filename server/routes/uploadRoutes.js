import express from 'express';
import { upload } from '../config/cloudinary.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// Safe error handler for multer cloudinary missing config
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.warn('[Cloudinary Warning]:', err.message);
      // Fallback to uploadImage controller demo response
      return uploadImage(req, res);
    }
    next();
  });
};

router.post('/', handleUpload, uploadImage);

export default router;
