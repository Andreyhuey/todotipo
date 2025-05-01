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
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.responseData = responseData;
    this.errors = errors;
  }
}
