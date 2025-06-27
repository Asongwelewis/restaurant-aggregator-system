import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KebabMenu from '../Components/KebabMenu';

export default function RestaurantProfileScreen({ route, navigation }) {
  const { restaurant } = route?.params || {};
  const [themeMode, setThemeMode] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Removed Switch Account button from here, now only in drawer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingBottom: 8, paddingHorizontal: 18, width: '100%' }}>
        <Text style={[styles.name, { flex: 1, marginBottom: 0 }]}>Restaurant Profile</Text>
        <KebabMenu
          onSettings={() => navigation && navigation.navigate && navigation.navigate('SettingsScreen', { themeMode, onThemeChange: () => setThemeMode(m => m === 'dark' ? 'light' : 'dark'), notificationsEnabled, onNotifications: () => setNotificationsEnabled(n => !n) })}
          onNotificationSettings={() => navigation && navigation.navigate && navigation.navigate('NotificationsScreen')}
          onThemeChange={() => setThemeMode(m => m === 'dark' ? 'light' : 'dark')}
          onNotifications={() => setNotificationsEnabled(n => !n)}
          themeMode={themeMode}
          notificationsEnabled={notificationsEnabled}
        />
      </View>
      <Image source={{ uri: restaurant?.image }} style={styles.coverImage} />
      <View className={styles.profileRow}>
        <Image source={{ uri: restaurant?.profilePic }} style={styles.profilePic} />
        <View>
          <Text style={styles.name}>{restaurant?.name || 'Restaurant Name'}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#27ae60" /> {restaurant?.location || 'Unknown location'}
          </Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="star" size={20} color="#f1c40f" />
          <Text style={styles.statText}>{restaurant?.reviews || 0} Reviews</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="thumbs-up" size={20} color="#27ae60" />
          <Text style={styles.statText}>{restaurant?.likes || 0} Likes</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.aboutText}>
        {/* Placeholder description */}
        Welcome to {restaurant?.name || 'our restaurant'}! Enjoy our delicious food and cozy atmosphere. We value your feedback and hope you have a great experience.
      </Text>
      {/* You can add a reviews section here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  profilePic: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#27ae60',
    marginRight: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  location: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 18,
    width: '100%',
    justifyContent: 'space-around',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  statText: {
    marginLeft: 6,
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  aboutText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
});