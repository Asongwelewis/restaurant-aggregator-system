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
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { AuthService, getAuthErrorMessage } from '../utils/auth';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

export default function SignupScreen({ navigation, onClose, onSignup }) {
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleEmailSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        displayName: username,
        photoURL: image,
      };

      const result = await AuthService.registerWithEmail(email, password, userData);
      
      if (result.success) {
        console.log('Signup successful:', result.user.email);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => {
            if (typeof onSignup === 'function') onSignup();
          }}
        ]);
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        Alert.alert('Signup Failed', errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setSocialLoading('google');
    try {
      const result = await AuthService.loginWithGoogle();
      
      if (result.success) {
        console.log('Google signup successful:', result.user.email);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => {
            if (typeof onSignup === 'function') onSignup();
          }}
        ]);
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        Alert.alert('Google Signup Failed', errorMessage);
      }
    } catch (error) {
      console.error('Google signup error:', error);
      Alert.alert('Google Signup Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setSocialLoading('');
    }
  };

  const handleFacebookSignup = async () => {
    setSocialLoading('facebook');
    try {
      const result = await AuthService.loginWithFacebook();
      
      if (result.success) {
        console.log('Facebook signup successful:', result.user.email);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => {
            if (typeof onSignup === 'function') onSignup();
          }}
        ]);
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        Alert.alert('Facebook Signup Failed', errorMessage);
      }
    } catch (error) {
      console.error('Facebook signup error:', error);
      Alert.alert('Facebook Signup Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setSocialLoading('');
    }
  };

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
            {/* Avatar */}
            <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-add" size={48} color="#fff" />
              )}
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to add photo</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#b0b0b0"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#b0b0b0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b0b0b0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>
            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleEmailSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation && navigation.replace('Login')}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Login</Text>
              </Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialRow}>
              <TouchableOpacity 
                style={[styles.socialButton, socialLoading === 'google' && styles.socialButtonDisabled]}
                onPress={handleGoogleSignup}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'google' ? (
                  <ActivityIndicator color="#db4437" size="small" />
                ) : (
                  <AntDesign name="google" size={24} color="#db4437" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, socialLoading === 'facebook' && styles.socialButtonDisabled]}
                onPress={handleFacebookSignup}
                disabled={socialLoading !== ''}
              >
                {socialLoading === 'facebook' ? (
                  <ActivityIndicator color="#4267B2" size="small" />
                ) : (
                  <FontAwesome name="facebook" size={24} color="#4267B2" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="apple1" size={24} color="#222" />
              </TouchableOpacity>
            </View>
            {/* Guest Button */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => {
                if (typeof onSignup === 'function') onSignup();
              }}
              disabled={loading}
            >
              <Ionicons name="person-outline" size={20} color="#27ae60" />
              <Text style={styles.guestText}>Sign in as Guest</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
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
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#27ae60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: -36,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
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
  signupButton: {
    backgroundColor: '#27ae60cc',
    paddingVertical: 14,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    elevation: 2,
  },
  signupButtonDisabled: {
    backgroundColor: '#e0e0e0aa',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#888',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
});