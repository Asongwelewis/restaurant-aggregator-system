import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function NotificationsScreen() {
  const [bookingNotif, setBookingNotif] = useState(true);
  const [reviewNotif, setReviewNotif] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Notify when a user books a meal or restaurant</Text>
        <Switch value={bookingNotif} onValueChange={setBookingNotif} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Notify when a user rates/reviews the restaurant or food</Text>
        <Switch value={reviewNotif} onValueChange={setReviewNotif} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#27ae60' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  label: { fontSize: 16, color: '#222', flex: 1, marginRight: 12 },
});
