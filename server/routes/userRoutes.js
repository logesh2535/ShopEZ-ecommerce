import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUser,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .delete(deleteUser);

export default router;
