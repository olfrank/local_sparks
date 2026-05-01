// Central API base URLs — each maps to a separate backend
export const DEMO_API_BASE =
  process.env.REACT_APP_DEMO_API_URL || 'https://callguard-server.onrender.com';

export const API_BASE =
  process.env.REACT_APP_API_URL || 'https://api.callguard360.com';

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request(url, options = {}) {
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
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new ApiError('Invalid response from server', res.status, null);
      }
    }

    if (!res.ok) {
      throw new ApiError(
        data?.error || `Request failed (${res.status})`,
        res.status,
        data,
      );
    }

    return { status: res.status, data };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new ApiError('Request timed out — try again', 0, null);
    if (err instanceof ApiError) throw err;
    throw new ApiError('Network error — check your connection', 0, null);
  }
}
