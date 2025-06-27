import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const exampleRestaurants = [
  {
    id: 'r1',
    name: 'Green Garden',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    stars: 4.8,
    reviews: 120,
    rank: 1,
  },
  {
    id: 'r2',
    name: 'Oceanic',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    stars: 4.6,
    reviews: 98,
    rank: 2,
  },
  {
    id: 'r3',
    name: 'Mountain Dine',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    stars: 4.5,
    reviews: 87,
    rank: 3,
  },
];

const exampleMeals = [
  {
    id: 'm1',
    name: 'Spicy Pepperoni Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    stars: 4.9,
    reviews: 150,
    rank: 1,
  },
  {
    id: 'm2',
    name: 'Fresh Sushi Rolls',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    stars: 4.7,
    reviews: 110,
    rank: 2,
  },
  {
    id: 'm3',
    name: 'Juicy Burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    stars: 4.6,
    reviews: 90,
    rank: 3,
  },
];

const exampleComments = [
  { id: 'c1', user: 'Anna', text: 'Amazing food and great service!' },
  { id: 'c2', user: 'John', text: 'Loved the atmosphere.' },
  { id: 'c3', user: 'Mike', text: 'Best meal I had this week.' },
];

function RankingList({ data, onSelect, type }) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Ionicons name="star" size={16} color="#f1c40f" />
              <Text style={styles.cardStat}>{item.stars} ({item.reviews} reviews)</Text>
            </View>
          </View>
          <View style={styles.rankCircle}>
            <Text style={styles.rankText}>{item.rank}</Text>
          </View>
        </TouchableOpacity>
      )}
      style={{ marginBottom: 18 }}
    />
  );
}

export default function RatingsAndReviewsScreen() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('restaurants'); // or 'meals'

  let data = view === 'restaurants' ? exampleRestaurants : exampleMeals;

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'restaurants' && styles.toggleBtnActive]}
          onPress={() => { setSelected(null); setView('restaurants'); }}
        >
          <FontAwesome5 name="utensils" size={18} color={view === 'restaurants' ? '#fff' : '#27ae60'} />
          <Text style={[styles.toggleText, view === 'restaurants' && { color: '#fff' }]}>Restaurants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'meals' && styles.toggleBtnActive]}
          onPress={() => { setSelected(null); setView('meals'); }}
        >
          <FontAwesome5 name="hamburger" size={18} color={view === 'meals' ? '#fff' : '#27ae60'} />
          <Text style={[styles.toggleText, view === 'meals' && { color: '#fff' }]}>Meals</Text>
        </TouchableOpacity>
      </View>
      {!selected ? (
        <RankingList data={data} onSelect={setSelected} type={view} />
      ) : (
        <View style={styles.detailBox}>
          <Image source={{ uri: selected.image }} style={styles.detailImage} />
          <Text style={styles.detailTitle}>{selected.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
            <Ionicons name="star" size={18} color="#f1c40f" />
            <Text style={styles.detailStat}>{selected.stars} ({selected.reviews} reviews)</Text>
          </View>
          <Text style={styles.commentsTitle}>Comments</Text>
          <FlatList
            data={exampleComments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Ionicons name="person-circle" size={24} color="#27ae60" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelected(null)}>
            <Text style={styles.backBtnText}>Back to Rankings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#27ae60', paddingVertical: 8, paddingHorizontal: 18, marginHorizontal: 6, backgroundColor: '#fff' },
  toggleBtnActive: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  toggleText: { marginLeft: 8, fontWeight: 'bold', color: '#27ae60', fontSize: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1 },
  cardImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  cardStat: { marginLeft: 6, color: '#888', fontSize: 14 },
  rankCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#27ae60', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  rankText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  detailBox: { backgroundColor: '#f8f8f8', borderRadius: 16, padding: 18, alignItems: 'center' },
  detailImage: { width: 120, height: 120, borderRadius: 16, marginBottom: 10 },
  detailTitle: { fontSize: 20, fontWeight: 'bold', color: '#27ae60', marginBottom: 4 },
  detailStat: { marginLeft: 6, color: '#888', fontSize: 15 },
  commentsTitle: { fontSize: 16, fontWeight: 'bold', color: '#27ae60', marginTop: 12, marginBottom: 6, alignSelf: 'flex-start' },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  commentUser: { fontWeight: 'bold', color: '#222' },
  commentText: { color: '#444', fontSize: 14 },
  backBtn: { marginTop: 18, backgroundColor: '#27ae60', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 },
  backBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
