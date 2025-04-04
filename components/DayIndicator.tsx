import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FlameIndicator from './FlameIndicator';


export type DayVariant = 'plain' | 'check' | 'checkHighlighted' | 'flame' | 'flameHighlighted';

interface DayIndicatorProps {
  variant: DayVariant;
}

const DayIndicator: React.FC<DayIndicatorProps> = ({ variant }) => {
  const isPlain = variant === 'plain';
  const isCheck = variant === 'check' || variant === 'checkHighlighted';
  const isFlame = variant === 'flame' || variant === 'flameHighlighted';
  const isHighlighted = variant === 'checkHighlighted' || variant === 'flameHighlighted';
  
  return (
    <View
      style={[
        styles.circle,
        isHighlighted && styles.highlighted
      ]}
    >
      {!isPlain && (
        <LinearGradient
          colors={['#7241FF', '#f0800b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      )}
      
      {isCheck && (
        <Ionicons name="checkmark" size={20} color="white" style={styles.icon} />
      )}
      
      {isFlame && (
       <Ionicons name="flame" size={20} color="white" style={styles.icon} />
      
       
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon: {
    color: 'white',
  },
});

export default DayIndicator; 