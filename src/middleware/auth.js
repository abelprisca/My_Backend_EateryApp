import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Read token from HTTP-only cookies or Bearer Authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('You are not logged in. Please log in to get access.');
    }

    // 2) Verify JWT token
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3) Find corresponding user in the database
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError('The user belonging to this session no longer exists.');
    }

    // 4) Attach user info to req.user (excluding password details)
    const safeUser = user.toObject();
    delete safeUser.passwordHash;
    req.user = safeUser;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action.'));
    }
    next();
  };
};
