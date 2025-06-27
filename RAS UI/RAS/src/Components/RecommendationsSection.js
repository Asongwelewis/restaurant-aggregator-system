import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const recommendations = [
  {
    id: '1',
    name: 'Green Garden',
    cuisine: 'Vegan',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    reason: 'Based on your vegan preference',
  },
  {
    id: '2',
    name: 'Sushi World',
    cuisine: 'Sushi',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    reason: 'You ordered sushi last week',
  },
  {
    id: '3',
    name: 'Burger House',
    cuisine: 'Burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    reason: 'Popular in your area',
  },
];

export default function RecommendationsSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for You</Text>
      <FlatList
        data={recommendations}
        horizontal
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardCuisine}>{item.cuisine}</Text>
            <Text style={styles.cardReason}>{item.reason}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 8, marginLeft: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 10, marginRight: 12, width: 160, alignItems: 'center', elevation: 2 },
  cardImage: { width: 120, height: 80, borderRadius: 10, marginBottom: 6 },
  cardName: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  cardCuisine: { color: '#888', fontSize: 13 },
  cardReason: { color: '#27ae60', fontSize: 12, marginTop: 2, textAlign: 'center' },
});
