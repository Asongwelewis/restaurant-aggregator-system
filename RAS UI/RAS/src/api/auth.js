import axios from 'axios';
import { BASE_URL } from './config';

/**
 * Logs in a user with email and password.
 */
export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
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
