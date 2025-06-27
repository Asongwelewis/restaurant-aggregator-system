import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DIETARY_PREFERENCES = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Nut-Free', 'Halal', 'Kosher', 'Low-Carb', 'Keto'
];

const CUISINE_PREFERENCES = [
  'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican',
  'Thai', 'Mediterranean', 'American', 'French', 'Greek'
];

export default function UserProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    isGuest: false,
  });
  
  const [preferences, setPreferences] = useState({
    dietary: [],
    cuisines: [],
    notifications: {
      bookingReminders: true,
      newRestaurants: true,
      exclusiveOffers: true,
      recommendations: true,
    },
    location: {
      homeAddress: '',
      workAddress: '',
      preferredRadius: 10, // km
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('user_profile');
      const savedPreferences = await AsyncStorage.getItem('user_preferences');
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      
      // For testing: Set as registered user if not already set
      if (!profile.isGuest && profile.isGuest !== false) {
        setProfile(prev => ({ ...prev, isGuest: false }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      // Ensure user is marked as registered when saving profile
      const profileToSave = { ...profile, isGuest: false };
      await AsyncStorage.setItem('user_profile', JSON.stringify(profileToSave));
      await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
      setProfile(profileToSave);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const toggleDietaryPreference = (preference) => {
    setPreferences(prev => ({
      ...prev,
      dietary: prev.dietary.includes(preference)
        ? prev.dietary.filter(p => p !== preference)
        : [...prev.dietary, preference]
    }));
  };

  const toggleCuisinePreference = (cuisine) => {
    setPreferences(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const toggleNotification = (key) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#27ae60" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={saveProfile}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <View style={styles.avatarEdit}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        {renderSection('Basic Information', (
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        ))}

        {/* Dietary Preferences */}
        {renderSection('Dietary Preferences', (
          <View style={styles.preferencesGrid}>
            {DIETARY_PREFERENCES.map((preference) => (
              <TouchableOpacity
                key={preference}
                style={[
                  styles.preferenceChip,
                  preferences.dietary.includes(preference) && styles.preferenceChipActive
                ]}
                onPress={() => toggleDietaryPreference(preference)}
              >
                <Text style={[
                  styles.preferenceText,
                  preferences.dietary.includes(preference) && styles.preferenceTextActive
                ]}>
                  {preference}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Cuisine Preferences */}
        {renderSection('Favorite Cuisines', (
          <View style={styles.preferencesGrid}>
            {CUISINE_PREFERENCES.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  styles.preferenceChip,
                  preferences.cuisines.includes(cuisine) && styles.preferenceChipActive
                ]}
                onPress={() => toggleCuisinePreference(cuisine)}
              >
                <Text style={[
                  styles.preferenceText,
                  preferences.cuisines.includes(cuisine) && styles.preferenceTextActive
                ]}>
                  {cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Location Preferences */}
        {renderSection('Location Preferences', (
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Home Address</Text>
              <TextInput
                style={styles.input}
                value={preferences.location.homeAddress}
                onChangeText={(text) => setPreferences(prev => ({
                  ...prev,
                  location: { ...prev.location, homeAddress: text }
                }))}
                placeholder="Enter your home address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Work Address</Text>
              <TextInput
                style={styles.input}
                value={preferences.location.workAddress}
                onChangeText={(text) => setPreferences(prev => ({
                  ...prev,
                  location: { ...prev.location, workAddress: text }
                }))}
                placeholder="Enter your work address"
              />
            </View>
          </View>
        ))}

        {/* Notification Settings */}
        {renderSection('Notification Settings', (
          <View style={styles.notificationGroup}>
            <View style={styles.notificationItem}>
              <View>
                <Text style={styles.notificationTitle}>Booking Reminders</Text>
                <Text style={styles.notificationSubtitle}>Get reminded about upcoming bookings</Text>
              </View>
              <Switch
                value={preferences.notifications.bookingReminders}
                onValueChange={() => toggleNotification('bookingReminders')}
                trackColor={{ false: '#e0e0e0', true: '#27ae60' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View>
                <Text style={styles.notificationTitle}>New Restaurants</Text>
                <Text style={styles.notificationSubtitle}>Discover new restaurants in your area</Text>
              </View>
              <Switch
                value={preferences.notifications.newRestaurants}
                onValueChange={() => toggleNotification('newRestaurants')}
                trackColor={{ false: '#e0e0e0', true: '#27ae60' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View>
                <Text style={styles.notificationTitle}>Exclusive Offers</Text>
                <Text style={styles.notificationSubtitle}>Get notified about special deals</Text>
              </View>
              <Switch
                value={preferences.notifications.exclusiveOffers}
                onValueChange={() => toggleNotification('exclusiveOffers')}
                trackColor={{ false: '#e0e0e0', true: '#27ae60' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View>
                <Text style={styles.notificationTitle}>Personalized Recommendations</Text>
                <Text style={styles.notificationSubtitle}>Get recommendations based on your preferences</Text>
              </View>
              <Switch
                value={preferences.notifications.recommendations}
                onValueChange={() => toggleNotification('recommendations')}
                trackColor={{ false: '#e0e0e0', true: '#27ae60' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        ))}

        {/* Account Actions */}
        {renderSection('Account', (
          <View style={styles.accountActions}>
            <TouchableOpacity 
              style={styles.accountAction}
              onPress={() => {
                if (profile.isGuest) {
                  Alert.alert('Registered Users Only', 'Please register or log in to access Favorites.');
                } else {
                  navigation.navigate('FavoritesScreen');
                }
              }}
            >
              <Ionicons name="heart" size={20} color="#27ae60" />
              <Text style={styles.accountActionText}>My Favorites</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.accountAction}
              onPress={() => {
                if (profile.isGuest) {
                  Alert.alert('Registered Users Only', 'Please register or log in to access Reviews.');
                } else {
                  navigation.navigate('RatingsAndReviewsScreen');
                }
              }}
            >
              <Ionicons name="star" size={20} color="#27ae60" />
              <Text style={styles.accountActionText}>My Reviews</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.accountAction}
              onPress={() => {
                if (profile.isGuest) {
                  Alert.alert('Registered Users Only', 'Please register or log in to access Booking History.');
                } else {
                  navigation.navigate('BookingHistoryScreen');
                }
              }}
            >
              <Ionicons name="calendar" size={20} color="#27ae60" />
              <Text style={styles.accountActionText}>Booking History</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountAction}>
              <Ionicons name="settings" size={20} color="#27ae60" />
              <Text style={styles.accountActionText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  saveButton: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#27ae60',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 16,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  preferenceChipActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  preferenceText: {
    fontSize: 14,
    color: '#666',
  },
  preferenceTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  notificationGroup: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  accountActions: {
    gap: 8,
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  accountActionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});