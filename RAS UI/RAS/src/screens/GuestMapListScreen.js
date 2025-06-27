import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const cuisines = ['All', 'Vegan', 'Seafood', 'Grill'];
const prices = ['All', '$', '$$', '$$$'];

const GuestMapListScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://127.0.0.1:8000/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        setError('Failed to load restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r =>
    (selectedCuisine === 'All' || r.cuisine === selectedCuisine) &&
    (selectedPrice === 'All' || r.price === selectedPrice)
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Restaurants</Text>
      <View style={styles.filterRow}>
        <FlatList
          data={cuisines}
          horizontal
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, selectedCuisine === item && styles.filterBtnActive]}
              onPress={() => setSelectedCuisine(item)}
            >
              <Text style={selectedCuisine === item ? styles.filterTextActive : styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <FlatList
          data={prices}
          horizontal
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, selectedPrice === item && styles.filterBtnActive]}
              onPress={() => setSelectedPrice(item)}
            >
              <Text style={selectedPrice === item ? styles.filterTextActive : styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { setSelectedRestaurant(item); setShowModal(true); }}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.cuisine} • {item.price} • {item.distance}</Text>
              <Text style={styles.cardSub}>{item.open ? 'Open Now' : 'Closed'}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={18} color="#f1c40f" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedRestaurant && (
              <>
                <Image source={{ uri: selectedRestaurant.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
                <Text style={styles.modalSub}>{selectedRestaurant.cuisine} • {selectedRestaurant.price} • {selectedRestaurant.distance}</Text>
                <Text style={styles.modalSub}>{selectedRestaurant.open ? 'Open Now' : 'Closed'}</Text>
                <Text style={styles.modalSub}>Rating: {selectedRestaurant.rating}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                  <Ionicons name="close" size={24} color="#27ae60" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  filterRow: { flexDirection: 'row', marginBottom: 10 },
  filterBtn: { backgroundColor: '#f4f4f4', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  filterBtnActive: { backgroundColor: '#CAFF4E' },
  filterText: { color: '#27ae60', fontWeight: 'bold' },
  filterTextActive: { color: '#222', fontWeight: 'bold' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1 },
  cardImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  cardSub: { color: '#888', fontSize: 14 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 6, marginLeft: 10 },
  ratingText: { marginLeft: 4, color: '#27ae60', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 18, width: 320, alignItems: 'center', elevation: 6 },
  modalImage: { width: 120, height: 120, borderRadius: 16, marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#27ae60', marginBottom: 4 },
  modalSub: { color: '#888', fontSize: 15, marginBottom: 2 },
  closeBtn: { position: 'absolute', top: 10, right: 10 },
});

export default GuestMapListScreen;
