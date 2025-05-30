import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Screen2() {
  return (
    <View style={styles.container}>
      <Text>Screen 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
