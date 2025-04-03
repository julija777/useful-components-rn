import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import MonthlyProgress from '../components/MonthlyProgress';
import workoutData from '../mockApi/workoutData.json';

// Example scenarios from README

export default function MonthScreen() {
  const currentDate = new Date().toISOString();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>One Day Streak</Text>
        <MonthlyProgress 
          streak={workoutData.singleDay} 
          currentDate={currentDate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Four Day Streak</Text>
        <MonthlyProgress 
          streak={workoutData.fourDay} 
          currentDate={currentDate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Perfect Week</Text>
        <MonthlyProgress 
          streak={workoutData.perfectWeek} 
          currentDate={currentDate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Nine Day Streak</Text>
        <MonthlyProgress 
          streak={workoutData.nineDay} 
          currentDate={currentDate}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
}); 