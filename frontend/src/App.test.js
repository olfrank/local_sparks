import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

jest.mock('react-router-dom', () => {
  const React = require('react');

  const getPath = () => globalThis.__CALLGUARD_TEST_PATH__ || '/';

  return {
    BrowserRouter: ({ children }) => children,
    MemoryRouter: ({ children, initialEntries }) => {
      globalThis.__CALLGUARD_TEST_PATH__ = initialEntries?.[0] || '/';
      return children;
    },
    Routes: ({ children }) => {
      const currentPath = getPath();
      const routes = React.Children.toArray(children);
      const matchingRoute = routes.find((route) => route.props.path === currentPath);
      const fallbackRoute = routes.find((route) => route.props.path === '*');

      return matchingRoute?.props.element || fallbackRoute?.props.element || null;
    },
    Route: () => null,
    Navigate: ({ to }) => <span data-testid="navigate" data-to={to} />,
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: getPath() }),
  };
}, { virtual: true });

jest.mock('./api/demo.api', () => ({
  startDemo: jest.fn(),
  getDemoStatus: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message, status, data) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  },
}));

jest.mock('./api/onboarding.api', () => ({
  signupOnboarding: jest.fn(),
  verifyOnboarding: jest.fn(),
  getOnboardingStatus: jest.fn(),
  saveVipNumbers: jest.fn(),
}));

jest.mock('./api/contact.api', () => ({
  requestCallback: jest.fn(),
}));

jest.mock('./components/sections/BusyMomentSection', () => () => null);
jest.mock('./components/sections/RevenueLeakCalculator', () => () => null);
jest.mock('./components/sections/SystemFlowSection', () => () => null);
jest.mock('./components/sections/FinalCTASection', () => () => null);
jest.mock('./components/sections/revprotect/RevProtectGuaranteeSection', () => () => null);
jest.mock('./components/sections/PricingSection', () => () => null);
jest.mock('./components/sections/revprotect/RevProtectFAQSection', () => () => null);
jest.mock('./components/sections/ClosingCTASection', () => () => null);

function renderWithRouter(ui, initialEntries = ['/']) {
  const { MemoryRouter } = require('react-router-dom');
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>,
    );
  });

  return {
    container,
    cleanup: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

test('App renders without crashing', () => {
  const App = require('./App').default;
  const { cleanup } = renderWithRouter(<App />);

  cleanup();
});

test('home page renders stable visible text', () => {
  const App = require('./App').default;
  const { container, cleanup } = renderWithRouter(<App />, ['/']);

  expect(container.textContent).toContain('Miss the call.');
  expect(container.textContent).toContain('Win the job anyway.');

  cleanup();
});

test('Demo page renders without hitting the live backend', () => {
  const DemoPage = require('./pages/DemoPage').default;
  const { startDemo, getDemoStatus } = require('./api/demo.api');
  const { container, cleanup } = renderWithRouter(<DemoPage />);

  expect(container.textContent).toContain('Try it with your real number');
  expect(startDemo).not.toHaveBeenCalled();
  expect(getDemoStatus).not.toHaveBeenCalled();

  cleanup();
});

test('Onboard page renders without hitting the live backend', () => {
  const OnboardPage = require('./pages/OnboardPage').default;
  const onboardingApi = require('./api/onboarding.api');
  const { container, cleanup } = renderWithRouter(<OnboardPage />);

  expect(container.textContent).toContain("You're 2 minutes away from catching every missed call");
  expect(onboardingApi.signupOnboarding).not.toHaveBeenCalled();
  expect(onboardingApi.verifyOnboarding).not.toHaveBeenCalled();
  expect(onboardingApi.getOnboardingStatus).not.toHaveBeenCalled();
  expect(onboardingApi.saveVipNumbers).not.toHaveBeenCalled();

  cleanup();
});
