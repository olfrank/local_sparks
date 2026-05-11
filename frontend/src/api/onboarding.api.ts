import { DEMO_API_BASE, ApiError, request } from './client';
import type {
  OnboardingSignupPayload,
  OnboardingSignupResponse,
  OnboardingStatusResponse,
  SaveVipNumbersPayload,
  VerifyOnboardingPayload,
} from '../types/onboarding';

// POST /api/onboarding/signup
// Returns provisioning data: { success, customerId, forwardingCode, forwardingNumber, ... }
export async function signupOnboarding({
  contactName,
  businessName,
  whatsappNumber,
  alertChannel,
  jobValueLow,
  jobValueHigh,
}: OnboardingSignupPayload): Promise<OnboardingSignupResponse> {
  const { data } = await request<OnboardingSignupResponse>(`${DEMO_API_BASE}/api/onboarding/signup`, {
    method: 'POST',
    body: JSON.stringify({
      contactName,
      businessName,
      whatsappNumber,
      alertChannel,
      jobValueLow,
      jobValueHigh,
    }),
  });
  if (!data.success) {
    throw new ApiError(data.error || 'Signup failed', 200, data);
  }
  return data;
}

// POST /api/onboarding/verify
// Triggers the test call. Non-fatal — best-effort.
export async function verifyOnboarding({ customerId }: VerifyOnboardingPayload): Promise<void> {
  await request(`${DEMO_API_BASE}/api/onboarding/verify`, {
    method: 'POST',
    body: JSON.stringify({ customerId }),
  });
}

// GET /api/onboarding/status/:customerId
// Returns { status, ... } — poll until status === 'verified'
export async function getOnboardingStatus(customerId?: string): Promise<OnboardingStatusResponse> {
  const { data } = await request<OnboardingStatusResponse>(`${DEMO_API_BASE}/api/onboarding/status/${customerId}`);
  return data;
}

// POST /api/onboarding/vip
// Saves VIP numbers. Best-effort — caller should catch and ignore errors.
export async function saveVipNumbers({ customerId, vipNumbers }: SaveVipNumbersPayload): Promise<void> {
  await request(`${DEMO_API_BASE}/api/onboarding/vip`, {
    method: 'POST',
    body: JSON.stringify({ customerId, vipNumbers }),
  });
}
