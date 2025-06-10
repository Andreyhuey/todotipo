import { Router } from 'express';
import {
  sendContactFormMail,
  joinSubscribersList,
  sendProductQuote,
} from '../controller/mail.controller';

const router = Router();

router.post('/', sendContactFormMail);
router.post('/subscribe', joinSubscribersList);
router.post('/quote-product', sendProductQuote);

export default router;
