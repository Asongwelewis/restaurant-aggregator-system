import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function RestaurantRegistrationScreen({ navigation }) {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setRestaurantData(prev => ({
        ...prev,
        logo: result.assets[0].uri
      }));
    }
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement registration logic
      setTimeout(() => {
        navigation.navigate('RestaurantManagement');
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />

      <View style={styles.content}>
        <Text style={styles.title}>Restaurant Registration</Text>
        <Text style={styles.subtitle}>Let's set up your restaurant profile</Text>

        <TouchableOpacity style={styles.logoContainer} onPress={pickImage}>
          {restaurantData.logo ? (
            <Image source={{ uri: restaurantData.logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <MaterialCommunityIcons name="camera-plus" size={40} color="#27ae60" />
              <Text style={styles.logoText}>Add Logo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Restaurant Name"
            value={restaurantData.name}
            onChangeText={(text) => setRestaurantData(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={restaurantData.address}
            onChangeText={(text) => setRestaurantData(prev => ({ ...prev, address: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={restaurantData.phone}
            keyboardType="phone-pad"
            onChangeText={(text) => setRestaurantData(prev => ({ ...prev, phone: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={restaurantData.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setRestaurantData(prev => ({ ...prev, email: text }))}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.loadingButton]}
          onPress={handleRegistration}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Profile...' : 'Complete Registration'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 40,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#27ae60',
    borderStyle: 'dashed',
  },
  logoText: {
    marginTop: 8,
    color: '#27ae60',
    fontSize: 14,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingButton: {
    opacity: 0.7,
  },
});