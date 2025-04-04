import React from 'react';
import { View, StyleSheet } from 'react-native';

interface FlameIndicatorProps {
  size?: number;
  variant?: 'normal' | 'highlighted';
}

const FlameIndicator: React.FC<FlameIndicatorProps> = ({ 
  size = 40,
  variant = 'normal'
}) => {
  return (
    <View style={[
      styles.container,
      { 
        width: size,
        height: size,
        borderWidth: variant === 'highlighted' ? 2 : 0,
        borderColor: '#fff'
      }
    ]}>
      <View style={styles.flame}>
        <View style={styles.flameInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c84755',
    borderRadius: 20,
  },
  flame: {
    width: 24,
    height: 32,
    backgroundColor: '#f3cc70',
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameInner: {
    width: 16,
    height: 24,
    backgroundColor: '#a43f4a',
    borderRadius: 8,
  },
});

export default FlameIndicator; 