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

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const bubbleScale = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    Animated.spring(bubbleScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const isLoginDisabled = !username || !password;

  return (
    <View style={styles.container}>
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
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={90} color="#fff" />
        </View>
        {/* Login Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username or number"
            placeholderTextColor="#eafaf1"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#eafaf1"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoginDisabled && { backgroundColor: '#b7e0c6', borderColor: '#b7e0c6' },
            ]}
            onPress={() => {
              // Handle login logic here
            }}
            disabled={isLoginDisabled}
          >
            <Text style={[
              styles.loginButtonText,
              isLoginDisabled && { color: '#fff' }
            ]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Lower Section */}
      <View style={styles.lowerSection}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation && navigation.navigate('Signup')}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or sign in with</Text>
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

const BUBBLE_HEIGHT = height * 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    marginBottom: 20,
    alignItems: 'center',
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
  loginButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});