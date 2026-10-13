import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler as h } from '../helpers/http';
import {
  sendContactFormMail,
  joinSubscribersList,
  sendProductQuote,
} from '../controller/mail.controller';
import { LogService, requestContext } from '../services/LogService';

const router = Router();

// Forms are public; throttle per IP to keep spam bots off the inbox.
router.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, _next, options) => {
      LogService.record({
        ...requestContext(req),
        category: 'security',
        action: 'forms.rate_limited',
        level: 'warning',
        message: `Form submissions blocked for too many requests (${req.originalUrl})`,
      });
      res.status(options.statusCode).json({ status: false, message: 'Too many requests, please try again shortly' });
    },
  })
);

router.post('/', h(sendContactFormMail));
router.post('/subscribe', h(joinSubscribersList));
router.post('/quote-product', h(sendProductQuote));

export default router;
