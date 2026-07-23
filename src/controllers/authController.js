import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { config } from '../config/index.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';

// Zod Validation Schemas
export const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['CUSTOMER', 'ADMIN']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Helper to sign JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: '7d',
  });
};

// Helper to send cookie
const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  };
  res.cookie('token', token, cookieOptions);
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, name, phone, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('A user with this email already exists.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in MongoDB
    const user = await User.create({
      email,
      passwordHash,
      name,
      phone,
      address,
      role: role || 'CUSTOMER',
    });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Incorrect email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Incorrect email or password.');
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const safeUser = user.toObject();
    delete safeUser.passwordHash;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5000), // expires in 5 seconds
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out.',
  });
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};
