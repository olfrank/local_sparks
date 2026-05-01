import { API_BASE, request } from './client';

// POST /api/callback-request
// Stores a callback request from the landing page contact section.
export async function requestCallback({ phone }) {
  await request(`${API_BASE}/api/callback-request`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}
