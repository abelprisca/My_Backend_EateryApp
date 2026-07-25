import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret:
    process.env.JWT_SECRET || 'fallback_secret_key_change_in_prod',
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eatery',

  corsOrigins: (
    process.env.CORS_ORIGIN ||
    'http://localhost:5173,https://priscamyeateryapp.vercel.app'
  )
    .split(',')
    .map((origin) => origin.trim()),

  isDev: (process.env.NODE_ENV || 'development') === 'development',
};