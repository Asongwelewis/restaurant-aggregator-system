import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');
const BUBBLE_HEIGHT = height * 0.55;

export default function SignupScreen({ navigation }) {
  const bubbleScale = useRef(new Animated.Value(0)).current;
  const [image, setImage] = useState(null);

  useEffect(() => {
    Animated.spring(bubbleScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    // Pick image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sign in as Guest */}
      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => {
          if (navigation) navigation.navigate('Welcome');
        }}
      >
        <Ionicons name="person-outline" size={20} color="#27ae60" />
        <Text style={styles.guestText}>Sign in as Guest</Text>
      </TouchableOpacity>

      {/* Animated Bubble */}
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: bubbleScale }],
          },
        ]}
      >
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person-add" size={90} color="#fff" />
          )}
          <Text style={styles.avatarHint}>Tap to add photo</Text>
        </TouchableOpacity>
        {/* Signup Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#eafaf1"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#eafaf1"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#eafaf1"
            secureTextEntry
          />
        </View>
      </Animated.View>

      {/* Lower Section */}
      <View style={styles.lowerSection}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {
            // Handle sign up logic here
          }}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or sign up with</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={28} color="#db4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={28} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="apple1" size={28} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  guestButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27ae60',
    elevation: 2,
  },
  guestText: {
    color: '#27ae60',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  bubble: {
    position: 'absolute',
    top: 0,
    left: -width * 0.1,
    width: width * 1.2,
    height: BUBBLE_HEIGHT,
    backgroundColor: '#27ae60',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
    alignItems: 'center',
    paddingTop: 60,
    zIndex: 2,
  },
  avatarContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#c8f7dc',
  },
  avatarHint: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 8,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  lowerSection: {
    position: 'absolute',
    top: BUBBLE_HEIGHT - 30,
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    zIndex: 1,
  },
  signupButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  signupText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  orText: {
    color: '#888',
    marginVertical: 18,
    fontSize: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 12,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});