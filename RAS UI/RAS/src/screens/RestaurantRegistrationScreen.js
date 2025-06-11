import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Button, Dimensions, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Floating background circle component
function FloatingCircle({ size, top, left, color, opacity }) {
  return (
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: opacity,
        top: top,
        left: left,
        zIndex: -1,
      }}
    />
  );
}

export default function RestaurantRegistrationScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    title: '',
    city: '',
    region: '',
    password: '',
    address: '',
    address2: '',
    email: '',
    emailVerification: '',
    phone: '',
    foodType: '',
    restaurantType: '',
    timeOpened: '',
    profilePic: null,
    backgroundPic: null,
  });

  const [showFAQ, setShowFAQ] = useState(false);

  // Animation for card pop-in
  const cardScale = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async (field) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setForm({ ...form, [field]: result.assets[0].uri });
    }
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    // Add your registration logic here
    alert('Restaurant registered!');
    navigation.navigate('mainHome');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Floating background circles */}
      <FloatingCircle size={220} top={-60} left={-80} color="#CAFF4E" opacity={0.25} />
      <FloatingCircle size={140} top={height * 0.15} left={width * 0.7} color="#27ae60" opacity={0.18} />
      <FloatingCircle size={100} top={height * 0.5} left={-40} color="#888" opacity={0.13} />
      <FloatingCircle size={180} top={height * 0.7} left={width * 0.6} color="#27ae60" opacity={0.12} />
      <FloatingCircle size={90} top={height * 0.35} left={width * 0.5} color="#888" opacity={0.10} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: cardScale }] }]}>
            <View style={styles.avatarCircle}>
              {form.profilePic ? (
                <Image source={{ uri: form.profilePic }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="restaurant" size={48} color="#fff" />
              )}
              <TouchableOpacity style={styles.avatarEdit} onPress={() => pickImage('profilePic')}>
                <MaterialIcons name="edit" size={20} color="#27ae60" />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Create Restaurant Profile</Text>
            <TouchableOpacity style={styles.bgPicker} onPress={() => pickImage('backgroundPic')}>
              <Text style={styles.bgPickerText}>
                {form.backgroundPic ? 'Change Background Picture' : 'Add Background Picture'}
              </Text>
              {form.backgroundPic && (
                <Image source={{ uri: form.backgroundPic }} style={styles.bgPreview} />
              )}
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Restaurant Name" value={form.name} onChangeText={v => handleChange('name', v)} />
            <TextInput style={styles.input} placeholder="Title" value={form.title} onChangeText={v => handleChange('title', v)} />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.inputHalf]} placeholder="City" value={form.city} onChangeText={v => handleChange('city', v)} />
              <TextInput style={[styles.input, styles.inputHalf]} placeholder="Region" value={form.region} onChangeText={v => handleChange('region', v)} />
            </View>
            <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={v => handleChange('password', v)} secureTextEntry />
            <TextInput style={styles.input} placeholder="Address" value={form.address} onChangeText={v => handleChange('address', v)} />
            <TextInput style={styles.input} placeholder="Other Address" value={form.address2} onChangeText={v => handleChange('address2', v)} />
            <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Email Verification" value={form.emailVerification} onChangeText={v => handleChange('emailVerification', v)} />
            <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={v => handleChange('phone', v)} keyboardType="phone-pad" />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.inputHalf]} placeholder="Type of Food" value={form.foodType} onChangeText={v => handleChange('foodType', v)} />
              <TextInput style={[styles.input, styles.inputHalf]} placeholder="Type of Restaurant" value={form.restaurantType} onChangeText={v => handleChange('restaurantType', v)} />
            </View>
            <TextInput style={styles.input} placeholder="Time Opened" value={form.timeOpened} onChangeText={v => handleChange('timeOpened', v)} />

            <Button title="Register Restaurant" color="#27ae60" onPress={handleSubmit} />
          </Animated.View>

          {/* FAQ Section */}
          <TouchableOpacity style={styles.faqToggle} onPress={() => setShowFAQ(!showFAQ)}>
            <Text style={styles.faqToggleText}>{showFAQ ? 'Hide FAQ' : 'Show FAQ'}</Text>
          </TouchableOpacity>
          {showFAQ && (
            <View style={styles.faqSection}>
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqQ}>Q: Why do I need to provide a background/profile picture?</Text>
              <Text style={styles.faqA}>A: It helps your restaurant stand out and look more professional to users.</Text>
              <Text style={styles.faqQ}>Q: What if I don't have all the info now?</Text>
              <Text style={styles.faqA}>A: You can update your profile later from your account settings.</Text>
              <Text style={styles.faqQ}>Q: Is my information secure?</Text>
              <Text style={styles.faqA}>A: Yes, your data is encrypted and only used for your restaurant's profile.</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', paddingBottom: 40 },
  cardWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#CAFF4E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
  },
  bgPicker: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 10,
  },
  bgPickerText: {
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bgPreview: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginTop: 4,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#27ae60', textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eafaf1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f4f4f4',
  },
  inputHalf: {
    width: '48%',
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  imageRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  imagePicker: { flex: 1, alignItems: 'center', marginHorizontal: 8 },
  imagePickerText: { color: '#27ae60', marginBottom: 6 },
  imagePreview: { width: 70, height: 70, borderRadius: 10, marginTop: 4 },
  faqToggle: {
    marginTop: 18,
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eafaf1',
  },
  faqToggleText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 16,
  },
  faqSection: {
    marginTop: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  faqTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    color: '#27ae60',
  },
  faqQ: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#222',
  },
  faqA: {
    marginLeft: 8,
    color: '#555',
    marginBottom: 4,
  },
});