// Central API base URLs — each maps to a separate backend
export { DEMO_API_BASE, API_BASE } from '../config';

import type { ApiErrorData, ApiResponse } from '../types/api';

const DEFAULT_TIMEOUT_MS = 15000;

export type RequestOptions = RequestInit & {
  timeout?: number;
};

function getErrorMessage(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'error' in data) {
    const error = (data as { error?: unknown }).error;
    return error ? String(error) : undefined;
  }
  return undefined;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request<TData = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<TData>> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        throw new ApiError('Invalid response from server', res.status, null);
      }
    }

    if (!res.ok) {
      throw new ApiError(
        getErrorMessage(data) || `Request failed (${res.status})`,
        res.status,
        data,
      );
    }

    return { status: res.status, data: data as TData };
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as { name?: string }).name === 'AbortError') throw new ApiError('Request timed out — try again', 0, null);
    if (err instanceof ApiError) throw err;
    throw new ApiError('Network error — check your connection', 0, null);
  }
}
