import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length > 1) {
      handleSearch();
    } else {
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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
        {/* Filter buttons can be added here if needed */}
      </View>
      {loading && <ActivityIndicator size="small" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id?.toString() || item._id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.cuisine}</Text>
              <Text>{item.location}</Text>
            </View>
          </TouchableOpacity>
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

export default SearchScreen;