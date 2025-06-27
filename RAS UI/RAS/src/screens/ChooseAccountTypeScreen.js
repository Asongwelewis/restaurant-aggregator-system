import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChooseAccountTypeScreen({ navigation, onChoose }) {
  const BackgroundCircles = () => (
    <>
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
    </>
  );

  const handleGuestMode = () => {
    if (onChoose) {
      onChoose('guest');
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundCircles />
      <Text style={styles.title}>Choose Account Type</Text>
      <Text style={styles.subtitle}>Select how you want to use RAS</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onChoose && onChoose('user')}
        >
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.iconContainer}
          >
            <Ionicons name="person-circle" size={64} color="#fff" />
          </LinearGradient>
          <Text style={styles.optionText}>I'm a Person</Text>
          <Text style={styles.optionDescription}>Browse and order from restaurants</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('SubscriptionScreen', { from: 'restaurant' })}
        >
          <LinearGradient
            colors={['#CAFF4E', '#27ae60']}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons name="silverware-fork-knife" size={64} color="#fff" />
          </LinearGradient>
          <Text style={styles.optionText}>I'm a Restaurant</Text>
          <Text style={styles.optionDescription}>Manage your restaurant business</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('SuperAdminPanel')}
        >
          <LinearGradient
            colors={['#ff9800', '#f44336']}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons name="shield-account" size={64} color="#fff" />
          </LinearGradient>
          <Text style={styles.optionText}>I'm a Super Admin</Text>
          <Text style={styles.optionDescription}>Manage system, accounts, and ads</Text>
        </TouchableOpacity>
      </View>

      {/* Guest Mode Option */}
      <View style={styles.guestContainer}>
        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestMode}
        >
          <LinearGradient
            colors={['#9b59b6', '#8e44ad']}
            style={styles.guestIconContainer}
          >
            <Ionicons name="person-outline" size={48} color="#fff" />
          </LinearGradient>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
          <Text style={styles.guestDescription}>Browse and book without registration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.1,
  },
  circle1: {
    backgroundColor: '#27ae60',
    width: 400,
    height: 400,
    top: -200,
    right: -200,
  },
  circle2: {
    backgroundColor: '#CAFF4E',
    width: 300,
    height: 300,
    bottom: -150,
    left: -150,
  },
  circle3: {
    backgroundColor: '#27ae60',
    width: 200,
    height: 200,
    top: '50%',
    right: -100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#27ae60',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    zIndex: 1,
    marginBottom: 40,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: 160,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  guestContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  guestButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: 280,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#9b59b6',
  },
  guestIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9b59b6',
    textAlign: 'center',
    marginBottom: 8,
  },
  guestDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});