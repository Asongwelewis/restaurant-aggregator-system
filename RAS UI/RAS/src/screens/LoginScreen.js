import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation, onClose }) {
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const isLoginDisabled = !username || !password;

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.cardWrapper, { transform: [{ scale: cardScale }] }]}>
          <BlurView intensity={60} tint="light" style={styles.card}>
            {/* Close Button */}
            {onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={28} color="#444" />
              </TouchableOpacity>
            )}
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={48} color="#fff" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Username or Number"
                placeholderTextColor="#b0b0b0"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b0b0b0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoginDisabled && { backgroundColor: '#e0e0e0aa' },
              ]}
              onPress={() => {
                // Handle login logic here
              }}
              disabled={isLoginDisabled}
            >
              <Text style={[
                styles.loginButtonText,
                isLoginDisabled && { color: '#b0b0b0' }
              ]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => navigation && navigation.navigate('ChooseAccountType')}
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="google" size={24} color="#db4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="apple1" size={24} color="#222" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.6;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'transparent', // Let WelcomeScreen show through
  },
  cardWrapper: {
    width: CARD_WIDTH,
    minHeight: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    minHeight: CARD_HEIGHT,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)', // semi-transparent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#27ae60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: -36,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 22,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'rgba(241,243,246,0.7)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 13,
    marginVertical: 7,
    color: '#222',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButton: {
    backgroundColor: '#27ae60cc',
    paddingVertical: 14,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 2,
    marginBottom: 12,
  },
  signupText: {
    color: '#888',
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#bbb',
    fontSize: 15,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 6,
  },
  socialButton: {
    backgroundColor: 'rgba(241,243,246,0.7)',
    borderRadius: 50,
    padding: 13,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 4,
  },
});