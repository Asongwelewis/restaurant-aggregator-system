import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function UserProfileScreen({ route }) {
  const { user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.profilePic }} style={styles.avatar} />
      <Text style={styles.name}>{user.profileName}</Text>
      <Text style={styles.intro}>{user.intro}</Text>
      {/* Add more user info, posts, reviews, etc. here */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>
          {/* Placeholder for user bio or more info */}
          This is {user.profileName}'s profile. More info and user posts can be shown here.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    padding: 24,
    paddingBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#27ae60',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 4,
  },
  intro: {
    fontSize: 16,
    color: '#888',
    marginBottom: 18,
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#222',
  },
});