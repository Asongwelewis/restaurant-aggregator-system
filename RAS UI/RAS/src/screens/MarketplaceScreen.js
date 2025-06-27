import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, ScrollView, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarketplaceScreen = () => {
  const [meals, setMeals] = useState([]);
  const [categorizedMeals, setCategorizedMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const navigation = useNavigation();

  // Simple direct fetch function
  const loadMeals = async () => {
    try {
      setLoading(true);
      console.log('=== SIMPLE MEALS FETCH ===');
      
      // First, try to load from cache
      try {
        const cachedMeals = await AsyncStorage.getItem('cached_meals');
        if (cachedMeals) {
          const parsedMeals = JSON.parse(cachedMeals);
          console.log('Loaded from cache:', parsedMeals.length, 'meals');
          setMeals(parsedMeals);
          organizeMealsByCategory(parsedMeals);
          extractCategories(parsedMeals);
          setFilteredMeals(parsedMeals);
        }
      } catch (cacheError) {
        console.log('Cache error:', cacheError);
      }
      
      // Then fetch from server
      const response = await fetch('http://192.168.66.36:8000/meals/debug');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw data received:', data);
        console.log('Data type:', typeof data);
        
        // Handle the actual response format
        let mealsArray = [];
        if (data && data.processed_meals && Array.isArray(data.processed_meals)) {
          mealsArray = data.processed_meals;
          console.log('Data length:', mealsArray.length);
        } else if (Array.isArray(data)) {
          mealsArray = data;
          console.log('Data length:', mealsArray.length);
        } else {
          console.log('Data is not in expected format:', data);
        }
        
        if (mealsArray.length > 0) {
          // Cache the new data
          try {
            await AsyncStorage.setItem('cached_meals', JSON.stringify(mealsArray));
            console.log('Meals cached successfully');
          } catch (cacheError) {
            console.log('Failed to cache meals:', cacheError);
          }
          
          setMeals(mealsArray);
          organizeMealsByCategory(mealsArray);
          extractCategories(mealsArray);
          setFilteredMeals(mealsArray);
          console.log('Meals set successfully:', mealsArray.length);
        } else {
          console.log('No meals found in data');
          // Don't clear existing data if server returns empty
          if (!meals.length) {
            setMeals([]);
            setCategorizedMeals([]);
            setFilteredMeals([]);
          }
        }
      } else {
        console.log('Response not ok');
        // Don't show error if we have cached data
        if (!meals.length) {
          setError('Failed to fetch meals');
        }
      }
    } catch (err) {
      console.log('Fetch error:', err);
      // Don't show error if we have cached data
      if (!meals.length) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const extractCategories = (mealsData) => {
    const uniqueCategories = new Set();
    mealsData.forEach(meal => {
      const category = meal.category || 'Other';
      uniqueCategories.add(category);
    });
    
    const categoryArray = ['All', ...Array.from(uniqueCategories).sort()];
    setCategories(categoryArray);
    console.log('Available categories:', categoryArray);
  };

  // Organize meals by category
  const organizeMealsByCategory = (mealsData) => {
    const categories = {};
    
    mealsData.forEach(meal => {
      const category = meal.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(meal);
    });

    // Convert to SectionList format
    const sections = Object.keys(categories).map(category => ({
      title: category,
      data: categories[category]
    }));

    // Sort sections alphabetically
    sections.sort((a, b) => a.title.localeCompare(b.title));
    
    setCategorizedMeals(sections);
    console.log('Categorized meals:', sections);
  };

  // Filter meals by selected category
  const filterMealsByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal => (meal.category || 'Other') === category);
      setFilteredMeals(filtered);
    }
  };

  // Fetch restaurant info when a meal is selected
  const fetchRestaurantInfo = async (restaurantId) => {
    try {
      const response = await fetch(`http://192.168.66.36:8000/restaurants/${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurantInfo(data);
      } else {
        setRestaurantInfo({ name: 'Restaurant not found', location: 'Unknown location' });
      }
    } catch (err) {
      console.log('Error fetching restaurant info:', err);
      setRestaurantInfo({ name: 'Restaurant not found', location: 'Unknown location' });
    }
  };

  // Handle meal selection
  const handleMealPress = async (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
    await fetchRestaurantInfo(meal.restaurant_id);
  };

  // Handle booking button press
  const handleBookMeal = () => {
    setModalVisible(false);
    // Navigate to reservations screen with meal data
    navigation.navigate('ReservationsScreen', { 
      meal: selectedMeal,
      fromMarketplace: true 
    });
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const renderMeal = ({ item, index }) => {
    console.log(`Rendering meal ${index}:`, item);
    return (
      <TouchableOpacity 
        style={styles.mealCard}
        onPress={() => handleMealPress(item)}
      >
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name || 'No Name'}</Text>
          <Text style={styles.mealPrice}>${item.price || 0}</Text>
          <Text style={styles.mealDescription}>{item.description || 'No description'}</Text>
          <Text style={{ fontSize: 10, color: '#999' }}>
            ID: {item.id || 'No ID'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive
      ]}
      onPress={() => filterMealsByCategory(item)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item && styles.categoryButtonTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Meal Detail Modal
  const MealDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Meal Details</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {selectedMeal && (
              <>
                {/* Meal Image */}
                {selectedMeal.image_url && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: selectedMeal.image_url }}
                      style={styles.mealImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                
                {/* Meal Information */}
                <View style={styles.mealDetailSection}>
                  <Text style={styles.mealDetailTitle}>{selectedMeal.name}</Text>
                  <Text style={styles.mealDetailPrice}>${selectedMeal.price}</Text>
                  <Text style={styles.mealDetailDescription}>{selectedMeal.description}</Text>
                  <Text style={styles.mealDetailCategory}>Category: {selectedMeal.category || 'Not specified'}</Text>
                  <Text style={styles.mealDetailAvailability}>
                    Status: {selectedMeal.available ? 'Available' : 'Not Available'}
                  </Text>
                </View>

                {/* Restaurant Information */}
                <View style={styles.restaurantSection}>
                  <Text style={styles.sectionTitle}>Restaurant Information</Text>
                  {restaurantInfo ? (
                    <>
                      <Text style={styles.restaurantName}>{restaurantInfo.name}</Text>
                      <Text style={styles.restaurantLocation}>{restaurantInfo.location}</Text>
                      {restaurantInfo.description && (
                        <Text style={styles.restaurantDescription}>{restaurantInfo.description}</Text>
                      )}
                      {restaurantInfo.open_hours && restaurantInfo.close_hours && (
                        <Text style={styles.restaurantHours}>
                          Hours: {restaurantInfo.open_hours} - {restaurantInfo.close_hours}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text style={styles.loadingText}>Loading restaurant info...</Text>
                  )}
                </View>

                {/* Booking Button */}
                <View style={styles.bookingSection}>
                  <TouchableOpacity 
                    style={styles.bookMealButton}
                    onPress={handleBookMeal}
                  >
                    <Text style={styles.bookMealButtonText}>Book This Meal</Text>
                  </TouchableOpacity>
                  <Text style={styles.bookingNote}>
                    Tap to proceed to booking form
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading meals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={loadMeals}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Marketplace</Text>
        <Text style={styles.debugText}>Meals: {filteredMeals.length}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadMeals}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      
      <FlatList
        data={filteredMeals}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderMeal}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadMeals}
            colors={['#27ae60']}
            tintColor="#27ae60"
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {selectedCategory === 'All' ? 'No meals found' : `No ${selectedCategory} meals found`}
            </Text>
            <Text style={styles.debugText}>Filtered meals: {filteredMeals.length}</Text>
            <TouchableOpacity style={styles.button} onPress={loadMeals}>
              <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <MealDetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  debugText: {
    fontSize: 14,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#27ae60',
    padding: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Category Filter Styles
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mealCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  mealPrice: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginBottom: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mealImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  mealDetailSection: {
    marginBottom: 20,
  },
  mealDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  mealDetailPrice: {
    fontSize: 20,
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealDetailDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 10,
  },
  mealDetailCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  mealDetailAvailability: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  restaurantSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 10,
  },
  restaurantHours: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  // Booking Section Styles
  bookingSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    alignItems: 'center',
  },
  bookMealButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bookMealButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookingNote: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MarketplaceScreen;