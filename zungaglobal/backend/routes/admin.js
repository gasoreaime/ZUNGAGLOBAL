import express from 'express';
import { adminOnly } from '../middleware/admin.js';
import {
  getDashboardStats,
  getSalesAnalytics
} from '../controllers/adminController.js';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Dashboard routes
router.get('/dashboard', adminOnly, getDashboardStats);
router.get('/analytics/sales', adminOnly, getSalesAnalytics);

// Product management routes
router.get('/products', adminOnly, getProducts);
router.post('/products', adminOnly, createProduct);
router.put('/products/:id', adminOnly, updateProduct);
router.delete('/products/:id', adminOnly, deleteProduct);

export default router;