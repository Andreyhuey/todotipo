import crypto from 'crypto';
import { Request } from 'express';
import { authConfig } from '../config/auth';

/** Signed token so unsubscribe links can't be forged for other addresses. */
export const unsubscribeToken = (email: string) =>
  crypto.createHmac('sha256', authConfig.JWT_SECRET).update(`unsubscribe:${email.toLowerCase()}`).digest('base64url').slice(0, 32);

export const isValidUnsubscribeToken = (email: string, token: string) => {
  const expected = Buffer.from(unsubscribeToken(email));
  const given = Buffer.from(token);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
};

/** Absolute unsubscribe URL on this API (behind the proxy, so honour X-Forwarded-Proto). */
export const unsubscribeUrl = (req: Request, email: string) =>
  `${req.protocol}://${req.get('host')}/api/mail/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`;

/** RFC 8058 one-click unsubscribe headers (required by Gmail/Yahoo for bulk mail). */
export const unsubscribeHeaders = (url: string, mailto?: string) => ({
  'List-Unsubscribe': mailto ? `<${url}>, <mailto:${mailto}?subject=unsubscribe>` : `<${url}>`,
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
});
