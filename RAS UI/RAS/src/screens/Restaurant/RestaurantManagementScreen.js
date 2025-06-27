import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, FlatList, Button, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { RestaurantContext } from '../../context/RestaurantContext';
import { restaurantTheme } from '../../theme/RestaurantTheme';
import { AccountTypeContext } from '../../context/AccountTypeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import KebabMenu from '../../Components/KebabMenu';
import { createRestaurant } from '../../api/restaurants';

export default function RestaurantManagementScreen() {
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [profilePic, setProfilePic] = useState(null); // NEW
  const [location, setLocation] = useState(''); // NEW
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gallery, setGallery] = useState([]);
  const [openingHour, setOpeningHour] = useState('08:00');
  const [closingHour, setClosingHour] = useState('22:00');
  const [openDays, setOpenDays] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState('');
  const [menu, setMenu] = useState([]);
  const [cuisine, setCuisine] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const { addRestaurant } = useContext(RestaurantContext);
  const { accountType, switchAccount } = useContext(AccountTypeContext);
  const navigation = useNavigation();
  const [themeMode, setThemeMode] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const requestMediaLibraryPermission = async () => {
    let permissionResult;
    if (Platform.OS === 'ios') {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    if (permissionResult.status !== 'granted') {
      alert('Permission to access media library is required!');
      return false;
    }
    return true;
  };

  const pickMainImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use correct API
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMainImage(result.assets[0].uri);
      }
    } catch (e) {
      alert('Could not open image picker.');
    }
  };

  const pickProfilePic = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePic(result.assets[0].uri);
      }
    } catch (e) {
      alert('Could not open image picker.');
    }
  };

  const pickGalleryImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use Images for gallery
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setGallery([...gallery, result.assets[0].uri]);
      }
    } catch (e) {
      alert('Could not open image/video picker.');
    }
  };

  const toggleDay = (day) => {
    setOpenDays(openDays.includes(day) ? openDays.filter(d => d !== day) : [...openDays, day]);
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const removeService = (idx) => {
    setServices(services.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const restaurant = {
      name,
      location,
      latitude,
      longitude,
      menu,
      services,
      cuisine,
      openingHour,
      closingHour,
      intro,
      subscription_status: subscriptionStatus,
      profilePic,
      mainImage,
    };
    try {
      const created = await createRestaurant(restaurant);
      addRestaurant(created); // Save to context and set as current
      alert('Restaurant details saved!');
    } catch (e) {
      alert('Failed to save restaurant.');
      console.error(e);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: restaurantTheme.colors.background }]}> 
      <>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingBottom: 8, paddingHorizontal: 18 }}>
          <Text style={[styles.title, { color: restaurantTheme.colors.primary, flex: 1, marginBottom: 0 }]}>Restaurant Management</Text>
          <KebabMenu
            onSettings={() => navigation.navigate('SettingsScreen', { themeMode, onThemeChange: () => setThemeMode(m => m === 'dark' ? 'light' : 'dark'), notificationsEnabled, onNotifications: () => setNotificationsEnabled(n => !n) })}
            onNotificationSettings={() => navigation.navigate('NotificationsScreen')}
            onThemeChange={() => setThemeMode(m => m === 'dark' ? 'light' : 'dark')}
            onNotifications={() => setNotificationsEnabled(n => !n)}
            themeMode={themeMode}
            notificationsEnabled={notificationsEnabled}
          />
        </View>
        <TextInput
          style={[styles.input, { backgroundColor: restaurantTheme.colors.card, color: restaurantTheme.colors.text }]}
          placeholder="Restaurant Name"
          placeholderTextColor={restaurantTheme.colors.muted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { backgroundColor: restaurantTheme.colors.card, color: restaurantTheme.colors.text, height: 80 }]}
          placeholder="Introduction / Description"
          placeholderTextColor={restaurantTheme.colors.muted}
          value={intro}
          onChangeText={setIntro}
          multiline
        />
        <Text style={styles.sectionTitle}>Main Picture</Text>
        <TouchableOpacity style={[styles.imagePicker, { backgroundColor: restaurantTheme.colors.card }]} onPress={pickMainImage}>
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.mainImage} />
          ) : (
            <Text style={{ color: restaurantTheme.colors.muted }}>Tap to select main image</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Profile Picture</Text>
        <TouchableOpacity style={[styles.imagePicker, { backgroundColor: restaurantTheme.colors.card }]} onPress={pickProfilePic}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={[styles.mainImage, { borderRadius: 50, width: 100, height: 100 }]} />
          ) : (
            <Text style={{ color: restaurantTheme.colors.muted }}>Tap to select profile picture</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: restaurantTheme.colors.card, color: restaurantTheme.colors.text }]}
          placeholder="Restaurant Location (e.g. Paris, France)"
          placeholderTextColor={restaurantTheme.colors.muted}
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.sectionTitle}>Gallery (Photos/Videos)</Text>
        <FlatList
          data={gallery}
          horizontal
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({item}) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addGalleryBtn} onPress={pickGalleryImage}>
              <MaterialCommunityIcons name="plus" size={32} color="#27ae60" />
            </TouchableOpacity>
          }
          style={{marginBottom: 16}}
        />
        <Text style={styles.sectionTitle}>Opening & Closing Hours</Text>
        <View style={styles.hoursRow}>
          <TextInput
            style={styles.hourInput}
            value={openingHour}
            onChangeText={setOpeningHour}
            placeholder="Open"
          />
          <Text style={{marginHorizontal: 8}}>to</Text>
          <TextInput
            style={styles.hourInput}
            value={closingHour}
            onChangeText={setClosingHour}
            placeholder="Close"
          />
        </View>
        <Text style={styles.sectionTitle}>Days Open</Text>
        <View style={styles.daysRow}>
          {daysOfWeek.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayBtn, openDays.includes(day) && styles.dayBtnActive]}
              onPress={() => toggleDay(day)}
            >
              <Text style={openDays.includes(day) ? styles.dayTextActive : styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.servicesRow}>
          <TextInput
            style={[styles.input, {flex:1}]}
            placeholder="Add a service"
            value={serviceInput}
            onChangeText={setServiceInput}
          />
          <TouchableOpacity onPress={addService} style={styles.addServiceBtn}>
            <MaterialCommunityIcons name="plus-circle" size={28} color="#27ae60" />
          </TouchableOpacity>
        </View>
        <View style={styles.servicesList}>
          {services.map((service, idx) => (
            <View key={idx} style={styles.serviceItem}>
              <Text style={styles.serviceText}>{service}</Text>
              <TouchableOpacity onPress={() => removeService(idx)}>
                <MaterialCommunityIcons name="close" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: restaurantTheme.colors.primary }]} onPress={handleSave}>
          <Text style={[styles.saveText, { color: '#fff' }]}>Save</Text>
        </TouchableOpacity>
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginTop: 18, marginBottom: 8 },
  imagePicker: { borderRadius: 12, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  mainImage: { width: '100%', height: 140, borderRadius: 12 },
  galleryImage: { width: 90, height: 90, borderRadius: 10, marginRight: 8 },
  addGalleryBtn: { width: 90, height: 90, borderRadius: 10, borderWidth: 1, borderColor: '#27ae60', alignItems: 'center', justifyContent: 'center' },
  hoursRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  hourInput: { borderRadius: 8, padding: 10, fontSize: 16, width: 80, textAlign: 'center' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 4 },
  dayBtnActive: { backgroundColor: '#27ae60' },
  dayText: { color: '#444', fontWeight: 'bold' },
  dayTextActive: { color: '#fff', fontWeight: 'bold' },
  servicesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  addServiceBtn: { marginLeft: 8 },
  servicesList: { marginBottom: 16 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 8, padding: 8, marginBottom: 6, justifyContent: 'space-between' },
  serviceText: { fontSize: 15, color: '#222' },
  saveBtn: { marginTop: 18, marginBottom: 32, borderRadius: 10 },
  saveText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});