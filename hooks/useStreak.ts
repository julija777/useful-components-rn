import { useMemo } from 'react';
import { StreakState } from '../types/streak';

const STREAK_TYPES = {
  1: 'single',
  4: 'four',
  7: 'perfect',
  9: 'nine',
} as const;

export const useStreak = (streak: string[], currentDate: string): StreakState => {
  if (!Array.isArray(streak)) {
    throw new Error('streak must be an array');
  }

  const streakType = useMemo(() => {
    return STREAK_TYPES[streak.length as keyof typeof STREAK_TYPES] ?? 'other';
  }, [streak]);

  const perfectWeekDays = useMemo(() => {
    return streak.map((_, index) => {
      const dayNumber = index + 1;
      return dayNumber % 7 === 0 ? dayNumber : null;
    }).filter((day): day is number => day !== null);
  }, [streak]);

  return {
    streak,
    currentDate,
    streakType,
    perfectWeekDays,
  };
}; 