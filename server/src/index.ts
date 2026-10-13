import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { AppDataSource, connectDatabase } from './config/database';
import { errorMiddleware } from './helpers/http';
import mailRoutes from './routes/mail.routes';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import { isLocalStorage, LOCAL_UPLOAD_DIR } from './services/FileService';
import { LogService } from './services/LogService';
import { auditTrail } from './middleware/audit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Behind cPanel/Vercel proxies — needed for per-IP rate limiting.
app.set('trust proxy', 1);

// Comma-separated allow-list; unset allows any origin (local development).
const origins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim());
app.use(cors(origins?.length ? { origin: origins } : undefined));
app.use(express.json({ limit: '2mb' }));

app.use('/templates', express.static(path.join(__dirname, 'templates')));
if (isLocalStorage()) {
  app.use('/uploads', express.static(LOCAL_UPLOAD_DIR, { maxAge: '30d', immutable: true }));
}
app.use('/', express.static(path.join(__dirname, 'public')));

const startedAt = new Date();

/** "3 days, 4 hours, 12 minutes" — largest three units, singular/plural aware. */
const humanDuration = (totalSeconds: number) => {
  const units: [string, number][] = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  let rest = Math.floor(totalSeconds);
  const parts: string[] = [];
  for (const [name, size] of units) {
    const n = Math.floor(rest / size);
    rest -= n * size;
    if (n) parts.push(`${n} ${name}${n === 1 ? '' : 's'}`);
  }
  return parts.slice(0, 3).join(', ') || 'just started';
};

app.get('/api/health', async (_req, res) => {
  // A quick round trip proves the database is reachable, not just the process.
  let database: { status: string; responseTime?: string; error?: string };
  const t = Date.now();
  try {
    await AppDataSource.query('SELECT 1');
    database = { status: 'connected', responseTime: `${Date.now() - t} ms` };
  } catch (err) {
    database = { status: 'unreachable', error: (err as Error).message };
  }
  const healthy = database.status === 'connected';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    message: healthy ? 'Oaken API is running normally' : 'Oaken API is running but cannot reach the database',
    uptime: humanDuration(process.uptime()),
    runningSince: startedAt.toUTCString(),
    database,
    environment: process.env.NODE_ENV ?? 'development',
    checkedAt: new Date().toUTCString(),
  });
});

app.use('/api', publicRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/auth', auditTrail, authRoutes);
app.use('/api/admin', auditTrail, adminRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ status: false, message: 'Not found' });
});
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      LogService.system('server.started', 'API started', 'info', { node: process.version, env: process.env.NODE_ENV ?? 'development' });
    });

    // Keep the activity log from growing forever.
    LogService.prune().catch(() => {});
    setInterval(() => LogService.prune().catch(() => {}), 24 * 3600e3).unref();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit the process on failure
  }
};

startServer();
