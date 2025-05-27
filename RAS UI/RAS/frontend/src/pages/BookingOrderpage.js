import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Screen4() {
  return (
    <View style={styles.container}>
      <Text>Screen 4</Text>
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
