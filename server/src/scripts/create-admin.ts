/**
 * Creates (or resets the password of) a CMS admin.
 *
 *   npm run create-admin -- you@example.com "a-strong-password"
 *
 * Falls back to ADMIN_EMAIL / ADMIN_PASSWORD from .env. If no password is
 * given, a random one is generated and printed once.
 */
import 'reflect-metadata';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { AppDataSource, connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../entity/User';
import { LogService } from '../services/LogService';

const main = async () => {
  const [argEmail, argPassword] = process.argv.slice(2);
  const email = (argEmail || process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password =
    argPassword || process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');

  if (!email) {
    throw new Error('Usage: npm run create-admin -- <email> [password]');
  }
  if (password.length < 8) throw new Error('Password must be at least 8 characters');

  await connectDatabase();
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOneBy({ email });
  const hashed = await bcrypt.hash(password, 10);

  if (existing) {
    existing.password = hashed;
    existing.role = 'admin';
    await repo.save(existing);
    console.log(`✅ Password reset for ${email}`);
  } else {
    await repo.save(repo.create({ email, password: hashed, role: 'admin' }));
    console.log(`✅ Admin created: ${email}`);
  }

  LogService.record({
    category: 'users',
    action: existing ? 'user.password_reset' : 'user.created',
    message: existing ? `Password reset for ${email} from the command line` : `Admin ${email} created from the command line`,
    actor: { type: 'system' },
  });
  await new Promise((r) => setTimeout(r, 500));

  if (!argPassword && !process.env.ADMIN_PASSWORD) {
    console.log(`🔑 Generated password (shown once): ${password}`);
  }
};

main()
  .catch((err) => {
    console.error('❌', err.message);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
