import { Router } from 'express';
import { asyncHandler as h } from '../helpers/http';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { uploadMedia } from '../middleware/upload';
import { Category } from '../entity/Category';
import { Product } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import {
  deleteMedia,
  listMedia,
  mediaUsage,
  updateMedia,
  uploadMedia as uploadMediaHandler,
} from '../controller/media.controller';
import {
  deleteCase,
  deleteCategory,
  deleteProduct,
  getCase,
  getProduct,
  listCases,
  listCategories,
  listProducts,
  reorder,
  saveCase,
  saveCategory,
  saveProduct,
} from '../controller/catalog.controller';
import {
  dashboard,
  deleteInquiry,
  deleteSubscriber,
  getAllSettings,
  listInquiries,
  listSubscribers,
  markInquiry,
  updateSettings,
} from '../controller/content.controller';
import { createUser, deleteUser, listUsers } from '../controller/auth.controller';
import { analyticsSummary, getVisit, listVisits } from '../controller/analytics.controller';
import { exportLogs, listLogs } from '../controller/logs.controller';

const router = Router();

router.use(h(authenticate), authorizeAdmin);

router.get('/dashboard', h(dashboard));

// Visitor analytics
router.get('/analytics', h(analyticsSummary));
router.get('/analytics/visits', h(listVisits));
router.get('/analytics/visits/:id', h(getVisit));

// Activity log
router.get('/logs', h(listLogs));
router.get('/logs/export', h(exportLogs));

// Media library
router.get('/media', h(listMedia));
router.post('/media', uploadMedia, h(uploadMediaHandler));
router.patch('/media/:id', h(updateMedia));
router.get('/media/:id/usage', h(mediaUsage));
router.delete('/media/:id', h(deleteMedia));

// Categories
router.get('/categories', h(listCategories));
router.post('/categories', h(saveCategory));
router.put('/categories/reorder', h(reorder(Category)));
router.put('/categories/:id', h(saveCategory));
router.delete('/categories/:id', h(deleteCategory));

// Products
router.get('/products', h(listProducts(true)));
router.post('/products', h(saveProduct));
router.put('/products/reorder', h(reorder(Product)));
router.get('/products/:id', h(getProduct(true)));
router.put('/products/:id', h(saveProduct));
router.delete('/products/:id', h(deleteProduct));

// Design cases
router.get('/design-cases', h(listCases(true)));
router.post('/design-cases', h(saveCase));
router.put('/design-cases/reorder', h(reorder(DesignCase)));
router.get('/design-cases/:id', h(getCase(true)));
router.put('/design-cases/:id', h(saveCase));
router.delete('/design-cases/:id', h(deleteCase));

// Site settings
router.get('/settings', h(getAllSettings));
router.put('/settings/:key', h(updateSettings));

// Inbox
router.get('/inquiries', h(listInquiries));
router.patch('/inquiries/:id', h(markInquiry));
router.delete('/inquiries/:id', h(deleteInquiry));
router.get('/subscribers', h(listSubscribers));
router.delete('/subscribers/:id', h(deleteSubscriber));

// Admin users
router.get('/users', h(listUsers));
router.post('/users', h(createUser));
router.delete('/users/:id', h(deleteUser));

export default router;
