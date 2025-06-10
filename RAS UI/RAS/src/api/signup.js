import axios from 'axios';
import { BASE_URL } from './config';

// Registers a new user
export async function signupUser({ username, email, password, image }) {
  try {
    const payload = { username, email, password };
    if (image) payload.image = image;
    const response = await axios.post(`${BASE_URL}/auth/register`, payload);
    // Adjust the endpoint and payload as per your backend API
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Signup failed'
    );
  }
}