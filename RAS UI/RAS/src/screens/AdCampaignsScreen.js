import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const mockCampaigns = [
  { id: '1', name: 'Summer Promo', radius: '2km', budget: '$100', duration: '7 days', status: 'Active' },
  { id: '2', name: 'Lunch Rush', radius: '1km', budget: '$50', duration: '3 days', status: 'Ended' },
];

export default function AdCampaignsScreen() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', radius: '', budget: '', duration: '' });

  const addCampaign = () => {
    setCampaigns([
      ...campaigns,
      { ...form, id: Date.now().toString(), status: 'Active' },
    ]);
    setForm({ name: '', radius: '', budget: '', duration: '' });
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ad Campaigns</Text>
      <FlatList
        data={campaigns}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDetail}>Radius: {item.radius}</Text>
            <Text style={styles.cardDetail}>Budget: {item.budget}</Text>
            <Text style={styles.cardDetail}>Duration: {item.duration}</Text>
            <Text style={[styles.cardStatus, item.status === 'Active' ? { color: '#27ae60' } : { color: '#888' }]}>{item.status}</Text>
          </View>
        )}
      />
      {showForm ? (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Campaign Name" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
          <TextInput style={styles.input} placeholder="Radius (e.g. 2km)" value={form.radius} onChangeText={v => setForm(f => ({ ...f, radius: v }))} />
          <TextInput style={styles.input} placeholder="Budget (e.g. $100)" value={form.budget} onChangeText={v => setForm(f => ({ ...f, budget: v }))} />
          <TextInput style={styles.input} placeholder="Duration (e.g. 7 days)" value={form.duration} onChangeText={v => setForm(f => ({ ...f, duration: v }))} />
          <TouchableOpacity style={styles.addBtn} onPress={addCampaign}><Text style={styles.addBtnText}>Add Campaign</Text></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <MaterialIcons name="add-circle" size={22} color="#fff" />
          <Text style={styles.addBtnText}>New Campaign</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  card: { backgroundColor: '#f8f8f8', borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1 },
  cardName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  cardDetail: { color: '#888', fontSize: 14 },
  cardStatus: { fontWeight: 'bold', marginTop: 4 },
  form: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginTop: 10, elevation: 2 },
  input: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 8, marginBottom: 8 },
  addBtn: { backgroundColor: '#27ae60', borderRadius: 8, padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
});
