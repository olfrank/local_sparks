const WHATSAPP_FALLBACK_URL = 'https://wa.me/447901837771';

function normaliseWhatsAppUrl(value, fallback = WHATSAPP_FALLBACK_URL) {
  const raw = (value || '').trim();

  if (!raw) return fallback;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('wa.me/')) return `https://${raw}`;

  const stripped = raw.replace(/[\s+()[\]{}.-]/g, '');
  const digits = stripped.replace(/\D/g, '');

  if (!digits) return fallback;
  return `https://wa.me/${digits}`;
}

export const DEMO_API_BASE =
  process.env.REACT_APP_DEMO_API_URL || 'https://callguard-server.onrender.com';

export const API_BASE =
  process.env.REACT_APP_API_URL || 'https://api.callguard360.com';

export const SUPPORT_WHATSAPP_URL = normaliseWhatsAppUrl(
  process.env.REACT_APP_SUPPORT_WHATSAPP,
);

export const OLLIE_WHATSAPP_URL = normaliseWhatsAppUrl(
  process.env.REACT_APP_OLLIE_WHATSAPP,
);
