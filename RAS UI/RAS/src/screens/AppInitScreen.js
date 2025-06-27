import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthService } from '../utils/auth';

const AppInitScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      
      // Get app status
      const appStatus = await AuthService.getAppStatus();
      setStatus(appStatus);
      
      console.log('App status:', appStatus);

      if (appStatus.shouldAutoLogin) {
        console.log('Attempting auto-login...');
        const autoLoginResult = await AuthService.autoLogin();
        
        if (autoLoginResult.success) {
          console.log('Auto-login successful');
          // Navigate to main app
          navigation.replace('MainApp');
          return;
        } else {
          console.log('Auto-login failed:', autoLoginResult.error);
          // Clear invalid session and continue with normal flow
          await AuthService.clearSession();
        }
      }

      if (appStatus.isFirstTime) {
        console.log('First time user - showing onboarding');
        // Navigate to onboarding or registration
        navigation.replace('Onboarding');
      } else {
        console.log('Returning user - showing login');
        // Navigate to login screen
        navigation.replace('Login');
      }

    } catch (error) {
      console.error('App initialization error:', error);
      Alert.alert(
        'Error',
        'Failed to initialize app. Please try again.',
        [
          {
            text: 'Retry',
            onPress: initializeApp,
          },
          {
            text: 'Continue',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing...</Text>
        {status && (
          <Text style={styles.statusText}>
            {status.isFirstTime ? 'First time user' : 'Returning user'}
            {status.hasSession ? ' (has session)' : ' (no session)'}
          </Text>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default AppInitScreen; 