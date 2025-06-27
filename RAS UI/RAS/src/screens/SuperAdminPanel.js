import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const mockUsers = [
  { id: 'u1', name: 'John Doe', type: 'User', status: 'Active' },
  { id: 'u2', name: 'Jane Smith', type: 'Restaurant', status: 'Suspended' },
  { id: 'u3', name: 'Admin', type: 'SuperAdmin', status: 'Active' },
];
const mockAds = [
  { id: 'a1', name: 'Summer Promo', price: '$1.00/click' },
  { id: 'a2', name: 'Lunch Rush', price: '$0.80/click' },
];

export default function SuperAdminPanel() {
  const [users, setUsers] = useState(mockUsers);
  const [ads, setAds] = useState(mockAds);
  const [systemHealth, setSystemHealth] = useState({ uptime: '99.99%', errors: 2, lastError: '2025-06-22 14:00' });

  const toggleSuspend = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Super Admin Panel</Text>
      <Text style={styles.sectionTitle}>Accounts</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name} ({item.type})</Text>
            <Text style={styles.userStatus}>{item.status}</Text>
            <TouchableOpacity style={styles.suspendBtn} onPress={() => toggleSuspend(item.id)}>
              <Text style={{ color: '#fff' }}>{item.status === 'Active' ? 'Suspend' : 'Activate'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Ad Pricing</Text>
      <FlatList
        data={ads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.adCard}>
            <Text style={styles.adName}>{item.name}</Text>
            <Text style={styles.adPrice}>{item.price}</Text>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>System Health</Text>
      <View style={styles.healthBox}>
        <Text style={styles.healthText}>Uptime: {systemHealth.uptime}</Text>
        <Text style={styles.healthText}>Errors: {systemHealth.errors}</Text>
        <Text style={styles.healthText}>Last Error: {systemHealth.lastError}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  sectionTitle: { fontSize: 16, color: '#27ae60', fontWeight: 'bold', marginTop: 18, marginBottom: 8 },
  userCard: { backgroundColor: '#f8f8f8', borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userName: { color: '#222', fontWeight: 'bold' },
  userStatus: { color: '#888', marginRight: 10 },
  suspendBtn: { backgroundColor: '#db4437', borderRadius: 8, padding: 8 },
  adCard: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 10, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' },
  adName: { color: '#222', fontWeight: 'bold' },
  adPrice: { color: '#27ae60', fontWeight: 'bold' },
  healthBox: { backgroundColor: '#eafaf1', borderRadius: 10, padding: 12, marginTop: 8 },
  healthText: { color: '#222', fontSize: 14, marginBottom: 2 },
});
