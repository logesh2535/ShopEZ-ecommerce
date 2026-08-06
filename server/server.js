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

import fs from 'fs';
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
  if (req.path === '/' || req.path === '/api' || req.path.startsWith('/api/')) {
    try {
      await connectDB();
    } catch (err) {
      console.error('❌ [DB Middleware Error]:', err.message);
      return res.status(500).json({ message: 'Database connection failed. Please try again later.' });
    }
  }
  next();
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

app.get('/api', (req, res) => {
  res.json({
    message: 'ShopEZ API Endpoint Active',
    status: 'Healthy',
    timestamp: new Date().toISOString(),
  });
});

// Serve Static Frontend Assets (Production & Web Service deployments)
const possibleClientPaths = [
  path.resolve(__dirname, '../client/dist'),
  path.resolve(__dirname, '../client/build'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), 'client/build'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(process.cwd(), 'build'),
];

const clientStaticPath = possibleClientPaths.find((p) => fs.existsSync(p));

if (clientStaticPath) {
  console.log(`[ShopEZ Server] Serving frontend static files from: ${clientStaticPath}`);
  app.use(express.static(clientStaticPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientStaticPath, 'index.html'));
  });
} else {
  // Health & Root Endpoint fallback if no static frontend build is present
  app.get('/', (req, res) => {
    res.json({
      message: 'ShopEZ REST API Server is running smoothly!',
      tagline: 'Your One-Stop Destination for Effortless Online Shopping.',
      status: 'Healthy',
      timestamp: new Date().toISOString(),
    });
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

let currentPort = Number(process.env.PORT) || 5000;

if (!process.env.VERCEL) {
  const startServer = (portToTry) => {
    const serverInstance = app
      .listen(portToTry, () => {
        console.log(`[ShopEZ Server] Server listening on port ${portToTry} in ${process.env.NODE_ENV || 'development'} mode.`);
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`⚠️ [ShopEZ Server] Port ${portToTry} is already in use. Trying port ${portToTry + 1}...`);
          startServer(portToTry + 1);
        } else {
          console.error('❌ [ShopEZ Server Error]:', err.message);
        }
      });
  };

  startServer(currentPort);
}

export default app;
