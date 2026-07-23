import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: {
    status: 'fail',
    message: 'Too many login or signup attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, validate(authController.signupSchema), authController.signup);
router.post('/login', authLimiter, validate(authController.loginSchema), authController.login);
router.post('/logout', authController.logout);

// Protected Profile
router.get('/profile', protect, authController.getProfile);

export default router;
