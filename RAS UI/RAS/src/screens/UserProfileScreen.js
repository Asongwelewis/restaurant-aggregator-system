import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function UserProfileScreen({ route }) {
  const { user } = route.params;
  const { darkMode } = useTheme();

  return (
    <ScrollView contentContainerStyle={[styles.container, darkMode && { backgroundColor: '#181a1b' }]}>
      <Image source={{ uri: user?.profilePic || 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
      <Text style={[styles.name, darkMode && { color: '#CAFF4E' }]}>{user?.profileName || user?.username || 'Guest'}</Text>
      <Text style={[styles.intro, darkMode && { color: '#aaa' }]}>{user?.intro || user?.email || ''}</Text>
      <View style={[styles.section, darkMode && { backgroundColor: '#232526' }]}>
        <Text style={[styles.sectionTitle, darkMode && { color: '#CAFF4E' }]}>About</Text>
        <Text style={[styles.sectionText, darkMode && { color: '#fff' }]}>
          This is {user?.profileName || user?.username || 'Guest'}'s profile. More info and user posts can be shown here.
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