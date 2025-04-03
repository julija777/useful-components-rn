import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WorkoutData, getWorkoutData } from '../mockApi/workoutData';

const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 40) / 7; // 7 days in a week, 20px padding on each side

interface MonthlyProgressProps {
  yearMonth: string; // Format: 'YYYY-MM'
}

const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ yearMonth }) => {
  const workoutData = getWorkoutData(yearMonth);
  const [year, month] = yearMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const hasWorkoutOnDate = (date: Date): WorkoutData | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return workoutData.find(workout => workout.date === dateStr);
  };

  const isWeekComplete = (startDate: Date): boolean => {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      if (!hasWorkoutOnDate(currentDate)) {
        return false;
      }
    }
    return true;
  };

  const renderDay = (day: number) => {
    const date = new Date(year, month - 1, day);
    const workout = hasWorkoutOnDate(date);
    
    if (!workout) {
      return (
        <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
      );
    }

    // Check if this day completes a week
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of the week
    const isFlame = workout.type === 'flame';

    return (
      <View style={styles.dayContainer}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.dayText}>{day}</Text>
          <MaterialCommunityIcons
            name={isFlame ? 'fire' : 'check'}
            size={16}
            color="white"
            style={styles.icon}
          />
        </LinearGradient>
      </View>
    );
  };

  const renderWeekDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekDays.map((day, index) => (
      <View key={index} style={styles.weekDayContainer}>
        <Text style={styles.weekDayText}>{day}</Text>
      </View>
    ));
  };

  const renderCalendar = () => {
    const days = [];
    let day = 1;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }

    // Add days of the month
    while (day <= daysInMonth) {
      days.push(
        <View key={`day-${day}`} style={styles.dayContainer}>
          {renderDay(day)}
        </View>
      );
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
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  gradient: {
    width: DAY_SIZE - 10,
    height: DAY_SIZE - 10,
    borderRadius: (DAY_SIZE - 10) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    bottom: 5,
  },
});

export default MonthlyProgress; 