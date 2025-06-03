import { Router } from 'express';
import {
  sendContactFormMail,
  joinSubscribersList,
} from '../controller/mail.controller';

const router = Router();

router.post('/', sendContactFormMail);
router.post('/subscriber-list', joinSubscribersList);

export default router;
