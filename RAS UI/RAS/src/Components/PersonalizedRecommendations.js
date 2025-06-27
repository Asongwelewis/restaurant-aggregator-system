import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PersonalizedRecommendations({ navigation, isGuest = false }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    if (!isGuest) {
      loadUserPreferences();
      generateRecommendations();
    }
  }, [isGuest]);

  const loadUserPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('user_preferences');
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call to get personalized recommendations
    setTimeout(() => {
      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  };

  const generateMockRecommendations = () => {
    const baseRecommendations = [
      {
        id: 'rec1',
        type: 'restaurant',
        name: 'Green Garden Bistro',
        cuisine: 'Mediterranean',
        rating: 4.5,
        distance: '0.8 km',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
        reason: 'Based on your love for Mediterranean cuisine',
        price: '$$',
        availableSeats: 12,
      },
      {
        id: 'rec2',
        type: 'meal',
        name: 'Spicy Thai Curry',
        restaurant: 'Thai Palace',
        cuisine: 'Thai',
        rating: 4.3,
        price: '$15',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        reason: 'Perfect for your spice preference',
        available: true,
      },
      {
        id: 'rec3',
        type: 'restaurant',
        name: 'Vegan Delight',
        cuisine: 'Vegan',
        rating: 4.7,
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        reason: 'Matches your dietary preferences',
        price: '$$',
        availableSeats: 8,
      },
      {
        id: 'rec4',
        type: 'meal',
        name: 'Margherita Pizza',
        restaurant: 'Pizza Palace',
        cuisine: 'Italian',
        rating: 4.4,
        price: '$18',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
        reason: 'Based on your Italian cuisine preference',
        available: true,
      },
    ];

    // Filter based on user preferences if available
    if (userPreferences) {
      return baseRecommendations.filter(rec => {
        // Filter by dietary preferences
        if (userPreferences.dietary.includes('Vegan') && rec.cuisine !== 'Vegan') {
          return false;
        }
        if (userPreferences.dietary.includes('Vegetarian') && rec.cuisine === 'Vegan') {
          return true;
        }
        
        // Filter by cuisine preferences
        if (userPreferences.cuisines.length > 0) {
          return userPreferences.cuisines.some(cuisine => 
            rec.cuisine.toLowerCase().includes(cuisine.toLowerCase())
          );
        }
        
        return true;
      });
    }

    return baseRecommendations;
  };

  const handleRecommendationPress = (item) => {
    if (item.type === 'restaurant') {
      navigation.navigate('RestaurantProfile', { restaurant: item });
    } else {
      navigation.navigate('Marketplace', { selectedMeal: item });
    }
  };

  const renderRecommendation = ({ item }) => (
    <TouchableOpacity
      style={styles.recommendationCard}
      onPress={() => handleRecommendationPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.recommendationImage} />
      <View style={styles.recommendationContent}>
        <View style={styles.recommendationHeader}>
          <Text style={styles.recommendationName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#f1c40f" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.recommendationCuisine}>
          {item.type === 'meal' ? `${item.restaurant} • ${item.cuisine}` : item.cuisine}
        </Text>
        
        <View style={styles.recommendationDetails}>
          {item.type === 'restaurant' ? (
            <>
              <Text style={styles.detailText}>{item.distance}</Text>
              <Text style={styles.detailText}>{item.price}</Text>
              <Text style={styles.detailText}>{item.availableSeats} seats</Text>
            </>
          ) : (
            <>
              <Text style={styles.detailText}>{item.price}</Text>
              <Text style={styles.detailText}>
                {item.available ? 'Available' : 'Limited'}
              </Text>
            </>
          )}
        </View>
        
        <Text style={styles.recommendationReason}>{item.reason}</Text>
        
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>
            {item.type === 'restaurant' ? 'Book Table' : 'Order Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isGuest) {
    return null; // Don't show recommendations for guests
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.loadingText}>Finding perfect recommendations for you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color="#27ae60" />
        <Text style={styles.title}>Recommended for You</Text>
        <TouchableOpacity onPress={generateRecommendations}>
          <Ionicons name="refresh" size={20} color="#27ae60" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={recommendations}
        renderItem={renderRecommendation}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {recommendations.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Complete your profile to get personalized recommendations</Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Text style={styles.profileButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    flex: 1,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  recommendationCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recommendationContent: {
    padding: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#f1c40f',
  },
  recommendationCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recommendationDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginRight: 12,
  },
  recommendationReason: {
    fontSize: 12,
    color: '#27ae60',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  profileButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 