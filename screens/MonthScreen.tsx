import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import WeeklyProgress from '../components/WeeklyProgress';
import workoutData from '../mockApi/workoutData.json';

export default function MonthScreen() {
  // Check if we have a perfect week (7 or more consecutive days)
  const isPerfectWeek = workoutData['2023-07'].length >= 7;

  return (
    <View style={styles.container}>
      <WeeklyProgress streak={workoutData['2023-07']} isPerfectWeek={isPerfectWeek} />
      <WeeklyProgress streak={[]} />
      <WeeklyProgress streak={[]}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
}); 