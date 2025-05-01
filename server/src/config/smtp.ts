import dotenv from 'dotenv';
import { requireEnv } from '../helpers/require-env';

dotenv.config();

export const config = {
  SMTP_HOST: requireEnv('SMTP_HOST'),
  SMTP_PORT: requireEnv('SMTP_PORT'),
  SMTP_USER: requireEnv('SMTP_USER'),
  SMTP_PASS: requireEnv('SMTP_PASS'),
};
