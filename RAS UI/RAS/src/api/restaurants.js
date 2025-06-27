import { API_BASE_URL } from './config';

// Test API connectivity
export async function testAPIConnection() {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/restaurants/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 second timeout
    });
    console.log('API test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

// Create a new restaurant with image uploads
export async function createRestaurant(restaurant) {
  const formData = new FormData();
  
  // Generate a unique ID if not provided
  const restaurantId = restaurant.id || `restaurant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  formData.append('id', restaurantId);
  
  formData.append('name', restaurant.name || '');
  formData.append('location', restaurant.location || '');

  // Only append latitude/longitude if they are valid numbers
  if (restaurant.latitude !== undefined && restaurant.latitude !== '' && !isNaN(Number(restaurant.latitude))) {
    formData.append('latitude', Number(restaurant.latitude));
  }
  if (restaurant.longitude !== undefined && restaurant.longitude !== '' && !isNaN(Number(restaurant.longitude))) {
    formData.append('longitude', Number(restaurant.longitude));
  }

  formData.append('open_hours', restaurant.open_hours || restaurant.openingHour || '');
  formData.append('close_hours', restaurant.close_hours || restaurant.closingHour || '');
  formData.append('description', restaurant.intro || restaurant.description || '');
  formData.append('subscription_status', restaurant.subscription_status || '');

  if (restaurant.profilePic) {
    const uriParts = restaurant.profilePic.split('/');
    const fileName = uriParts[uriParts.length - 1];
    formData.append('profile_pic', {
      uri: restaurant.profilePic,
      name: fileName,
      type: 'image/jpeg',
    });
  }
  if (restaurant.mainImage) {
    const uriParts = restaurant.mainImage.split('/');
    const fileName = uriParts[uriParts.length - 1];
    formData.append('background_pic', {
      uri: restaurant.mainImage,
      name: fileName,
      type: 'image/jpeg',
    });
  }

  // Debug: log all FormData keys and values
  console.log('Sending restaurant data with ID:', restaurantId);
  for (let pair of formData._parts || []) {
    console.log('FormData:', pair[0], pair[1]);
  }

  const response = await fetch(`${API_BASE_URL}/restaurants/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  if (!response.ok) {
    let errorText = await response.text();
    console.error('Backend error:', errorText);
    throw new Error('Failed to create restaurant: ' + errorText);
  }
  return response.json();
}

// Fetch all restaurants (for homepage)
export async function fetchRestaurants() {
  try {
    console.log('Fetching restaurants from:', `${API_BASE_URL}/restaurants/`);
    const response = await fetch(`${API_BASE_URL}/restaurants/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Failed to fetch restaurants: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched restaurants data:', data);
    
    // Map backend fields to expected frontend fields
    return data.map(restaurant => ({
      ...restaurant,
      profile_pic_url: restaurant.profile_pic_url || restaurant.profile_pic || restaurant.profilePic || null,
      background_pic_url: restaurant.background_pic_url || restaurant.background_pic || restaurant.backgroundPic || null,
    }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

// Fetch a single restaurant by ID
export async function fetchRestaurantById(restaurantId) {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch restaurant');
    }
    const data = await response.json();
    return {
      ...data,
      profile_pic_url: data.profile_pic_url || data.profile_pic || data.profilePic || null,
      background_pic_url: data.background_pic_url || data.background_pic || data.backgroundPic || null,
    };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
}
