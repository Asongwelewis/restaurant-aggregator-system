import axios from 'axios';
import { getGuestId, storeGuestBooking, getGuestBookings } from '../utils/guestUtils';

const API_BASE_URL = 'http://192.168.66.36:8000';

// Create a booking (supports both user and guest bookings)
export const createBooking = async (bookingData, isGuest = false) => {
  try {
    let payload = {
      restaurant_id: bookingData.restaurant_id,
      meal_id: bookingData.meal_id,
      time: bookingData.time,
      guests: bookingData.guests,
      occasion: bookingData.occasion,
      booking_type: bookingData.booking_type,
      is_guest: isGuest
    };

    if (isGuest) {
      const guestId = await getGuestId();
      payload.guest_id = guestId;
    } else {
      payload.user_id = bookingData.user_id || 1; // Default user ID for now
    }

    const response = await axios.post(`${API_BASE_URL}/bookings/`, payload);
    
    // For guest bookings, also store locally
    if (isGuest) {
      await storeGuestBooking(response.data.booking);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get user bookings
export const getUserBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`);
    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get guest bookings
export const getGuestBookingsFromAPI = async (guestId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/guest/${guestId}`);
    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching guest bookings from API:', error);
    // Fallback to local storage
    return await getGuestBookings();
  }
};

// Get bookings based on user type (guest or registered)
export const getBookings = async (isGuest = false, userId = null) => {
  try {
    if (isGuest) {
      const guestId = await getGuestId();
      return await getGuestBookingsFromAPI(guestId);
    } else {
      return await getUserBookings(userId || 1);
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (isGuest) {
      // Fallback to local storage for guests
      return await getGuestBookings();
    }
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Get a specific booking
export const getBooking = async (bookingId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};
