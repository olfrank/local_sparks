import { ApiError, request } from './client';

afterEach(() => {
  jest.restoreAllMocks();
});

test('request returns parsed JSON data for successful responses', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
  });

  await expect(request('/api/test')).resolves.toEqual({
    status: 200,
    data: { success: true },
  });
  expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
    headers: { 'Content-Type': 'application/json' },
  }));
});

test('request throws ApiError with server error messages for failed responses', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 409,
    text: jest.fn().mockResolvedValue(JSON.stringify({ error: 'Already running' })),
  });

  await expect(request('/api/test')).rejects.toMatchObject({
    name: 'ApiError',
    message: 'Already running',
    status: 409,
    data: { error: 'Already running' },
  });
});

test('request throws ApiError for invalid JSON responses', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: jest.fn().mockResolvedValue('not json'),
  });

  await expect(request('/api/test')).rejects.toBeInstanceOf(ApiError);
  await expect(request('/api/test')).rejects.toMatchObject({
    message: 'Invalid response from server',
    status: 200,
  });
});

test('request wraps network failures in ApiError', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('offline'));

  await expect(request('/api/test')).rejects.toMatchObject({
    name: 'ApiError',
    message: 'Network error — check your connection',
    status: 0,
  });
});
