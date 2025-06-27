import { API_BASE_URL } from './config';

// Test meals API
export async function testMealsAPI() {
  try {
    console.log('Testing meals API...');
    const response = await fetch(`${API_BASE_URL}/meals/main`);
    console.log('Test response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Test meals data:', data);
      console.log('Test meals count:', data.length);
      return data;
    } else {
      console.error('Test failed:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Test error:', error);
    return null;
  }
}

// Create a new meal (restaurant owner) with image upload
// Now requires restaurantId as an argument
export async function createMeal(meal, restaurantId) {
  const formData = new FormData();
  formData.append('name', meal.name);
  formData.append('price', meal.price);
  formData.append('description', meal.description);
  formData.append('category', meal.category);
  if (meal.image) {
    // React Native image picker returns a URI, we need to extract filename and type
    const uriParts = meal.image.split('/');
    const fileName = uriParts[uriParts.length - 1];
    formData.append('image', {
      uri: meal.image,
      name: fileName,
      type: 'image/jpeg', // or try to detect from extension
    });
  }
  // Use the correct endpoint for meal creation
  const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/meals/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create meal');
  }
  return response.json();
}

// Fetch all meals (for marketplace)
export async function fetchMeals() {
  try {
    console.log('Fetching meals from:', `${API_BASE_URL}/meals/main`);
    const response = await fetch(`${API_BASE_URL}/meals/main`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Meals response status:', response.status);
    console.log('Meals response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend meals error response:', errorText);
      throw new Error(`Failed to fetch meals: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw meals data from backend:', data);
    console.log('Number of meals received:', data.length);
    
    // Map backend fields to expected frontend fields
    const mappedMeals = data.map(meal => {
      console.log('Processing meal:', meal);
      return {
        ...meal,
        image_url: meal.image_url || meal.image || meal.imageUrl || null, // fallback for various backend field names
        id: meal.id || meal._id || `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: meal.name || 'Unknown Meal',
        price: meal.price || 0,
        description: meal.description || '',
        restaurant_name: meal.restaurant_name || meal.restaurantName || 'Unknown Restaurant',
      };
    });
    
    console.log('Mapped meals data:', mappedMeals);
    return mappedMeals;
  } catch (error) {
    console.error('Error fetching meals:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}
