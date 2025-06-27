import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockStats = [
  { id: '1', label: 'Total Reservations', value: 120 },
  { id: '2', label: 'Average Rating', value: '4.7' },
  { id: '3', label: 'Most Ordered Dish', value: 'Spicy Pepperoni Pizza' },
  { id: '4', label: 'Feedback Received', value: 45 },
];

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics & Feedback</Text>
      <FlatList
        data={mockStats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.statCard}>
            <Ionicons name="stats-chart" size={24} color="#27ae60" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Recent Feedback</Text>
      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackText}>"Great food and fast service!"</Text>
        <Text style={styles.feedbackText}>"Loved the vegan options."</Text>
        <Text style={styles.feedbackText}>"Would visit again!"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1 },
  statLabel: { color: '#888', fontSize: 14 },
  statValue: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  sectionTitle: { fontSize: 16, color: '#27ae60', fontWeight: 'bold', marginTop: 18, marginBottom: 8 },
  feedbackBox: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 12 },
  feedbackText: { color: '#222', fontSize: 14, marginBottom: 4 },
});
