import axios from 'axios';
import { BASE_URL } from './config';

// Registers a new user
export async function signupUser({ username, email, password, image }) {
  try {
    const payload = { name: username, email, password }; // Use 'name'
    if (image) payload.image = image;
    const response = await axios.post(`${BASE_URL}/register`, payload); // Use /register
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
      error.message ||
      'Signup failed'
    );
  }
}