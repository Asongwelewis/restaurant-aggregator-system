import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function ReservationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Reservations</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eafaf1' },
  text: { fontSize: 22, color: '#27ae60', fontWeight: 'bold' },
});