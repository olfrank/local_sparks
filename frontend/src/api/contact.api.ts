import { API_BASE, request } from './client';
import type { CallbackRequestPayload } from '../types/api';

// POST /api/callback-request
// Stores a callback request from the landing page contact section.
export async function requestCallback({ phone }: CallbackRequestPayload): Promise<void> {
  await request(`${API_BASE}/api/callback-request`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}
