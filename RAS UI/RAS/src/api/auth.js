import axios from 'axios';
import { BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Logs in a user with email and password.
export async function loginUser(email, password) {
  // Send password in plain text (most APIs expect this)
  const payload = { email, password };

  try {
    console.log('BASE_URL:', BASE_URL); // Add this line for debugging
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      payload
      // Remove custom headers unless your backend expects them
    );
    return response.data;
  } catch (error) {
    // Enhanced error logging for debugging
    if (error.response) {
      // Server responded with a status code out of 2xx
      console.log('Login error - response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.log('Login error - request made, no response:', error.request);
    } else {
      // Something else happened
      console.log('Login error - message:', error.message);
    }
    throw new Error(error.response?.data?.detail || error.message || 'Login failed');
  }
}

/**
 * Registers a new user.
 */
export async function registerUser(name, email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
}

export async function saveTokens(tokens) {
  try {
    await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
  } catch (e) {
    console.log('Error saving tokens:', e);
  }
}
