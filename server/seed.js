import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import Review from './models/Review.js';
import { sampleCategories, sampleProducts } from './utils/seedData.js';

const seedDB = async () => {
  try {
    console.log('[Seed] Initializing database connection...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Review.deleteMany({});

    console.log('[Seed] Creating default Admin & Customer users...');
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123',
      phone: '+1 555-0199',
      role: 'admin',
      address: {
        street: '100 Store HQ Blvd',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA',
      },
    });

    const customerUser = await User.create({
      name: 'Alex Johnson',
      email: 'customer@shopez.com',
      password: 'customer123',
      phone: '+1 555-0144',
      role: 'customer',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        country: 'USA',
      },
    });

    console.log('[Seed] Seeding categories...');
    const insertedCategories = await Category.insertMany(sampleCategories);

    console.log('[Seed] Seeding products...');
    const insertedProducts = await Product.insertMany(sampleProducts);

    console.log('[Seed] Seeding initial customer review...');
    await Review.create({
      userId: customerUser._id,
      productId: insertedProducts[0]._id,
      userName: customerUser.name,
      rating: 5,
      comment: 'Absolutely stunning audio quality! The active noise cancellation works like magic on flights.',
    });

    console.log('[Seed] Seeding sample active order for Customer & Admin...');
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await Order.create({
      userId: customerUser._id,
      orderId: 'SEZ-882190',
      products: [
        {
          productId: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          price: insertedProducts[0].price,
          quantity: 1,
          image: insertedProducts[0].images[0],
        },
        {
          productId: insertedProducts[2]._id,
          name: insertedProducts[2].name,
          price: insertedProducts[2].price,
          quantity: 1,
          image: insertedProducts[2].images[0],
        },
      ],
      totalAmount: 379.49,
      discountAmount: 40.00,
      taxAmount: 28.50,
      shippingFee: 4.99,
      grandTotal: 372.98,
      paymentMethod: 'Credit Card',
      shippingAddress: customerUser.address,
      status: 'Out for Delivery',
      deliveryType: 'Express (Next Day)',
      deliveryDate: tomorrow,
      deliveryTimeSlot: 'Morning Slot (9:00 AM - 1:00 PM)',
      deliveryOTP: '4829',
      deliveryExecutive: {
        name: 'Ramesh Kumar',
        phone: '+1 555-0199',
        vehicleNo: 'EZ-EXP-992',
        agentId: 'AGNT-7741',
      },
      courierName: 'ShopEZ Express Logistics',
      trackingNumber: 'SEZLOG882190',
      trackingTimeline: [
        {
          stepKey: 'Placed',
          title: 'Order Placed',
          description: 'Your order has been placed successfully and confirmed.',
          location: 'ShopEZ Central Hub',
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          completed: true,
          current: false,
        },
        {
          stepKey: 'Processing',
          title: 'Packed & Quality Verified',
          description: 'Seller has processed and packed your items with open-box verification.',
          location: 'Fulfillment Center - Main Dock',
          timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000),
          completed: true,
          current: false,
        },
        {
          stepKey: 'Shipped',
          title: 'Shipped (In Transit)',
          description: 'Package handed over to ShopEZ Express Logistics courier network.',
          location: 'Regional Sorting Facility',
          timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          completed: true,
          current: false,
        },
        {
          stepKey: 'Out for Delivery',
          title: 'Out for Delivery',
          description: 'Delivery Executive is out with your parcel. Share Delivery OTP upon arrival.',
          location: 'Springfield Local Hub',
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          completed: true,
          current: true,
        },
        {
          stepKey: 'Delivered',
          title: 'Delivered Successfully',
          description: 'Item handed over to recipient and verified with OTP.',
          location: 'Customer Address',
          timestamp: tomorrow,
          completed: false,
          current: false,
        },
      ],
      orderDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    });

    console.log('✅ [Seed Success] ShopEZ database successfully seeded in MongoDB!');
    console.log('--------------------------------------------------');
    console.log('🔐 Admin Login Credentials:');
    console.log('   Email: admin@shopez.com | Password: admin123');
    console.log('👤 Customer Login Credentials:');
    console.log('   Email: customer@shopez.com | Password: customer123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Failed]:', error.message);
    process.exit(1);
  }
};

seedDB();
