import dotenv from 'dotenv';
import { requireEnv } from '../helpers/require-env';

dotenv.config();

export const authConfig = {
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
