import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { requireEnv } from '../helpers/require-env';
import { isTunnelEnabled, openSshTunnel, TunnelInfo } from './ssh-tunnel';
import { User } from '../entity/User';
import { NewsletterSubscriber } from '../entity/Mail';
import { Media } from '../entity/Media';
import { Category } from '../entity/Category';
import { Product } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import { Setting } from '../entity/Setting';
import { Inquiry } from '../entity/Inquiry';
import { Visit } from '../entity/Visit';
import { IpGeo } from '../entity/IpGeo';
import { ActivityLog } from '../entity/ActivityLog';

dotenv.config();

const DB_HOST = requireEnv('DB_HOST');
const DB_PORT = Number(requireEnv('DB_PORT'));

// cPanel hosts offer both engines; 5432 is the PostgreSQL default.
const DB_TYPE = (process.env.DB_TYPE ||
  (DB_PORT === 5432 ? 'postgres' : 'mysql')) as 'postgres' | 'mysql';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: requireEnv('DB_USER'),
  password: requireEnv('DB_PASS'),
  database: requireEnv('DB_NAME'),
  entities: [
    User,
    NewsletterSubscriber,
    Media,
    Category,
    Product,
    DesignCase,
    Setting,
    Inquiry,
    Visit,
    IpGeo,
    ActivityLog,
  ],
  // Schema is additive-only here; set DB_SYNC=false once migrations exist.
  synchronize: process.env.DB_SYNC !== 'false',
  logging: !isProduction && process.env.DB_LOGGING === 'true',
});

let tunnel: TunnelInfo | undefined;

/** Opens the SSH tunnel (when configured) and initializes the data source. */
export const connectDatabase = async () => {
  if (AppDataSource.isInitialized) return AppDataSource;

  if (isTunnelEnabled()) {
    tunnel = await openSshTunnel(
      process.env.DB_REMOTE_HOST || DB_HOST,
      Number(process.env.DB_REMOTE_PORT || DB_PORT)
    );
    AppDataSource.setOptions({ host: tunnel.host, port: tunnel.port });
  }

  await AppDataSource.initialize();
  return AppDataSource;
};

export const disconnectDatabase = async () => {
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  tunnel?.close();
};
