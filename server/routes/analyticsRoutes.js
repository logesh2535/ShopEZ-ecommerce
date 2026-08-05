import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { subscribeNewsletter } from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);
router.post('/newsletter', subscribeNewsletter);

export default router;
