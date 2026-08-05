import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of current working directory (VS Code root, server dir, IDE, etc.)
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Database Connection
connectDB();
  
// CORS & Middleware
app.use(cors());
app.use(express.json());

// Middleware to guarantee MongoDB connection readiness before handling API requests
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ [DB Middleware Error]:', err.message);
    return res.status(500).json({ message: 'Database connection failed. Please try again later.' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', analyticsRoutes);

// Health & Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ShopEZ REST API Server is running smoothly!',
    tagline: 'Your One-Stop Destination for Effortless Online Shopping.',
    status: 'Healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'ShopEZ API Endpoint Active',
    status: 'Healthy',
    timestamp: new Date().toISOString(),
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[ShopEZ Server] Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

export default app;
