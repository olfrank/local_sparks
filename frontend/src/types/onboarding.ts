export type OnboardingSignupPayload = {
  contactName: string;
  businessName: string;
  whatsappNumber: string;
  alertChannel: string;
  jobValueLow: number;
  jobValueHigh: number;
};

export type OnboardingSignupResponse = {
  success: boolean;
  customerId?: string;
  forwardingCode?: string;
  forwardingNumber?: string;
  deactivationCode?: string;
  error?: string;
};

export type VerifyOnboardingPayload = {
  customerId?: string;
};

export type OnboardingStatusResponse = {
  status?: string;
};

export type VipNumber = {
  number: string;
  label: string;
};

export type SaveVipNumbersPayload = {
  customerId?: string;
  vipNumbers: VipNumber[];
};
