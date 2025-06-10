import { config } from '@/constants/config';
import { isProduction } from '@/lib/check-env';

export class ApiError<T = { [key: string]: unknown }> extends Error {
  statusCode?: number;
  responseData?: T;
  errors?: Record<string, string | string[]>;

  constructor(
    message: string,
    statusCode?: number,
    responseData?: T,
    errors?: Record<string, string | string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.responseData = responseData;
    this.errors = errors;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const fetchUrl = (path: string) =>
  `${isProduction() ? config.API_URL : config.LOCAL_HOST_API_URL}/api${path}`;

const fetchApi = async <T>(
  method: HttpMethod,
  url: string,
  data: T | undefined
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const body = data ? JSON.stringify(data) : undefined;

  try {
    const response = await fetch(fetchUrl(url), {
      method,
      headers,
      body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(
        responseData.message || 'Unknown error',
        response.status,
        responseData
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Unexpected error', 500);
  }
};

export const useApi = {
  async post<T>(url: string, data: T) {
    return await fetchApi('POST', url, data);
  },
  async get(url: string) {
    return fetchApi('GET', url, undefined);
  },
  async put<T>(url: string, data: T) {
    return await fetchApi('PUT', url, data);
  },
  async delete(url: string) {
    return await fetchApi('DELETE', url, undefined);
  },
};
