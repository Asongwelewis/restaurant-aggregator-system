import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const FILTERS = [
  { key: 'all', label: 'All', icon: <Ionicons name="search" size={18} color="#27ae60" /> },
  { key: 'restaurant', label: 'Restaurant', icon: <Ionicons name="restaurant" size={18} color="#27ae60" /> },
  { key: 'profile', label: 'Profile', icon: <Ionicons name="person" size={18} color="#27ae60" /> },
  { key: 'food', label: 'Food', icon: <MaterialCommunityIcons name="food" size={18} color="#27ae60" /> },
];

const MOCK_DATA = [
  { id: '1', type: 'restaurant', name: 'Green Garden', description: 'Paris, France' },
  { id: '2', type: 'profile', name: 'Mario Rossi', description: 'Pizza Chef' },
  { id: '3', type: 'food', name: 'Pepperoni Pizza', description: 'Spicy and delicious' },
  { id: '4', type: 'restaurant', name: 'Sushi World', description: 'Tokyo, Japan' },
  { id: '5', type: 'profile', name: 'Sakura Tanaka', description: 'Sushi Master' },
  { id: '6', type: 'food', name: 'Vegan Burger', description: 'Healthy and tasty' },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredData = MOCK_DATA.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Go Back Arrow */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#27ae60" />
      </TouchableOpacity>
      <Text style={styles.title}>Search</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={22} color="#27ae60" />
        <TextInput
          style={styles.input}
          placeholder="Search names, restaurants, profiles, food..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>
      <View style={styles.filterBar}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              activeFilter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setActiveFilter(f.key)}
          >
            {f.icon}
            <Text style={[
              styles.filterLabel,
              activeFilter === f.key && styles.filterLabelActive,
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultTitle}>{item.name}</Text>
            <Text style={styles.resultDesc}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No results found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 16 },
  backBtn: { position: 'absolute', left: 10, top: 18, zIndex: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#27ae60', marginBottom: 18, alignSelf: 'center' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  filterBar: { flexDirection: 'row', marginBottom: 10, justifyContent: 'center' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#f4f4f4',
  },
  filterBtnActive: { backgroundColor: '#CAFF4E' },
  filterLabel: { fontSize: 13, color: '#27ae60', marginLeft: 4 },
  filterLabelActive: { color: '#222' },
  resultItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    elevation: 1,
  },
  resultTitle: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  resultDesc: { color: '#888', fontSize: 13, marginTop: 2 },
});