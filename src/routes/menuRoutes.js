// menu routes 
import express from 'express';
import multer from 'multer';
import path from 'path';

import * as menuController from '../controllers/menuController.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// ======================
// Public Routes
// ======================
router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItem);

// ======================
// Protected Admin Routes
// ======================
router.use(protect, restrictTo('ADMIN'));

router.post(
  '/',
  upload.single('image'),
  validate(menuController.createMenuItemSchema),
  menuController.createMenuItem
);

router.patch(
  '/:id',
  upload.single('image'),
  validate(menuController.updateMenuItemSchema),
  menuController.updateMenuItem
);

router.delete('/:id', menuController.deleteMenuItem);

export default router;