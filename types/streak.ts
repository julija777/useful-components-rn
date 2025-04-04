export type DayVariant = 'plain' | 'check' | 'checkHighlighted' | 'flame' | 'flameHighlighted';

export interface MonthlyProgressProps {
  streak: string[];
  currentDate?: string;
}

export interface DayIndicatorProps {
  variant: DayVariant;
}

export interface StreakState {
  streak: string[];
  currentDate: string;
  streakType: 'single' | 'four' | 'perfect' | 'nine' | 'other';
  perfectWeekDays: number[];
} 