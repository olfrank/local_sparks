import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock('../api/demo.api', () => ({
  startDemo: jest.fn(),
  getDemoStatus: jest.fn(),
}));

function renderPage() {
  const DemoPage = require('./DemoPage').default;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<DemoPage />);
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

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

test('DemoPage renders the demo form', () => {
  const { container, cleanup } = renderPage();

  expect(container.textContent).toContain('Try it with your real number');
  expect(inputByPlaceholder(container, 'Your first name')).not.toBeNull();
  expect(inputByPlaceholder(container, 'e.g. Smith Electrical')).not.toBeNull();
  expect(inputByPlaceholder(container, '07xxx xxx xxx')).not.toBeNull();

  cleanup();
});

test('DemoPage shows visible validation for an invalid UK mobile number', async () => {
  const { startDemo } = require('../api/demo.api');
  const { container, cleanup } = renderPage();

  changeInput(inputByPlaceholder(container, 'Your first name'), 'Ollie');
  changeInput(inputByPlaceholder(container, 'e.g. Smith Electrical'), 'CallGuard');
  changeInput(inputByPlaceholder(container, '07xxx xxx xxx'), '123');
  await click(buttonByText(container, 'Try it with my number'));

  expect(container.textContent).toContain('Please enter a valid UK mobile number (e.g. 07911 123 456)');
  expect(startDemo).not.toHaveBeenCalled();

  cleanup();
});

test('DemoPage calls startDemo with form data and moves to waiting state on success', async () => {
  const { startDemo, getDemoStatus } = require('../api/demo.api');
  startDemo.mockResolvedValue({ success: true, demoId: 'demo_123' });
  getDemoStatus.mockResolvedValue({ status: 'waiting' });
  const { container, cleanup } = renderPage();

  changeInput(inputByPlaceholder(container, 'Your first name'), 'Ollie');
  changeInput(inputByPlaceholder(container, 'e.g. Smith Electrical'), 'CallGuard');
  changeInput(inputByPlaceholder(container, '07xxx xxx xxx'), '07901 837 771');
  await click(buttonByText(container, 'Try it with my number'));

  expect(startDemo).toHaveBeenCalledWith({
    contactName: 'Ollie',
    businessName: 'CallGuard',
    mobileNumber: '07901 837 771',
  });
  expect(container.textContent).toContain("Check your phone, you've just received an SMS.");

  cleanup();
});

test('DemoPage shows active demo conflict copy when startDemo rejects with status 409', async () => {
  const { startDemo } = require('../api/demo.api');
  const conflict = new Error('Conflict');
  conflict.status = 409;
  startDemo.mockRejectedValue(conflict);
  const { container, cleanup } = renderPage();

  changeInput(inputByPlaceholder(container, 'Your first name'), 'Ollie');
  changeInput(inputByPlaceholder(container, 'e.g. Smith Electrical'), 'CallGuard');
  changeInput(inputByPlaceholder(container, '07xxx xxx xxx'), '07901 837 771');
  await click(buttonByText(container, 'Try it with my number'));

  expect(container.textContent).toContain("Looks like you've already got a demo running, check your phone for the SMS");

  cleanup();
});
