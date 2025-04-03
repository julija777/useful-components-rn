import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import DayIndicator, { DayVariant } from './DayIndicator';

interface WeeklyProgressProps {
  streak: string[];
  currentDate?: string;
  isPerfectWeek?: boolean;
}

// Using three-letter abbreviations to avoid confusion
const DAYS_OF_WEEK = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ 
  streak, 
  currentDate = new Date().toISOString(),
  isPerfectWeek = false
}) => {
  // Get the current day index (0-6)
  const currentDayIndex = useMemo(() => {
    return new Date(currentDate).getDay();
  }, [currentDate]);

  // Animation values for each day
  const scaleAnims = useRef(DAYS_OF_WEEK.map(() => new Animated.Value(1))).current;

  // Find the last day of the streak
  const lastStreakDayIndex = useMemo(() => {
    if (streak.length === 0) return -1;
    const lastStreakDate = new Date(streak[streak.length - 1]);
    return lastStreakDate.getDay();
  }, [streak]);

  // Animate only the last day of the streak
  useEffect(() => {
    if (lastStreakDayIndex === -1) return;

    const lastDayAnim = scaleAnims[lastStreakDayIndex];
    
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
  }, [lastStreakDayIndex, scaleAnims]);

  // Get the variant for each day
  const getDayVariant = (dayIndex: number): DayVariant => {
    const isCurrentDay = dayIndex === currentDayIndex;
    const isLastStreakDay = dayIndex === lastStreakDayIndex;
    
    // Check if this day is in the streak
    const isInStreak = streak.some(date => {
      const streakDate = new Date(date);
      return streakDate.getDay() === dayIndex;
    });

    if (isPerfectWeek) {
      return isLastStreakDay ? 'flameHighlighted' : 'flame';
    }
    
    if (isInStreak) {
      return isLastStreakDay ? 'checkHighlighted' : 'check';
    }

    return 'plain';
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
            <Animated.View 
              key={`circle-${index}`}
              style={[
                styles.circleContainer,
                { 
                  transform: [{ scale: scaleAnims[index] }],
                  opacity: isInStreak ? 1 : 0.7
                }
              ]}
            >
              <DayIndicator variant={variant} />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    width: '100%',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  dayText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    width: 40,
  },
  circlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  circleContainer: {
    alignItems: 'center',
  }
});

export default WeeklyProgress;

 