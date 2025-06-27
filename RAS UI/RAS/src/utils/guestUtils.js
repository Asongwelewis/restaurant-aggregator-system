import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate a unique guest ID
export const generateGuestId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `guest_${timestamp}_${random}`;
};

// Get or create guest ID
export const getGuestId = async () => {
  try {
    let guestId = await AsyncStorage.getItem('guest_id');
    if (!guestId) {
      guestId = generateGuestId();
      await AsyncStorage.setItem('guest_id', guestId);
    }
    return guestId;
  } catch (error) {
    console.error('Error getting guest ID:', error);
    return generateGuestId();
  }
};

// Store guest booking data
export const storeGuestBooking = async (booking) => {
  try {
    const guestBookings = await getGuestBookings();
    guestBookings.push({
      ...booking,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    await AsyncStorage.setItem('guest_bookings', JSON.stringify(guestBookings));
  } catch (error) {
    console.error('Error storing guest booking:', error);
  }
};

// Get guest bookings
export const getGuestBookings = async () => {
  try {
    const bookings = await AsyncStorage.getItem('guest_bookings');
    return bookings ? JSON.parse(bookings) : [];
  } catch (error) {
    console.error('Error getting guest bookings:', error);
    return [];
  }
};

// Clear guest data (when converting to registered user)
export const clearGuestData = async () => {
  try {
    await AsyncStorage.removeItem('guest_id');
    await AsyncStorage.removeItem('guest_bookings');
  } catch (error) {
    console.error('Error clearing guest data:', error);
  }
};

// Check if user is in guest mode
export const isGuestMode = async () => {
  try {
    const guestId = await AsyncStorage.getItem('guest_id');
    return !!guestId;
  } catch (error) {
    console.error('Error checking guest mode:', error);
    return false;
  }
}; 