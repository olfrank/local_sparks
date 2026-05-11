export type StartDemoPayload = {
  contactName: string;
  businessName: string;
  mobileNumber: string;
};

export type StartDemoResponse = {
  success: boolean;
  demoId?: string;
  error?: string;
};

export type DemoStatusResponse = {
  status?: string;
  alert?: DemoAlert;
  customerReply?: string;
  reply?: string;
  urgency?: string;
  postcode?: string;
  summary?: string;
  phoneNumber?: string;
};

export type DemoAlert = {
  urgency?: string;
  postcode?: string;
  summary?: string;
  phoneNumber?: string;
};
