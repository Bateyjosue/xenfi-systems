import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authenticate } from '../middleware/auth';
import '../config/cloudinary';

const router = Router();

// Robust error handling wrapper
const uploadMiddleware = (req: any, res: any, next: any) => {
  // Check config first
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary config missing in .env');
    return res.status(500).json({ 
      error: 'Server configuration error: Cloudinary credentials missing' 
    });
  }

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'xenfi-receipts',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    } as any,
  });

  const upload = multer({ storage: storage }).single('file');

  upload(req, res, (err: any) => {
    if (err) {
      console.error('Multer/Cloudinary upload error DETAIL:', err);
      // Handle Multer errors explicitly
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(500).json({ error: `Upload failed: ${err.message || 'Unknown error'}`, detail: err.message });
    }
    next();
  });
};

router.post('/', authenticate, uploadMiddleware, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ url: req.file.path });
});

export default router;
