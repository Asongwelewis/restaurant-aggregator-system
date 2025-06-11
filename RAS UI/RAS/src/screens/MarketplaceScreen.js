import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const TABS = [
  { key: 'transactions', label: 'Transactions', icon: <FontAwesome5 name="exchange-alt" size={18} color="#27ae60" /> },
  { key: 'deliveries', label: 'Deliveries', icon: <MaterialIcons name="local-shipping" size={18} color="#27ae60" /> },
  { key: 'buy', label: 'Buy', icon: <Ionicons name="cart" size={18} color="#27ae60" /> },
];

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'purchase', item: 'Pizza Margherita', amount: 15, date: '2025-06-01', status: 'completed' },
  { id: '2', type: 'delivery', item: 'Sushi Set', amount: 28, date: '2025-06-03', status: 'pending' },
  { id: '3', type: 'purchase', item: 'Vegan Burger', amount: 12, date: '2025-05-28', status: 'completed' },
  { id: '4', type: 'delivery', item: 'Cake', amount: 20, date: '2025-06-05', status: 'delivered' },
];

const MOCK_DELIVERIES = [
  { id: 'd1', item: 'Pizza Margherita', address: '123 Main St', date: '2025-06-01', status: 'delivered' },
  { id: 'd2', item: 'Sushi Set', address: '456 Ocean Ave', date: '2025-06-03', status: 'pending' },
  { id: 'd3', item: 'Cake', address: '789 Sweet Rd', date: '2025-06-05', status: 'delivered' },
];

export default function MarketplaceScreen(props) {
  const { darkMode } = props; // or from context
  const [activeTab, setActiveTab] = useState('transactions');
  const [search, setSearch] = useState('');

  // Filtered data
  const filteredTransactions = MOCK_TRANSACTIONS.filter(t =>
    t.item.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDeliveries = MOCK_DELIVERIES.filter(d =>
    d.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#27ae60" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab === 'transactions' ? 'transactions' : 'deliveries'}...`}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Tab Content */}
      {activeTab === 'transactions' && (
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.item}</Text>
              <Text style={styles.itemDetail}>Amount: ${item.amount}</Text>
              <Text style={styles.itemDetail}>Date: {item.date}</Text>
              <Text style={[
                styles.status,
                item.status === 'completed' && { color: '#27ae60' },
                item.status === 'pending' && { color: '#db4437' },
                item.status === 'delivered' && { color: '#888' },
              ]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No transactions found.</Text>}
        />
      )}

      {activeTab === 'deliveries' && (
        <FlatList
          data={filteredDeliveries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.item}</Text>
              <Text style={styles.itemDetail}>Address: {item.address}</Text>
              <Text style={styles.itemDetail}>Date: {item.date}</Text>
              <Text style={[
                styles.status,
                item.status === 'delivered' && { color: '#27ae60' },
                item.status === 'pending' && { color: '#db4437' },
              ]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No deliveries found.</Text>}
        />
      )}

      {activeTab === 'buy' && (
        <View style={styles.buySection}>
          <Text style={styles.buyTitle}>Buy Food or Products</Text>
          <Text style={styles.buyDesc}>Browse and purchase food or products from your favorite restaurants. (Feature coming soon!)</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eafaf1', paddingTop: 16 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f4f4f4' },
  tabBtnActive: { backgroundColor: '#CAFF4E' },
  tabLabel: { marginLeft: 6, color: '#27ae60', fontWeight: 'bold' },
  tabLabelActive: { color: '#222' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 10, marginBottom: 8, paddingHorizontal: 10, height: 38 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginHorizontal: 10, marginVertical: 6, elevation: 2 },
  itemTitle: { fontSize: 17, fontWeight: 'bold', color: '#27ae60' },
  itemDetail: { color: '#555', marginTop: 2 },
  status: { marginTop: 6, fontWeight: 'bold' },
  buySection: { backgroundColor: '#fff', borderRadius: 16, margin: 18, padding: 18, elevation: 2, alignItems: 'center' },
  buyTitle: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  buyDesc: { color: '#888', fontSize: 15, textAlign: 'center' },
});