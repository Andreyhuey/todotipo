'use client';

import { apiBaseUrl } from '@/constants/config';

const TOKEN_KEY = 'oaken_admin_token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
  }
}

/** Tells the Next.js site to drop its cached CMS content. */
const revalidateSite = () => {
  const token = tokenStore.get();
  if (!token) return;
  fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
};

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const token = tokenStore.get();
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(`${apiBaseUrl()}/api${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && !path.startsWith('/auth/login')) {
    tokenStore.clear();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }
  if (!res.ok) {
    throw new AdminApiError(data.message || `Request failed (${res.status})`, res.status, data);
  }

  if (method !== 'GET' && path.startsWith('/admin')) revalidateSite();
  return data as T;
}

export const adminApi = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),

  /** Uploads files to the media library with progress reporting. */
  upload(files: File[], folder: string, onProgress?: (pct: number) => void) {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    form.append('folder', folder);

    return new Promise<{ data: import('@/types/cms').Media[] }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiBaseUrl()}/api/admin/media`);
      const token = tokenStore.get();
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        const data = (() => {
          try {
            return JSON.parse(xhr.responseText);
          } catch {
            return {};
          }
        })();
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new AdminApiError(data.message || 'Upload failed', xhr.status, data));
      };
      xhr.onerror = () => reject(new AdminApiError('Network error during upload', 0));
      xhr.send(form);
    });
  },
};
