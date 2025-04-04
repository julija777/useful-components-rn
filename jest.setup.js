import '@testing-library/jest-native/extend-expect';

// Mock React Native's Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Animated = {
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      stopAnimation: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn(),
    })),
    parallel: jest.fn(() => ({
      start: jest.fn(),
    })),
    stagger: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
  };

  return RN;
});

// Mock timers
jest.useFakeTimers();

// Mock console.error to avoid React Native warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Please update the following components:') ||
    args[0].includes('Warning:')
  ) {
    return;
  }
  originalConsoleError(...args);
}; 