import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


export type DayVariant = 'plain' | 'check' | 'checkHighlighted' | 'flame' | 'flameHighlighted';

interface DayIndicatorProps {
  variant: DayVariant;
}

const styles = StyleSheet.create({
  plainCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  flameCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  icon: {
    color: 'white',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const DayIndicator: React.FC<DayIndicatorProps> = ({ variant }) => {
  // Determine which variant to use
  const isPlain = variant === 'plain';
  const isCheck = variant === 'check' || variant === 'checkHighlighted';
  const isFlame = variant === 'flame' || variant === 'flameHighlighted';
  const isHighlighted = variant === 'checkHighlighted' || variant === 'flameHighlighted';
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(isPlain ? 1 : 0)).current;
  
  // Animate when variant changes
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isPlain ? 1 : 0,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [isPlain, fadeAnim]);
  
  return (
    <View
      style={[
        isPlain ? styles.plainCircle : 
        isCheck ? styles.checkCircle : styles.flameCircle,
        isHighlighted && styles.highlighted
      ]}
    >
      {!isPlain && (
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={['#FD267D', '#FF7E5F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          />
        </View>
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

export default DayIndicator; 