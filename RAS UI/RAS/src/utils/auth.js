import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import axios from 'axios';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// API Configuration
const API_BASE_URL = 'http://192.168.66.36:8000'; // Your FastAPI backend URL

// OAuth Configuration - Replace with your real credentials
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

// Storage keys
const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  CURRENT_USER: 'currentUser',
  IS_FIRST_TIME: 'isFirstTime',
  REMEMBER_LOGIN: 'rememberLogin',
  LAST_LOGIN: 'lastLogin'
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AuthService.getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class AuthService {
  // Check if user is using app for first time
  static async isFirstTimeUser() {
    try {
      const isFirstTime = await AsyncStorage.getItem(STORAGE_KEYS.IS_FIRST_TIME);
      return isFirstTime === null; // null means first time
    } catch (error) {
      console.error('Error checking first time user:', error);
      return true; // Assume first time if error
    }
  }

  // Mark user as not first time
  static async markAsReturningUser() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_FIRST_TIME, 'false');
    } catch (error) {
      console.error('Error marking as returning user:', error);
    }
  }

  // Check if user has existing login session
  static async hasExistingSession() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const rememberLogin = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_LOGIN);
      
      return !!(token && user && rememberLogin === 'true');
    } catch (error) {
      console.error('Error checking existing session:', error);
      return false;
    }
  }

  // Auto-login with existing session
  static async autoLogin() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      
      if (token && userData) {
        // Verify token with backend
        const response = await api.get('/auth/verify-token');
        if (response.status === 200) {
          const user = JSON.parse(userData);
          return { success: true, user, token };
        }
      }
      return { success: false, error: 'No valid session found' };
    } catch (error) {
      console.error('Auto-login error:', error);
      // Clear invalid session
      await this.clearSession();
      return { success: false, error: 'Session expired' };
    }
  }

  // Email/Password Registration - Real FastAPI backend
  static async registerWithEmail(email, password, userData = {}) {
    try {
      const requestData = {
        email,
        password,
        display_name: userData.displayName || userData.display_name || '',
        phone_number: userData.phoneNumber || userData.phone_number || '',
      };

      console.log('Registration request data:', requestData);

      const response = await api.post('/auth/register', requestData);

      const { user, access_token } = response.data;
      
      // Save session data
      await this.saveSession(user, access_token);
      
      // Mark as returning user
      await this.markAsReturningUser();
      
      // Set remember login
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_LOGIN, 'true');
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());

      return { success: true, user, access_token };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.detail || error.message;
      return { success: false, error: errorMessage };
    }
  }

  // Email/Password Login - Real FastAPI backend
  static async loginWithEmail(email, password, rememberMe = true) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { user, access_token } = response.data;
      
      // Save session data
      await this.saveSession(user, access_token);
      
      // Mark as returning user
      await this.markAsReturningUser();
      
      // Set remember login preference
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_LOGIN, rememberMe.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());

      return { success: true, user, access_token };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      return { success: false, error: errorMessage };
    }
  }

  // Google Login - Real OAuth with backend integration
  static async loginWithGoogle() {
    try {
      const redirectUri = makeRedirectUri({
        scheme: 'ras-app',
        path: 'auth'
      });

      console.log('Google OAuth redirect URI:', redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      console.log('Google OAuth result:', result);

      if (result.type === 'success') {
        const response = await api.post('/auth/google', {
          code: result.params.code,
          redirect_uri: redirectUri
        });

        const { user, access_token } = response.data;
        
        // Save session data
        await this.saveSession(user, access_token);
        
        // Mark as returning user
        await this.markAsReturningUser();
        
        // Set remember login
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_LOGIN, 'true');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());

        return { success: true, user, access_token };
      } else {
        throw new Error('Google login was cancelled');
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      return { success: false, error: errorMessage };
    }
  }

  // Facebook Login - Real OAuth with backend integration
  static async loginWithFacebook() {
    try {
      const redirectUri = makeRedirectUri({
        scheme: 'ras-app',
        path: 'auth'
      });

      console.log('Facebook OAuth redirect URI:', redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId: FACEBOOK_APP_ID,
        scopes: ['public_profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
      });

      console.log('Facebook OAuth result:', result);

      if (result.type === 'success') {
        const response = await api.post('/auth/facebook', {
          code: result.params.code,
          redirect_uri: redirectUri
        });

        const { user, access_token } = response.data;
        
        // Save session data
        await this.saveSession(user, access_token);
        
        // Mark as returning user
        await this.markAsReturningUser();
        
        // Set remember login
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_LOGIN, 'true');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());

        return { success: true, user, access_token };
      } else {
        throw new Error('Facebook login was cancelled');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      return { success: false, error: errorMessage };
    }
  }

  // Logout - Clear session data
  static async logout() {
    try {
      // Notify backend to invalidate token (optional)
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.log('Backend logout failed, continuing with local logout');
      }

      // Clear session data
      await this.clearSession();
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Save session data
  static async saveSession(user, token) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Clear session data
  static async clearSession() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.CURRENT_USER,
        STORAGE_KEYS.LAST_LOGIN
      ]);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Get current user from local storage
  static async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    // Check current user and call callback
    this.getCurrentUser().then(user => {
      callback(user);
    });
    
    // Return unsubscribe function
    return () => {};
  }

  // Save user data to AsyncStorage
  static async saveUserData(userId, userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        id: userId,
        ...userData
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Save user data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user data from AsyncStorage
  static async getUserData(userId) {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // Update user profile - Real backend integration
  static async updateUserProfile(userId, updates) {
    try {
      const response = await api.put(`/auth/profile/${userId}`, updates);
      const updatedUser = response.data;
      
      await this.saveUserData(userId, updatedUser);
      return { success: true, userData: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      return { success: false, error: errorMessage };
    }
  }

  // Check if user is authenticated
  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    const token = await this.getUserToken();
    return !!(user && token);
  }

  // Get user token for API calls
  static async getUserToken() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      return token;
    } catch (error) {
      console.error('Get user token error:', error);
      return null;
    }
  }

  // Refresh token if needed
  static async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { access_token } = response.data;
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, access_token);
      return access_token;
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, logout user
      await this.logout();
      return null;
    }
  }

  // Get app initialization status
  static async getAppStatus() {
    try {
      const isFirstTime = await this.isFirstTimeUser();
      const hasSession = await this.hasExistingSession();
      
      return {
        isFirstTime,
        hasSession,
        shouldShowOnboarding: isFirstTime,
        shouldAutoLogin: hasSession
      };
    } catch (error) {
      console.error('Error getting app status:', error);
      return {
        isFirstTime: true,
        hasSession: false,
        shouldShowOnboarding: true,
        shouldAutoLogin: false
      };
    }
  }
}

// Error message helper
export const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
}; 