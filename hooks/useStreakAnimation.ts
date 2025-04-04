import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useStreakAnimation = (streakLength: number) => {
  const opacityAnims = useRef(Array(streakLength).fill(0).map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(Array(streakLength).fill(0).map(() => new Animated.Value(1))).current;
  const lineWidthAnims = useRef(Array(streakLength).fill(0).map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset all animations
      for (let i = 0; i < streakLength; i++) {
        opacityAnims[i].setValue(0);
        lineWidthAnims[i].setValue(0);
      }

      const animations = Array(streakLength).fill(0).map((_, index) => {
        return Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(opacityAnims[index], {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(lineWidthAnims[index], {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            })
          ])
        ]);
      });

      Animated.stagger(100, animations).start(() => {
        setTimeout(startAnimation, 2000);
      });
    };

    startAnimation();

    return () => {
      for (let i = 0; i < streakLength; i++) {
        opacityAnims[i].stopAnimation();
        lineWidthAnims[i].stopAnimation();
      }
    };
  }, [streakLength, opacityAnims, lineWidthAnims]);

  return {
    opacityAnims,
    scaleAnims,
    lineWidthAnims,
  };
}; 