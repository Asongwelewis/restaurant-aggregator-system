import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('restaurants'); // 'restaurants' or 'meals'

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('user_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(item => item.id !== itemId);
              setFavorites(updatedFavorites);
              await AsyncStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          }
        }
      ]
    );
  };

  const addToFavorites = async (item) => {
    try {
      const newFavorite = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
      
      Alert.alert('Success', 'Added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Error', 'Failed to add to favorites');
    }
  };

  const filteredFavorites = favorites.filter(item => item.type === activeTab);

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('RestaurantProfile', { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.favoriteImage} />
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteName}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => removeFavorite(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="heart-dislike" size={20} color="#ff4757" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.favoriteCuisine}>{item.cuisine}</Text>
        
        <View style={styles.favoriteDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#f1c40f" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.detailText}>{item.distance}</Text>
          <Text style={styles.detailText}>{item.price}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('ReservationsScreen', { restaurant: item })}
          >
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.bookButtonText}>Book Table</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              // Share functionality would go here
              Alert.alert('Share', 'Share functionality coming soon!');
            }}
          >
            <Ionicons name="share-outline" size={16} color="#27ae60" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMeal = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('Marketplace', { selectedMeal: item })}
    >
      <Image source={{ uri: item.image }} style={styles.favoriteImage} />
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteName}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => removeFavorite(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="heart-dislike" size={20} color="#ff4757" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.favoriteCuisine}>{item.restaurant} • {item.cuisine}</Text>
        
        <View style={styles.favoriteDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#f1c40f" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.detailText}>{item.price}</Text>
          <Text style={styles.detailText}>
            {item.available ? 'Available' : 'Limited'}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('ReservationsScreen', { meal: item })}
          >
            <Ionicons name="restaurant" size={16} color="#fff" />
            <Text style={styles.bookButtonText}>Order Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              Alert.alert('Share', 'Share functionality coming soon!');
            }}
          >
            <Ionicons name="share-outline" size={16} color="#27ae60" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#27ae60" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <TouchableOpacity onPress={loadFavorites}>
          <Ionicons name="refresh" size={20} color="#27ae60" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Ionicons 
            name="restaurant" 
            size={20} 
            color={activeTab === 'restaurants' ? '#27ae60' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
            Restaurants ({favorites.filter(f => f.type === 'restaurant').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meals' && styles.activeTab]}
          onPress={() => setActiveTab('meals')}
        >
          <Ionicons 
            name="fast-food" 
            size={20} 
            color={activeTab === 'meals' ? '#27ae60' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'meals' && styles.activeTabText]}>
            Meals ({favorites.filter(f => f.type === 'meal').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          renderItem={activeTab === 'restaurants' ? renderRestaurant : renderMeal}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={activeTab === 'restaurants' ? 'restaurant-outline' : 'fast-food-outline'} 
            size={64} 
            color="#ccc" 
          />
          <Text style={styles.emptyTitle}>
            No {activeTab} in favorites yet
          </Text>
          <Text style={styles.emptyText}>
            Start exploring and add your favorite {activeTab} to this list
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore {activeTab === 'restaurants' ? 'Restaurants' : 'Meals'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#e8f5e8',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#27ae60',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteContent: {
    padding: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  favoriteCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  favoriteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#f1c40f',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 