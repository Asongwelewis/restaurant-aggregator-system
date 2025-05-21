import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Screen1() {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Text style={styles.topText}>Where are you ?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100, // Increased padding to bring text down
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: 'orange',
  },
  circle: {
    width: 500,
    height: 650,
    borderRadius: 500,
    backgroundColor: '#CAFF4E', // lemon green
    marginTop: -200, // Move the circle up so it sits at the top
    position: 'absolute',
    top: 100,
    left: '50%',
    marginLeft: -250, // Center horizontally
    zIndex: -1,
  },
  topText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
});
