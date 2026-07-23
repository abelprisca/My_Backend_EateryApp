import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { NotFoundError } from './utils/errors.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// 1) Security Headers
// 1) Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// 2) CORS configuration supporting cookies/credentials
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3) Request body parser & cookie parser
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Eatery API is healthy.',
    timestamp: new Date().toISOString(),
  });
});

// 4) Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// 5) Catch-all for unhandled routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server.`));
});

// 6) Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
