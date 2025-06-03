import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entity/User';
import { NewsletterSubscriber } from '../entity/Mail';
import { requireEnv } from '../helpers/require-env';

dotenv.config();

const DB_HOST = requireEnv('DB_HOST');
const DB_PORT = requireEnv('DB_PORT');
const DB_USER = requireEnv('DB_USER');
const DB_PASS = requireEnv('DB_PASS');
const DB_NAME = requireEnv('DB_NAME');

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [User, NewsletterSubscriber],
  synchronize: process.env.NODE_ENV === 'production' ? false : true, // Disable in production
  logging: process.env.NODE_ENV === 'production' ? false : true,
});
