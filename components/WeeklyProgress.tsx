import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import DayIndicator, { DayVariant } from './DayIndicator';

interface WeeklyProgressProps {
  streak: string[];
  currentDate?: string;
}

// Using three-letter abbreviations to avoid confusion
const DAYS_OF_WEEK = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ 
  streak, 
  currentDate = new Date().toISOString(),
}) => {
  // Animation values for each day
  const opacityAnims = useRef(DAYS_OF_WEEK.map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(DAYS_OF_WEEK.map(() => new Animated.Value(1))).current;
  const lineAnims = useRef(DAYS_OF_WEEK.map(() => new Animated.Value(0))).current;

  // Determine if this is a perfect week
  const isPerfectWeek = streak.length === 7;

  // Animate the appearance of days in a loop
  useEffect(() => {
    const startAnimation = () => {
      // Reset all animations
      DAYS_OF_WEEK.forEach((_, index) => {
        opacityAnims[index].setValue(0);
        lineAnims[index].setValue(0);
      });

      const animations = streak.map((date, index) => {
        const dayIndex = new Date(date).getDay();
        return Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(opacityAnims[dayIndex], {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(lineAnims[dayIndex], {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            })
          ])
        ]);
      });

      Animated.stagger(100, animations).start(() => {
        // After animation completes, start again after a delay
        setTimeout(startAnimation, 2000);
      });
    };

    startAnimation();

    return () => {
      // Cleanup
      DAYS_OF_WEEK.forEach((_, index) => {
        opacityAnims[index].stopAnimation();
        lineAnims[index].stopAnimation();
      });
    };
  }, [streak, opacityAnims, lineAnims]);

  // Animate the last day
  useEffect(() => {
    if (streak.length === 0) return;
    
    const lastDate = new Date(streak[streak.length - 1]);
    const lastDayIndex = lastDate.getDay();
    const lastDayAnim = scaleAnims[lastDayIndex];
    
    const pulseAnimation = Animated.sequence([
      Animated.timing(lastDayAnim, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(lastDayAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
    
    const loopAnimation = Animated.loop(pulseAnimation);
    loopAnimation.start();
    
    return () => {
      loopAnimation.stop();
    };
  }, [streak, scaleAnims]);

  // Get the variant for each day
  const getDayVariant = (index: number): DayVariant => {
    if (isPerfectWeek) {
      const isLastDay = streak.some(date => new Date(date).getDay() === index) && 
                       index === new Date(streak[streak.length - 1]).getDay();
      return isLastDay ? 'flameHighlighted' : 'flame';
    }
    
    const isLastDay = streak.some(date => new Date(date).getDay() === index) && 
                     index === new Date(streak[streak.length - 1]).getDay();
    return isLastDay ? 'checkHighlighted' : 'check';
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysRow}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text key={`day-${day}`} style={styles.dayText}>
            {day}
          </Text>
        ))}
      </View>
      
      <View style={styles.circlesRow}>
        {DAYS_OF_WEEK.map((_, index) => {
          const variant = getDayVariant(index);
          const isInStreak = streak.some(date => new Date(date).getDay() === index);
          
          return (
            <View key={`circle-${index}`} style={styles.circleWrapper}>
              {isPerfectWeek && isInStreak && (
                <Animated.View 
                  style={[
                    styles.backgroundLine,
                    {
                      width: lineAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              )}
              <Animated.View 
                style={[
                  styles.circleContainer,
                  { 
                    transform: [{ scale: scaleAnims[index] }],
                    opacity: isInStreak ? opacityAnims[index] : 0.7
                  }
                ]}
              >
                {isInStreak && <DayIndicator variant={variant} />}
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    width: 40,
    textAlign: 'center',
  },
  circlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLine: {
    position: 'absolute',
    height: 40,
    backgroundColor: 'white',
    top: 0,
    left: 0,
    zIndex: -1,
    borderRadius: 20,
  },
});

export default WeeklyProgress;

 