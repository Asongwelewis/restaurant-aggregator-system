import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const restaurants = [
  {
    id: '1',
    name: 'Green Garden',
    latitude: 48.8566,
    longitude: 2.3522,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    profilePic: 'https://randomuser.me/api/portraits/men/12.jpg',
    reviews: 12,
    likes: 34,
  },
  {
    id: '2',
    name: 'Oceanic',
    latitude: 38.7223,
    longitude: -9.1393,
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
    profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
    reviews: 8,
    likes: 21,
  },
  // Add more restaurants as needed
];

export default function MapScreen({ navigation, ...props }) {
  const { darkMode } = props; // or from context

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {restaurants.map(r => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.latitude, longitude: r.longitude }}
            title={r.name}
          >
            <Callout
              onPress={() => {
                navigation.navigate('RestaurantProfile', { restaurant: r });
                // navigation.navigate('RestaurantProfile', { restaurant: r });
              }}
            >
              <View style={{ alignItems: 'center', width: 180 }}>
                <Image source={{ uri: r.image }} style={{ width: 160, height: 70, borderRadius: 8 }} />
                <Text style={{ fontWeight: 'bold', color: '#27ae60', marginTop: 4 }}>{r.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Image source={{ uri: r.profilePic }} style={{ width: 24, height: 24, borderRadius: 12, marginRight: 6 }} />
                  <Text style={{ fontSize: 13, color: '#888' }}>Reviews: {r.reviews}  Likes: {r.likes}</Text>
                </View>
                <Text style={{ color: '#27ae60', marginTop: 4 }}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eafaf1' },
});