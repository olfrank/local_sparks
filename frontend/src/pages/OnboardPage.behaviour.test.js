import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: null }),
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock('../api/onboarding.api', () => ({
  signupOnboarding: jest.fn(),
  verifyOnboarding: jest.fn(),
  getOnboardingStatus: jest.fn(),
  saveVipNumbers: jest.fn(),
}));

function renderPage() {
  const OnboardPage = require('./OnboardPage').default;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<OnboardPage />);
  });

  return {
    container,
    cleanup: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

function inputByPlaceholder(container, placeholder) {
  return container.querySelector(`input[placeholder="${placeholder}"]`);
}

function buttonByText(container, text) {
  return Array.from(container.querySelectorAll('button'))
    .find((button) => button.textContent.includes(text));
}

function changeInput(input, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function click(element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
  });
}

afterEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  document.body.innerHTML = '';
});

test('OnboardPage renders the onboarding intake form', () => {
  const { container, cleanup } = renderPage();

  expect(container.textContent).toContain("You're 2 minutes away from catching every missed call");
  expect(inputByPlaceholder(container, 'Your first name')).not.toBeNull();
  expect(inputByPlaceholder(container, 'Business name (e.g. Smith Electrical)')).not.toBeNull();
  expect(inputByPlaceholder(container, 'Your mobile number (07xxx xxx xxx)')).not.toBeNull();

  cleanup();
});

test('OnboardPage shows visible validation for an invalid UK mobile number', async () => {
  const { signupOnboarding } = require('../api/onboarding.api');
  const { container, cleanup } = renderPage();

  changeInput(inputByPlaceholder(container, 'Your first name'), 'Ollie');
  changeInput(inputByPlaceholder(container, 'Business name (e.g. Smith Electrical)'), 'CallGuard');
  changeInput(inputByPlaceholder(container, 'Your mobile number (07xxx xxx xxx)'), '123');
  await click(buttonByText(container, 'Set up my account'));

  expect(container.textContent).toContain('Please enter a valid UK mobile number (e.g. 07911 123 456)');
  expect(signupOnboarding).not.toHaveBeenCalled();

  cleanup();
});

test('OnboardPage advances to activation flow with valid intake data', async () => {
  const { signupOnboarding } = require('../api/onboarding.api');
  signupOnboarding.mockResolvedValue({
    success: true,
    customerId: 'customer_123',
    forwardingNumber: '+441234567890',
    forwardingCode: '**61*+441234567890#',
    deactivationCode: '##61#',
  });
  const { container, cleanup } = renderPage();

  changeInput(inputByPlaceholder(container, 'Your first name'), 'Ollie');
  changeInput(inputByPlaceholder(container, 'Business name (e.g. Smith Electrical)'), 'CallGuard');
  changeInput(inputByPlaceholder(container, 'Your mobile number (07xxx xxx xxx)'), '07901 837 771');
  await click(buttonByText(container, 'Set up my account'));

  expect(container.textContent).toContain('Activate missed call forwarding');
  expect(signupOnboarding).toHaveBeenCalledWith({
    contactName: 'Ollie',
    businessName: 'CallGuard',
    whatsappNumber: '07901 837 771',
    alertChannel: 'whatsapp',
    jobValueLow: 150,
    jobValueHigh: 300,
  });

  cleanup();
});
