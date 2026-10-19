export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  LOCAL_HOST_API_URL: process.env.NEXT_PUBLIC_LOCAL_HOST_API_URL,
};

/** API origin: the deployed API in production, localhost in development. */
export const apiBaseUrl = () =>
  (process.env.NODE_ENV === 'production'
    ? config.API_URL
    : config.LOCAL_HOST_API_URL || config.API_URL
  )?.replace(/\/$/, '') ?? '';

/**
 * Where Oaken's routes are mounted on that origin. The API runs inside the
 * portfolio server (api.andreyhuey.dev) at /api/oaken; set
 * NEXT_PUBLIC_API_PREFIX=/api to talk to a standalone Oaken API instead.
 */
export const API_PREFIX = (process.env.NEXT_PUBLIC_API_PREFIX || '/api/oaken').replace(/\/$/, '');

/** Full URL of an API route, e.g. apiUrl('/products') → https://api.andreyhuey.dev/api/oaken/products. */
export const apiUrl = (path: string) => `${apiBaseUrl()}${API_PREFIX}${path}`;

export const baseUrl = (config.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
