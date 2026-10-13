import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler as h } from '../helpers/http';
import { authenticate } from '../middleware/auth';
import { changePassword, login, me } from '../controller/auth.controller';
import { LogService, requestContext } from '../services/LogService';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    LogService.record({
      ...requestContext(req),
      category: 'security',
      action: 'auth.rate_limited',
      level: 'warning',
      message: `Sign-in blocked after too many attempts${req.body?.email ? ` for ${req.body.email}` : ''}`,
    });
    res.status(options.statusCode).json({ status: false, message: 'Too many login attempts, try again later' });
  },
});

router.post('/login', loginLimiter, h(login));
router.get('/me', h(authenticate), h(me));
router.put('/password', h(authenticate), h(changePassword));

export default router;
