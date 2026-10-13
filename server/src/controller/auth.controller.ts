import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { authConfig } from '../config/auth';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { HttpError, str } from '../helpers/http';
import { LogService, requestContext } from '../services/LogService';

const publicUser = (user: User) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});

const signToken = (user: User) =>
  jwt.sign({ id: user.id }, authConfig.JWT_SECRET, {
    expiresIn: authConfig.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });

export const login = async (req: Request, res: Response) => {
  const email = str(req.body.email).toLowerCase();
  const password = str(req.body.password);

  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: { email },
  });

  // Same message for unknown user and bad password to avoid account probing.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    LogService.record({
      ...requestContext(req),
      category: 'security',
      action: 'auth.login_failed',
      level: 'warning',
      message: `Failed sign-in attempt for ${email}`,
      meta: { reason: user ? 'wrong password' : 'unknown email' },
    });
    throw new HttpError(401, 'Invalid email or password');
  }

  LogService.record({
    ...requestContext(req),
    actor: { type: 'admin', id: user.id, email: user.email },
    category: 'auth',
    action: 'auth.login',
    message: 'Signed in',
  });

  res.json({
    status: true,
    message: 'Login successful',
    token: signToken(user),
    user: publicUser(user),
  });
};

export const me = async (req: Request, res: Response) => {
  res.json({ status: true, user: publicUser(req.user!) });
};

export const changePassword = async (req: Request, res: Response) => {
  const current = str(req.body.currentPassword);
  const next = str(req.body.newPassword);
  const user = req.user!;

  if (next.length < 8) {
    throw new HttpError(400, 'New password must be at least 8 characters');
  }
  if (!(await bcrypt.compare(current, user.password))) {
    throw new HttpError(400, 'Current password is incorrect');
  }

  user.password = await bcrypt.hash(next, 10);
  await AppDataSource.getRepository(User).save(user);
  res.json({ status: true, message: 'Password updated' });
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await AppDataSource.getRepository(User).find({
    order: { createdAt: 'ASC' },
  });
  res.json({ status: true, data: users.map(publicUser) });
};

export const createUser = async (req: Request, res: Response) => {
  const email = str(req.body.email).toLowerCase();
  const password = str(req.body.password);
  const username = str(req.body.username) || null;

  if (!email || password.length < 8) {
    throw new HttpError(400, 'Email and a password of 8+ characters are required');
  }

  const repo = AppDataSource.getRepository(User);
  if (await repo.findOneBy({ email })) {
    throw new HttpError(400, 'A user with that email already exists');
  }

  const user = await repo.save(
    repo.create({
      email,
      username: username as string,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    })
  );
  res.locals.audit = { id: user.id, label: user.email };
  res.status(201).json({ status: true, data: publicUser(user) });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (id === req.user!.id) {
    throw new HttpError(400, "You can't delete your own account");
  }
  const target = await AppDataSource.getRepository(User).findOneBy({ id });
  res.locals.audit = { id, label: target?.email };
  await AppDataSource.getRepository(User).delete(id);
  res.json({ status: true, message: 'User removed' });
};
