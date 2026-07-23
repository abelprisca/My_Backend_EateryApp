import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Handle Mongoose Duplicate Key Error (e.g. Email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.statusCode = 409;
    error.status = 'fail';
    error.message = `A user already exists with that ${field}.`;
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.statusCode = 400;
    error.status = 'fail';
    error.message = `Database validation failed: ${messages.join('. ')}`;
  }

  // Handle Mongoose Cast Errors (e.g. invalid ObjectId lookup)
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.status = 'fail';
    error.message = `Invalid ${err.path}: ${err.value}.`;
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.status = 'fail';
    error.message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.status = 'fail';
    error.message = 'Your session has expired. Please log in again.';
  }

  const response = {
    status: error.status,
    message: error.message,
  };

  if (config.isDev) {
    response.stack = err.stack;
  }

  // Log unhandled server errors (500s)
  if (error.statusCode === 500) {
    console.error('ERROR 💥:', err);
    response.message = 'An unexpected server error occurred.';
  }

  res.status(error.statusCode).json(response);
};
