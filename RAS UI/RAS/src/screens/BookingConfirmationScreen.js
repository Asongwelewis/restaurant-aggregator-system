import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function BookingConfirmationScreen({ route, navigation }) {
  const { bookingId } = route.params || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided.');
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
  if (!booking) return <Text style={{ textAlign: 'center' }}>No booking found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.label}>Restaurant:</Text>
      <Text style={styles.value}>{booking.restaurant_name || booking.restaurant_id}</Text>
      <Text style={styles.label}>Date & Time:</Text>
      <Text style={styles.value}>{booking.time ? new Date(booking.time).toLocaleString() : '-'}</Text>
      <Text style={styles.label}>Guests:</Text>
      <Text style={styles.value}>{booking.guests || 1}</Text>
      <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.doneBtnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#27ae60', marginBottom: 24 },
  label: { fontSize: 16, color: '#888', marginTop: 12 },
  value: { fontSize: 18, color: '#222', fontWeight: 'bold' },
  doneBtn: { backgroundColor: '#27ae60', borderRadius: 8, padding: 12, marginTop: 32, alignItems: 'center', width: 120 },
  doneBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
