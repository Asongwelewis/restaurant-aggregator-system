import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantProfileScreen({ route }) {
  const { restaurant } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.coverImage} />
      <View style={styles.profileRow}>
        <Image source={{ uri: restaurant.profilePic }} style={styles.profilePic} />
        <View>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#27ae60" /> {restaurant.location || 'Unknown location'}
          </Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="star" size={20} color="#f1c40f" />
          <Text style={styles.statText}>{restaurant.reviews} Reviews</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="thumbs-up" size={20} color="#27ae60" />
          <Text style={styles.statText}>{restaurant.likes} Likes</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.aboutText}>
        {/* Placeholder description */}
        Welcome to {restaurant.name}! Enjoy our delicious food and cozy atmosphere. We value your feedback and hope you have a great experience.
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