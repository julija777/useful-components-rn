import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import DayIndicator, { DayVariant } from './DayIndicator';

interface MonthlyProgressProps {
  streak: string[];
  currentDate?: string;
}

const { width } = Dimensions.get('window');
const DAY_SIZE = Math.floor((width - 40) / 8); // Ensure consistent width for all days
const DAYS_OF_WEEK = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

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

  // Determine streak type
  const streakType = useMemo(() => {
    if (streak.length === 1) return 'single';
    if (streak.length === 4) return 'four';
    if (streak.length === 7) return 'perfect';
    if (streak.length === 9) return 'nine';
    return 'other';
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
        const delay = isPerfectWeekDay && streakType === 'perfect' ? 0 : index * 100;

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
  }, [streak, opacityAnims, lineWidthAnims, streakType]);

  // Animate the last perfect week day
  useEffect(() => {
    if (perfectWeekDays.length === 0) return;
    
    const lastPerfectWeekIndex = (perfectWeekDays[perfectWeekDays.length - 1] ?? 0) - 1;
    const lastDayAnim = scaleAnims[lastPerfectWeekIndex];
    
    const pulseAnimation = Animated.sequence([
      Animated.timing(lastDayAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(lastDayAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
    
    const loopAnimation = Animated.loop(pulseAnimation);
    loopAnimation.start();
    
    return () => {
      loopAnimation.stop();
    };
  }, [perfectWeekDays, scaleAnims]);

  // Get the variant for each day based on streak type
  const getDayVariant = (index: number): DayVariant => {
    const dayNumber = index + 1;

    switch (streakType) {
      case 'single':
        return 'checkHighlighted';
      case 'four':
        return dayNumber === 4 ? 'checkHighlighted' : 'check';
      case 'perfect':
        const isPerfectWeekDay = dayNumber % 7 === 0;
        const isLastPerfectWeekDay = dayNumber === perfectWeekDays[perfectWeekDays.length - 1];
        return isPerfectWeekDay ? (isLastPerfectWeekDay ? 'flameHighlighted' : 'flame') : 'flame';
      case 'nine':
        if (dayNumber <= 7) {
          const isPerfectWeekDay = dayNumber % 7 === 0;
          return isPerfectWeekDay ? 'flame' : 'flame';
        }
        return dayNumber === 9 ? 'checkHighlighted' : 'check';
      default:
        return 'check';
    }
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
    return DAYS_OF_WEEK.map((day, index) => (
      <View key={index} style={[styles.weekDayContainer, { width: DAY_SIZE }]}>
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
      days.push(
        <View key={`empty-${i}`} style={[styles.dayWrapper, { width: DAY_SIZE }]}>
          <View style={[styles.dayContainer, { width: DAY_SIZE }]} />
        </View>
      );
    }

    // Add days of the month
    while (day <= daysInMonth) {
      const isInStreak = streakIndex < streak.length;
      const variant = isInStreak ? getDayVariant(streakIndex) : 'plain';
      const isPerfectWeekDay = isInStreak && (streakIndex + 1) % 7 === 0;
      
      days.push(
        <View key={`day-${day}`} style={[styles.dayWrapper, { width: DAY_SIZE }]}>
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

    // Add empty cells for remaining days in the last week
    const totalCells = days.length;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(
          <View key={`empty-end-${i}`} style={[styles.dayWrapper, { width: DAY_SIZE }]}>
            <View style={[styles.dayContainer, { width: DAY_SIZE }]} />
          </View>
        );
      }
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
    width: '100%',
  },
  weekDayContainer: {
    width: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayWrapper: {
    position: 'relative',
    height: DAY_SIZE,
    width: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    height: DAY_SIZE,
    width: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#666',
    top: '50%',
    left: '50%',
    zIndex: -1,
  },
});

export default MonthlyProgress; 