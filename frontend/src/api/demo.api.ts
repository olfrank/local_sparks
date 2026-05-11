import { DEMO_API_BASE, request } from './client';
import type { DemoStatusResponse, StartDemoPayload, StartDemoResponse } from '../types/demo';

// POST /api/demo/start
// Returns { success, demoId }
// Throws ApiError from the shared client — caller should handle status 409 separately
export async function startDemo({ contactName, businessName, mobileNumber }: StartDemoPayload): Promise<StartDemoResponse> {
  const { data } = await request<StartDemoResponse>(`${DEMO_API_BASE}/api/demo/start`, {
    method: 'POST',
    body: JSON.stringify({ contactName, businessName, mobileNumber }),
  });
  return data;
}

// GET /api/demo/status/:demoId
// Returns { status, customerReply, reply, urgency, postcode, summary, phoneNumber, ... }
export async function getDemoStatus(demoId: string): Promise<DemoStatusResponse> {
  const { data } = await request<DemoStatusResponse>(`${DEMO_API_BASE}/api/demo/status/${demoId}`);
  return data;
}
