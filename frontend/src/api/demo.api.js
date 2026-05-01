import { DEMO_API_BASE, ApiError, request } from './client';

// POST /api/demo/start
// Returns { success, demoId }
// Throws ApiError — caller should handle status 409 separately
export async function startDemo({ contactName, businessName, mobileNumber }) {
  const { data } = await request(`${DEMO_API_BASE}/api/demo/start`, {
    method: 'POST',
    body: JSON.stringify({ contactName, businessName, mobileNumber }),
  });
  return data;
}

// GET /api/demo/status/:demoId
// Returns { status, customerReply, reply, urgency, postcode, summary, phoneNumber, ... }
export async function getDemoStatus(demoId) {
  const { data } = await request(`${DEMO_API_BASE}/api/demo/status/${demoId}`);
  return data;
}

export { ApiError };
