import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id')
  .get(getOrderById)
  .put(adminOnly, updateOrderStatus);

export default router;
