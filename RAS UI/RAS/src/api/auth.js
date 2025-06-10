import axios from 'axios';
import { BASE_URL } from './config';

const BASE_URL = 'http://localhost:8000'; // Replace with actual backend URL

/**
 * Logs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User data and auth token
 */
export async function loginUser(email, password) {
  try {
    const response = await axios.post($, {BASE_URL}/auth/login, { email, password });
    return response.data; // Expect token and user info
  } catch (error) {
    // Handle error (e.g., invalid credentials)
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
}

/**
 * Registers a new user.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Created user info
 */
export async function registerUser(name, email, password) {
  try {
    const response = await axios.post($, {BASE_URL}/auth/register, {name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
}
