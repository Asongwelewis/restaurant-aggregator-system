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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { AuthService, getAuthErrorMessage } from '../utils/auth';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation, onClose, onLogin }) {
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const isLoginDisabled = !username || !password || loading;

  const handleEmailLogin = async () => {
    if (!username || !password) return;
    
    setLoading(true);
    try {
      const result = await AuthService.loginWithEmail(username, password, rememberMe);
      
      if (result.success) {
        console.log('Login successful:', result.user.email);
        if (typeof onLogin === 'function') onLogin();
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    try {
      const result = await AuthService.loginWithGoogle();
      
      if (result.success) {
        console.log('Google login successful:', result.user.email);
        if (typeof onLogin === 'function') onLogin();
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        Alert.alert('Google Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Google Login Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setSocialLoading('');
    }
  };

  const handleFacebookLogin = async () => {
    setSocialLoading('facebook');
    try {
      const result = await AuthService.loginWithFacebook();
      
      if (result.success) {
        console.log('Facebook login successful:', result.user.email);
        if (typeof onLogin === 'function') onLogin();
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        Alert.alert('Facebook Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Facebook Login Failed', 'An unexpected error occurred. Please try again.');
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
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={48} color="#fff" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#b0b0b0"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
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
            
            {/* Remember Me Checkbox */}
            <TouchableOpacity 
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={loading}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoginDisabled && { backgroundColor: '#e0e0e0aa' },
              ]}
              onPress={handleEmailLogin}
              disabled={isLoginDisabled}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[
                  styles.loginButtonText,
                  isLoginDisabled && { color: '#b0b0b0' }
                ]}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => navigation && navigation.replace('Signup')}
              disabled={loading}
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
              <TouchableOpacity 
                style={[styles.socialButton, socialLoading === 'google' && styles.socialButtonDisabled]}
                onPress={handleGoogleLogin}
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
                onPress={handleFacebookLogin}
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginBottom: 20,
  },
  signupText: {
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
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#27ae60',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#666',
  },
});