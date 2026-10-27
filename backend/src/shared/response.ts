export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
  errors?: any;
}

export function successResponse<T>(data: T, message?: string, meta?: Record<string, any>): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function errorResponse(message: string, errors?: any): ApiResponse<null> {
  return {
    success: false,
    message,
    errors,
  };
}
