import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import WeeklyProgress from '../components/WeeklyProgress';
import workoutData from '../mockApi/workoutData.json';

export default function WeekScreen() {
  return (
    <View style={styles.container}>
      <WeeklyProgress currentDate="2023-07-21T12:07:47+01:00" streak={["2023-07-21T12:07:47+01:00"]} />
      <WeeklyProgress currentDate="2023-07-21T12:07:47+01:00" streak={workoutData.perfectWeek} />
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