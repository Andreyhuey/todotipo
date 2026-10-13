import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { apiBaseUrl } from '@/constants/config';
import { CMS_TAG } from '@/lib/cms';

/**
 * Called by the admin after each save so changes appear on the public site
 * immediately. The admin's own JWT is verified against the API.
 */
export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ ok: false }, { status: 401 });

  const res = await fetch(`${apiBaseUrl()}/api/auth/me`, {
    headers: { Authorization: auth },
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ ok: false }, { status: 401 });

  revalidateTag(CMS_TAG);
  return NextResponse.json({ ok: true });
}
