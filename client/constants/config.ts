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

export const baseUrl = (config.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
