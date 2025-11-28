// src/common/response/response.helper.ts
export function successResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return {
    message,
    statusCode,
    data,
  };
}
