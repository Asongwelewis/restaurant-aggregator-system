import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const MOCK_RESERVATIONS = [
  { id: '1', restaurant: 'Green Garden', time: '2025-06-07 19:00', guests: 2, status: 'upcoming' },
  { id: '2', restaurant: 'Oceanic', time: '2025-06-10 20:30', guests: 4, status: 'upcoming' },
  { id: '3', restaurant: 'Sunset Grill', time: '2025-05-30 18:00', guests: 3, status: 'past' },
  { id: '4', restaurant: 'Skyline Diner', time: '2025-05-25 21:00', guests: 2, status: 'cancelled' },
];

const TABS = [
  { key: 'reservations', label: 'My Reservations', icon: <Ionicons name="calendar" size={18} color="#27ae60" /> },
  { key: 'book', label: 'Book New', icon: <Ionicons name="add-circle" size={18} color="#27ae60" /> },
  { key: 'invite', label: 'Invite', icon: <MaterialIcons name="person-add" size={18} color="#27ae60" /> },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function ReservationsScreen() {
  const [activeTab, setActiveTab] = useState('reservations');
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newBooking, setNewBooking] = useState({ restaurant: '', date: '', time: '', guests: '' });

  // Filtered reservations
  const filteredReservations = MOCK_RESERVATIONS.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    const matchesSearch = r.restaurant.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

      {/* Tab Content */}
      {activeTab === 'reservations' && (
        <>
          {/* Filter Bar */}
          <View style={styles.filterBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {FILTERS.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterBtn, activeFilter === f.key && styles.filterBtnActive]}
                  onPress={() => setActiveFilter(f.key)}
                >
                  <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#27ae60" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurant..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* Reservation List */}
          <FlatList
            data={filteredReservations}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.reservationCard}>
                <Text style={styles.resTitle}>{item.restaurant}</Text>
                <Text style={styles.resTime}>Time: {item.time}</Text>
                <Text style={styles.resGuests}>Guests: {item.guests}</Text>
                <Text style={[
                  styles.resStatus,
                  item.status === 'upcoming' && { color: '#27ae60' },
                  item.status === 'past' && { color: '#888' },
                  item.status === 'cancelled' && { color: '#db4437' },
                ]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No reservations found.</Text>}
          />
        </>
      )}

      {activeTab === 'book' && (
        <View style={styles.bookingForm}>
          <Text style={styles.formTitle}>Book a New Reservation</Text>
          <TextInput
            style={styles.input}
            placeholder="Restaurant Name"
            value={newBooking.restaurant}
            onChangeText={v => setNewBooking({ ...newBooking, restaurant: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newBooking.date}
            onChangeText={v => setNewBooking({ ...newBooking, date: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={newBooking.time}
            onChangeText={v => setNewBooking({ ...newBooking, time: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Guests"
            keyboardType="numeric"
            value={newBooking.guests}
            onChangeText={v => setNewBooking({ ...newBooking, guests: v })}
          />
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'invite' && (
        <View style={styles.inviteForm}>
          <Text style={styles.formTitle}>Invite Someone</Text>
          <TextInput
            style={styles.input}
            placeholder="Friend's Email"
            keyboardType="email-address"
            value={inviteEmail}
            onChangeText={setInviteEmail}
          />
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>Send Invite</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eafaf1', paddingTop: 16 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f4f4f4' },
  tabBtnActive: { backgroundColor: '#CAFF4E' },
  tabLabel: { marginLeft: 6, color: '#27ae60', fontWeight: 'bold' },
  tabLabelActive: { color: '#222' },
  filterBar: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 10 },
  filterBtn: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#f4f4f4', marginRight: 8 },
  filterBtnActive: { backgroundColor: '#CAFF4E' },
  filterText: { color: '#27ae60', fontSize: 13 },
  filterTextActive: { color: '#222', fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 10, marginBottom: 8, paddingHorizontal: 10, height: 38 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  reservationCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginHorizontal: 10, marginVertical: 6, elevation: 2 },
  resTitle: { fontSize: 17, fontWeight: 'bold', color: '#27ae60' },
  resTime: { color: '#555', marginTop: 2 },
  resGuests: { color: '#888', marginTop: 2 },
  resStatus: { marginTop: 6, fontWeight: 'bold' },
  bookingForm: { backgroundColor: '#fff', borderRadius: 16, margin: 18, padding: 18, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 10, textAlign: 'center' },
  input: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 15 },
  bookBtn: { backgroundColor: '#27ae60', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 6 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  inviteForm: { backgroundColor: '#fff', borderRadius: 16, margin: 18, padding: 18, elevation: 2 },
  inviteBtn: { backgroundColor: '#CAFF4E', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 6 },
  inviteBtnText: { color: '#27ae60', fontWeight: 'bold', fontSize: 16 },
});