import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useStreak } from '../hooks/useStreak';
import { useStreakAnimation } from '../hooks/useStreakAnimation';
import { calendarStyles, DAY_SIZE } from '../styles/calendar';
import { MonthlyProgressProps, DayVariant } from '../types/streak';
import DayIndicator from './DayIndicator';

const DAYS_OF_WEEK = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

type StreakType = 'single' | 'four' | 'perfect' | 'nine' | 'other';

const DAY_VARIANTS: Record<StreakType, (dayNumber: number, perfectWeekDays?: number[]) => DayVariant> = {
  single: () => 'checkHighlighted',
  four: (dayNumber: number) => dayNumber === 4 ? 'checkHighlighted' : 'check',
  perfect: (dayNumber: number, perfectWeekDays: number[] = []) => {
    const isPerfectWeekDay = dayNumber % 7 === 0;
    const isLastPerfectWeekDay = dayNumber === perfectWeekDays[perfectWeekDays.length - 1];
    return isPerfectWeekDay ? (isLastPerfectWeekDay ? 'flameHighlighted' : 'flame') : 'flame';
  },
  nine: (dayNumber: number) => {
    if (dayNumber <= 7) {
      const isPerfectWeekDay = dayNumber % 7 === 0;
      return isPerfectWeekDay ? 'flame' : 'flame';
    }
    return dayNumber === 9 ? 'checkHighlighted' : 'check';
  },
  other: () => 'check',
} as const;

const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ 
  streak = [], 
  currentDate = new Date().toISOString(),
}) => {
  if (!Array.isArray(streak)) {
    console.error('streak prop must be an array');
    return null;
  }

  const { streakType, perfectWeekDays } = useStreak(streak, currentDate);
  const { opacityAnims, scaleAnims, lineWidthAnims } = useStreakAnimation(streak.length);

  // Get the current month's first day and last day
  const currentDateObj = new Date(currentDate);
  const year = currentDateObj.getFullYear();
  const month = currentDateObj.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const getDayVariant = (index: number): DayVariant => {
    const dayNumber = index + 1;
    const getVariant = DAY_VARIANTS[streakType];
    return getVariant(dayNumber, perfectWeekDays);
  };

  const renderWeekDays = () => {
    return DAYS_OF_WEEK.map((day, index) => (
      <View key={index} style={[calendarStyles.weekDayContainer, { width: DAY_SIZE }]}>
        <Text style={calendarStyles.weekDayText}>{day}</Text>
      </View>
    ));
  };

  const renderCalendar = () => {
    const days = [];
    let day = 1;
    let streakIndex = 0;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={[calendarStyles.dayWrapper, { width: DAY_SIZE }]}>
          <View style={[calendarStyles.dayContainer, { width: DAY_SIZE }]} />
        </View>
      );
    }

    // Add days of the month
    while (day <= daysInMonth) {
      const isInStreak = streakIndex < streak.length;
      const variant = isInStreak ? getDayVariant(streakIndex) : 'plain';
      const isPerfectWeekDay = isInStreak && (streakIndex + 1) % 7 === 0;
      
      days.push(
        <View key={`day-${day}`} style={[calendarStyles.dayWrapper, { width: DAY_SIZE }]}>
          {isInStreak && !isPerfectWeekDay && (
            <Animated.View 
              style={[
                calendarStyles.connectingLine,
                { 
                  width: lineWidthAnims[streakIndex]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) ?? '0%'
                }
              ]} 
            />
          )}
          <Animated.View 
            style={[
              calendarStyles.dayContainer,
              { 
                opacity: isInStreak ? (opacityAnims[streakIndex] ?? 1) : 1,
                transform: [{ scale: isInStreak ? (scaleAnims[streakIndex] ?? 1) : 1 }]
              }
            ]}
          >
            <Text style={calendarStyles.dayText}>{day}</Text>
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
          <View key={`empty-end-${i}`} style={[calendarStyles.dayWrapper, { width: DAY_SIZE }]}>
            <View style={[calendarStyles.dayContainer, { width: DAY_SIZE }]} />
          </View>
        );
      }
    }

    return days;
  };

  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.weekDaysContainer}>{renderWeekDays()}</View>
      <View style={calendarStyles.calendarContainer}>{renderCalendar()}</View>
    </View>
  );
};

export default MonthlyProgress; 