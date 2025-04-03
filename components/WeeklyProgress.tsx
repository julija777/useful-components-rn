import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import DayIndicator, { DayVariant } from './DayIndicator';

interface WeeklyProgressProps {
  streak: string[];
  currentDate?: string;
  isPerfectWeek?: boolean;
}

// Using three-letter abbreviations to avoid confusion
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  const perfectWeekAnim = useRef(new Animated.Value(0)).current;

  // Animate current day
  useEffect(() => {
    const currentDayAnim = scaleAnims[currentDayIndex];
    
    const pulseAnimation = Animated.sequence([
      Animated.timing(currentDayAnim, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(currentDayAnim, {
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
  }, [currentDayIndex, scaleAnims]);

  // Animate perfect week message
  useEffect(() => {
    if (isPerfectWeek) {
      Animated.timing(perfectWeekAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      perfectWeekAnim.setValue(0);
    }
  }, [isPerfectWeek, perfectWeekAnim]);

  // Get the variant for each day
  const getDayVariant = (dayIndex: number): DayVariant => {
    const isCurrentDay = dayIndex === currentDayIndex;
    
    // Check if this day is in the streak
    const isInStreak = streak.some(date => {
      const streakDate = new Date(date);
      return streakDate.getDay() === dayIndex;
    });

    if (isPerfectWeek) {
      return isCurrentDay ? 'flameHighlighted' : 'flame';
    }
    
    if (isInStreak) {
      return isCurrentDay ? 'checkHighlighted' : 'check';
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
          const isCurrentDay = index === currentDayIndex;
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
      
      {isPerfectWeek && (
        <Animated.View 
          style={[
            { 
              opacity: perfectWeekAnim,
              transform: [
                { 
                  translateY: perfectWeekAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }
              ]
            }
          ]}
        >
        </Animated.View>
      )}
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
  },
  perfectWeekContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 126, 95, 0.2)',
    borderRadius: 5,
  },
  perfectWeekText: {
    color: '#FF7E5F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeeklyProgress;

 