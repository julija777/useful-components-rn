import React from 'react';
import { View, StyleSheet } from 'react-native';

const FlameIcon = () => {
  return (
    <View style={styles.container}>
      <View style={styles.flame}>
        <View style={styles.flameInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flame: {
    width: 24,
    height: 32,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 20,
    transform: [{ rotate: '-15deg' }],
    position: 'relative',
  },
  flameInner: {
    width: 14,
    height: 22,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 15,
    position: 'absolute',
    bottom: 3,
    left: 6,
    transform: [{ rotate: '10deg' }],
  },
});

export default FlameIcon;
