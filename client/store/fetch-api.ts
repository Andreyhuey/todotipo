import { ApiError } from "@/handler/error";
import { config } from "@/constants/config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const fetchUrl = (path: string) => `${config.API_URL}/api${path}`;

const fetchApi = async <T>(
  method: HttpMethod,
  url: string,
  data: T | undefined
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
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
      console.log(`${method} Error at ${url}:`, responseData);
      throw new ApiError(
        responseData.message || "Unknown error",
        response.status,
        responseData
      );
    }

    return responseData;
  } catch (error) {
    console.log("Request failed:", error);
    throw new ApiError("Request failed", 500, error);
  }
};

export const useApi = {
  async post<T>(url: string, data: T) {
    return await fetchApi("POST", url, data);
  },
  async get(url: string) {
    return fetchApi("GET", url, undefined);
  },
  async put<T>(url: string, data: T) {
    return await fetchApi("PUT", url, data);
  },
  async delete(url: string) {
    return await fetchApi("DELETE", url, undefined);
  },
};
