import dotenv from 'dotenv';
import { requireEnv } from '../helpers/require-env';

dotenv.config();

export const config = {
  FTP_BASE_PATH: requireEnv('FTP_BASE_PATH'),
  FTP_PUBLIC_URL: requireEnv('FTP_PUBLIC_URL'),
  FTP_HOST: requireEnv('FTP_HOST'),
  FTP_USER: requireEnv('FTP_USER'),
  FTP_PASSWORD: requireEnv('FTP_PASSWORD'),
  FTP_PORT: requireEnv('FTP_PORT'),
};
