import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler as h } from '../helpers/http';
import { getSite } from '../controller/content.controller';
import {
  getCase,
  getProduct,
  listCases,
  listCategories,
  listProducts,
} from '../controller/catalog.controller';
import { trackLeave, trackVisit } from '../controller/analytics.controller';

const router = Router();

router.get('/site', h(getSite));
router.get('/categories', h(listCategories));
router.get('/products', h(listProducts(false)));
router.get('/products/:id', h(getProduct(false)));
router.get('/design-cases', h(listCases(false)));
router.get('/design-cases/:id', h(getCase(false)));

// Page-view tracking. Generous limit: a visitor browsing quickly is fine,
// a script hammering the endpoint is not.
const trackLimiter = rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false });
router.post('/track', trackLimiter, h(trackVisit));
// sendBeacon posts text/plain to avoid a CORS preflight.
router.post('/track/leave', trackLimiter, express.text({ type: '*/*', limit: '2kb' }), h(trackLeave));

export default router;
