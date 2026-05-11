const ORIGINAL_ENV = process.env;

function loadConfig(env = {}) {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    REACT_APP_SUPPORT_WHATSAPP: undefined,
    REACT_APP_OLLIE_WHATSAPP: undefined,
    ...env,
  };
  return require('./config');
}

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.resetModules();
});

test('WhatsApp config falls back when env values are empty', () => {
  const config = loadConfig({
    REACT_APP_SUPPORT_WHATSAPP: '',
    REACT_APP_OLLIE_WHATSAPP: '',
  });

  expect(config.SUPPORT_WHATSAPP_URL).toBe('https://wa.me/447901837771');
  expect(config.OLLIE_WHATSAPP_URL).toBe('https://wa.me/447901837771');
});

test('WhatsApp config keeps full URLs unchanged', () => {
  const config = loadConfig({
    REACT_APP_SUPPORT_WHATSAPP: 'https://wa.me/441234567890',
    REACT_APP_OLLIE_WHATSAPP: 'http://example.com/chat',
  });

  expect(config.SUPPORT_WHATSAPP_URL).toBe('https://wa.me/441234567890');
  expect(config.OLLIE_WHATSAPP_URL).toBe('http://example.com/chat');
});

test('WhatsApp config prefixes wa.me values', () => {
  const config = loadConfig({
    REACT_APP_SUPPORT_WHATSAPP: 'wa.me/447901837771',
  });

  expect(config.SUPPORT_WHATSAPP_URL).toBe('https://wa.me/447901837771');
});

test('WhatsApp config normalises phone numbers to wa.me URLs', () => {
  const config = loadConfig({
    REACT_APP_SUPPORT_WHATSAPP: '+44 7901-837.771',
    REACT_APP_OLLIE_WHATSAPP: '447901837771',
  });

  expect(config.SUPPORT_WHATSAPP_URL).toBe('https://wa.me/447901837771');
  expect(config.OLLIE_WHATSAPP_URL).toBe('https://wa.me/447901837771');
});

test('WhatsApp config falls back when no digits remain', () => {
  const config = loadConfig({
    REACT_APP_SUPPORT_WHATSAPP: 'not a phone number',
  });

  expect(config.SUPPORT_WHATSAPP_URL).toBe('https://wa.me/447901837771');
});
