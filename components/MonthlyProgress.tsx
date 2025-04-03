import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import DayIndicator, { DayVariant } from './DayIndicator';

interface MonthlyProgressProps {
  streak: string[];
  currentDate?: string;
}

const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 40) / 7; // 7 days in a week, 20px padding on each side

const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ 
  streak, 
  currentDate = new Date().toISOString(),
}) => {
  // Animation values for each day
  const opacityAnims = useRef(streak.map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(streak.map(() => new Animated.Value(1))).current;
  const lineWidthAnims = useRef(streak.map(() => new Animated.Value(0))).current;

  // Find perfect week days (every 7th day)
  const perfectWeekDays = useMemo(() => {
    return streak.map((date, index) => {
      const dayNumber = index + 1;
      return dayNumber % 7 === 0 ? dayNumber : null;
    }).filter(Boolean);
  }, [streak]);

  // Animate the appearance of days and connecting lines in a loop
  useEffect(() => {
    const startAnimation = () => {
      // Reset all animations
      streak.forEach((_, index) => {
        opacityAnims[index].setValue(0);
        lineWidthAnims[index].setValue(0);
      });

      const animations = streak.map((_, index) => {
        const isPerfectWeekDay = (index + 1) % 7 === 0;
        const delay = isPerfectWeekDay ? index * 200 : 0;

        return Animated.sequence([
          Animated.delay(delay),
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
        // After animation completes, start again after a delay
        setTimeout(startAnimation, 2000);
      });
    };

    startAnimation();

    return () => {
      // Cleanup
      streak.forEach((_, index) => {
        opacityAnims[index].stopAnimation();
        lineWidthAnims[index].stopAnimation();
      });
    };
  }, [streak, opacityAnims, lineWidthAnims]);

  // Animate the last perfect week day
  useEffect(() => {
    if (perfectWeekDays.length === 0) return;
    
    const lastPerfectWeekIndex = (perfectWeekDays[perfectWeekDays.length - 1] ?? 0) - 1;
    const lastDayAnim = scaleAnims[lastPerfectWeekIndex];
    
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
  }, [perfectWeekDays, scaleAnims]);

  // Get the variant for each day
  const getDayVariant = (index: number): DayVariant => {
    const dayNumber = index + 1;
    const isPerfectWeekDay = dayNumber % 7 === 0;
    const isLastPerfectWeekDay = dayNumber === perfectWeekDays[perfectWeekDays.length - 1];

    if (isPerfectWeekDay) {
      return isLastPerfectWeekDay ? 'flameHighlighted' : 'flame';
    }
    
    // Days 1-6 should have the 'flame' variant
    return 'flame';
  };

  // Get the current month's first day and last day
  const currentDateObj = new Date(currentDate);
  const year = currentDateObj.getFullYear();
  const month = currentDateObj.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Render week days header
  const renderWeekDays = () => {
    const weekDays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
    return weekDays.map((day, index) => (
      <View key={index} style={styles.weekDayContainer}>
        <Text style={styles.weekDayText}>{day}</Text>
      </View>
    ));
  };

  // Render calendar days
  const renderCalendar = () => {
    const days = [];
    let day = 1;
    let streakIndex = 0;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }

    // Add days of the month
    while (day <= daysInMonth) {
      const isInStreak = streakIndex < streak.length;
      const variant = isInStreak ? getDayVariant(streakIndex) : 'plain';
      const isPerfectWeekDay = isInStreak && (streakIndex + 1) % 7 === 0;
      
      days.push(
        <View key={`day-${day}`} style={styles.dayWrapper}>
          {isInStreak && !isPerfectWeekDay && (
            <Animated.View 
              style={[
                styles.connectingLine,
                { 
                  width: lineWidthAnims[streakIndex].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]} 
            />
          )}
          <Animated.View 
            style={[
              styles.dayContainer,
              { 
                opacity: isInStreak ? opacityAnims[streakIndex] : 1,
                transform: [{ scale: isInStreak ? scaleAnims[streakIndex] : 1 }]
              }
            ]}
          >
            <Text style={styles.dayText}>{day}</Text>
            {isInStreak && <DayIndicator variant={variant} />}
          </Animated.View>
        </View>
      );
      
      if (isInStreak) streakIndex++;
      day++;
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekDaysContainer}>{renderWeekDays()}</View>
      <View style={styles.calendarContainer}>{renderCalendar()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayContainer: {
    width: DAY_SIZE,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayWrapper: {
    position: 'relative',
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#7241FF',
    top: '50%',
    left: 0,
    zIndex: -1,
  },
});

export default MonthlyProgress; 