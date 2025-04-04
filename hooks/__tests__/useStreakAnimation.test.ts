import { renderHook } from '@testing-library/react-hooks';
import { Animated } from 'react-native';
import { useStreakAnimation } from '../useStreakAnimation';

// Mock Animated.Value
const mockAnimatedValue = {
  setValue: jest.fn(),
  stopAnimation: jest.fn(),
};

jest.mock('react-native', () => ({
  Animated: {
    Value: jest.fn(() => mockAnimatedValue),
    sequence: jest.fn(() => ({
      start: jest.fn(),
    })),
    parallel: jest.fn(() => ({
      start: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    stagger: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
  },
}));

describe('useStreakAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it('should initialize animation values correctly', () => {
    const streakLength = 3;
    const { result } = renderHook(() => useStreakAnimation(streakLength));

    expect(result.current.opacityAnims).toHaveLength(streakLength);
    expect(result.current.scaleAnims).toHaveLength(streakLength);
    expect(result.current.lineWidthAnims).toHaveLength(streakLength);
  });

  it('should start animation sequence', () => {
    const streakLength = 2;
    renderHook(() => useStreakAnimation(streakLength));

    expect(Animated.stagger).toHaveBeenCalled();
    expect(mockAnimatedValue.setValue).toHaveBeenCalledTimes(streakLength * 2); // opacity and lineWidth
  });

  it('should clean up animations on unmount', () => {
    const streakLength = 2;
    const { unmount } = renderHook(() => useStreakAnimation(streakLength));

    unmount();

    expect(mockAnimatedValue.stopAnimation).toHaveBeenCalled();
  });

  it('should handle different streak lengths', () => {
    const lengths = [1, 4, 7, 9];
    
    lengths.forEach(length => {
      const { result } = renderHook(() => useStreakAnimation(length));
      expect(result.current.opacityAnims).toHaveLength(length);
      expect(result.current.scaleAnims).toHaveLength(length);
      expect(result.current.lineWidthAnims).toHaveLength(length);
    });
  });
}); 