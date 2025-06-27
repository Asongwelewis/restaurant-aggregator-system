import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

export default function BookingHistoryScreen({ route }) {
  // For demo, using a hardcoded user_id. Replace with real user context/session.
  const userId = 1;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // This assumes you have an endpoint to get bookings by user_id
        const response = await axios.get(`http://127.0.0.1:8000/bookings/user/${userId}`);
        setBookings(response.data.bookings || []);
      } catch (err) {
        setError('Failed to load booking history.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
  if (!bookings.length) return <Text style={{ textAlign: 'center' }}>No bookings found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booking History</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item, idx) => item.booking_id || item.id || idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardName}>{item.restaurant_name || item.restaurant_id}</Text>
            <Text style={styles.cardTime}>{item.time ? new Date(item.time).toLocaleString() : '-'}</Text>
            <Text style={styles.cardStatus}>Guests: {item.guests || 1}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 10, textAlign: 'center' },
  card: { backgroundColor: '#f8f8f8', borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1 },
  cardName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  cardTime: { color: '#888', fontSize: 14 },
  cardStatus: { color: '#27ae60', fontSize: 14 },
});
