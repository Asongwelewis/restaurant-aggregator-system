import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Image, ActivityIndicator, Alert, Modal, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { createBooking, getBookings } from '../api/bookings';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../utils/notifications';
import { isGuestMode, getGuestId } from '../utils/guestUtils';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

// --- Booking API integration ---
const USER_ID = 1; // TODO: Replace with real user context/session

export default function ReservationsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('reservations');
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [newBooking, setNewBooking] = useState({ restaurant: '', date: '', time: '', guests: '', occasion: '', type: 'restaurant' });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationError, setConfirmationError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // --- Book by Meal Modal State ---
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Check if user is in guest mode
  useEffect(() => {
    const checkGuestMode = async () => {
      const guestMode = await isGuestMode();
      setIsGuest(guestMode);
    };
    checkGuestMode();
  }, []);

  // Fetch booking history on mount
  useEffect(() => {
    if (activeTab === 'reservations') {
      loadBookings();
    }
  }, [activeTab, isGuest]);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      await notificationService.init();
      notificationService.setupNotificationListeners(navigation);
    };
    
    initNotifications();
    
    // Cleanup on unmount
    return () => {
      notificationService.cleanup();
    };
  }, [navigation]);

  // Load bookings from cache and server
  const loadBookings = async () => {
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      // First, try to load from cache
      try {
        const cacheKey = isGuest ? 'cached_guest_bookings' : 'cached_bookings';
        const cachedBookings = await AsyncStorage.getItem(cacheKey);
        if (cachedBookings) {
          const parsedBookings = JSON.parse(cachedBookings);
          console.log('Loaded from cache:', parsedBookings.length, 'bookings');
          setBookingHistory(parsedBookings);
        }
      } catch (cacheError) {
        console.log('Cache error:', cacheError);
      }
      
      // Then try to fetch from server
      try {
        const serverBookings = await getBookings(isGuest, USER_ID);
        console.log('Fetched from server:', serverBookings.length, 'bookings');
        
        if (serverBookings.length > 0) {
          // Cache the new data
          try {
            const cacheKey = isGuest ? 'cached_guest_bookings' : 'cached_bookings';
            await AsyncStorage.setItem(cacheKey, JSON.stringify(serverBookings));
            console.log('Bookings cached successfully');
          } catch (cacheError) {
            console.log('Failed to cache bookings:', cacheError);
          }
          
          setBookingHistory(serverBookings);
        }
      } catch (serverError) {
        console.log('Server fetch error:', serverError);
        // Don't show error if we have cached data
        if (!bookingHistory.length) {
          setBookingError('Failed to load booking history.');
        }
      }
    } catch (err) {
      console.log('Load bookings error:', err);
      if (!bookingHistory.length) {
        setBookingError('Failed to load booking history.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // If navigated with a meal or restaurant, pre-fill booking form
  useEffect(() => {
    if (route.params) {
      if (route.params.meal) {
        const meal = route.params.meal;
        setActiveTab('book');
        setNewBooking({
          ...newBooking,
          type: 'meal',
          restaurant: meal.restaurant_id ? String(meal.restaurant_id) : '',
          meal_id: meal.id ? String(meal.id) : '',
          meal_name: meal.name || '',
        });
        setSelectedMeal(meal.name);
        setMealModalVisible(true);
      } else if (route.params.restaurant) {
        const restaurant = route.params.restaurant;
        setActiveTab('book');
        setNewBooking({
          ...newBooking,
          type: 'restaurant',
          restaurant: restaurant.id ? String(restaurant.id) : '',
          restaurant_name: restaurant.name || '',
        });
      }
    }
  }, [route.params]);

  // Booking handler (API)
  const handleBook = async () => {
    if (!newBooking.restaurant || !newBooking.date || !newBooking.time || !newBooking.guests) {
      Alert.alert('Please fill all booking fields.');
      return;
    }
    setConfirmationLoading(true);
    setConfirmationError(null);
    try {
      // Get restaurant name if we have restaurant_id
      let restaurantName = 'Unknown Restaurant';
      if (newBooking.restaurant) {
        try {
          const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/${newBooking.restaurant}`);
          if (restaurantResponse.ok) {
            const restaurantData = await restaurantResponse.json();
            restaurantName = restaurantData.name || 'Unknown Restaurant';
          }
        } catch (restaurantError) {
          console.log('Failed to fetch restaurant name:', restaurantError);
        }
      }

      const payload = {
        restaurant_id: String(newBooking.restaurant),
        restaurant_name: restaurantName,
        meal_id: null,  // null for restaurant bookings
        meal_name: null,  // null for restaurant bookings
        time: `${newBooking.date}T${newBooking.time}`,
        guests: parseInt(newBooking.guests, 10),
        occasion: newBooking.occasion || null,
        booking_type: 'restaurant'
      };
      
      // Add user_id for registered users
      if (!isGuest) {
        payload.user_id = parseInt(USER_ID, 10);
      }
      
      console.log('Booking payload:', payload);
      console.log('Is guest mode:', isGuest);
      
      // Try to save to server first
      let res;
      try {
        res = await createBooking(payload, isGuest);
        console.log('Booking saved to server:', res);
      } catch (serverError) {
        console.log('Server booking failed, saving locally:', serverError);
        // Create local booking if server fails
        res = {
          booking_id: `local_${Date.now()}`,
          message: 'Booking saved locally',
          booking: {
            ...payload,
            booking_id: `local_${Date.now()}`,
            status: 'upcoming',
            created_at: new Date().toISOString()
          }
        };
      }
      
      // Add to local cache
      const newBookingData = res.booking;
      const updatedBookings = [newBookingData, ...bookingHistory];
      try {
        const cacheKey = isGuest ? 'cached_guest_bookings' : 'cached_bookings';
        await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedBookings));
        console.log('Booking added to cache');
      } catch (cacheError) {
        console.log('Failed to cache booking:', cacheError);
      }
      
      setBookingHistory(updatedBookings);
      setConfirmation(res);
      setActiveTab('confirmation');
      
      // Send notification with proper booking data
      try {
        if (newBookingData) {
          const notificationBooking = {
            ...newBookingData,
            booking_type: 'restaurant',
            restaurant_name: newBookingData.restaurant_name || 'Restaurant',
            booking_id: newBookingData.booking_id || res.booking_id
          };
          await notificationService.sendBookingConfirmation(notificationBooking);
          await notificationService.scheduleBookingReminder(notificationBooking);
        } else {
          console.log('No booking data available for notification');
        }
      } catch (notificationError) {
        console.log('Failed to send notification:', notificationError);
      }
      
      // Clear form
      setNewBooking({ restaurant: '', date: '', time: '', guests: '', occasion: '', type: 'restaurant' });
      
    } catch (err) {
      let msg = 'Booking failed.';
      if (err.response && err.response.data) {
        msg += ` Reason: ${JSON.stringify(err.response.data)}`;
      } else if (err.message) {
        msg += ` (${err.message})`;
      }
      setConfirmationError(msg);
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Confirmation fetcher (if needed)
  const fetchConfirmation = async bookingId => {
    setConfirmationLoading(true);
    setConfirmationError(null);
    try {
      const res = await fetchBookingById(bookingId);
      setConfirmation(res);
      setActiveTab('confirmation');
    } catch (err) {
      setConfirmationError('Failed to load booking details.');
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              // Try to cancel on server first
              try {
                await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
                console.log('Booking cancelled on server');
              } catch (serverError) {
                console.log('Server cancel failed, updating locally:', serverError);
              }
              
              // Update local cache
              const updatedBookings = bookingHistory.map(b =>
                (b.booking_id === bookingId || b.id === bookingId)
                  ? { ...b, status: 'cancelled' }
                  : b
              );
              
              try {
                const cacheKey = isGuest ? 'cached_guest_bookings' : 'cached_bookings';
                await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedBookings));
                console.log('Cancelled booking updated in cache');
              } catch (cacheError) {
                console.log('Failed to update cache:', cacheError);
              }
              
              setBookingHistory(updatedBookings);
              Alert.alert('Booking cancelled.');
              
              // Send cancellation notification
              try {
                const cancelledBooking = bookingHistory.find(b => 
                  (b.booking_id === bookingId || b.id === bookingId)
                );
                if (cancelledBooking) {
                  await notificationService.sendBookingCancellation(cancelledBooking);
                }
              } catch (notificationError) {
                console.log('Failed to send cancellation notification:', notificationError);
              }
            } catch (err) {
              Alert.alert('Failed to cancel booking.');
            }
          }
        }
      ]
    );
  };

  // --- Book by Meal Handler ---
  const handleMealSelect = (mealName) => {
    setSelectedMeal(mealName);
    setMealModalVisible(true);
  };

  const handleBookMeal = async () => {
    if (!selectedMeal || !newBooking.date || !newBooking.time || !newBooking.guests) {
      Alert.alert('Please fill all booking fields.');
      return;
    }
    setConfirmationLoading(true);
    setConfirmationError(null);
    try {
      // Get restaurant name if we have restaurant_id
      let restaurantName = 'Unknown Restaurant';
      if (newBooking.restaurant) {
        try {
          const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/${newBooking.restaurant}`);
          if (restaurantResponse.ok) {
            const restaurantData = await restaurantResponse.json();
            restaurantName = restaurantData.name || 'Unknown Restaurant';
          }
        } catch (restaurantError) {
          console.log('Failed to fetch restaurant name:', restaurantError);
        }
      }

      const payload = {
        restaurant_id: String(newBooking.restaurant),
        restaurant_name: restaurantName,
        meal_id: String(newBooking.meal_id),
        meal_name: selectedMeal,
        time: `${newBooking.date}T${newBooking.time}`,
        guests: parseInt(newBooking.guests, 10),
        occasion: newBooking.occasion || null,
        booking_type: 'meal'
      };
      
      // Add user_id for registered users
      if (!isGuest) {
        payload.user_id = parseInt(USER_ID, 10);
      }
      
      console.log('Meal booking payload:', payload);
      console.log('Is guest mode:', isGuest);
      
      // Try to save to server first
      let res;
      try {
        res = await createBooking(payload, isGuest);
        console.log('Meal booking saved to server:', res);
      } catch (serverError) {
        console.log('Server meal booking failed, saving locally:', serverError);
        // Create local booking if server fails
        res = {
          booking_id: `local_${Date.now()}`,
          message: 'Meal booking saved locally',
          booking: {
            ...payload,
            booking_id: `local_${Date.now()}`,
            status: 'upcoming',
            created_at: new Date().toISOString()
          }
        };
      }
      
      // Add to local cache
      const newBookingData = res.booking;
      const updatedBookings = [newBookingData, ...bookingHistory];
      try {
        const cacheKey = isGuest ? 'cached_guest_bookings' : 'cached_bookings';
        await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedBookings));
        console.log('Meal booking added to cache');
      } catch (cacheError) {
        console.log('Failed to cache meal booking:', cacheError);
      }
      
      setBookingHistory(updatedBookings);
      setConfirmation(res);
      setActiveTab('confirmation');
      
      // Send notification with proper booking data
      try {
        if (newBookingData) {
          const notificationBooking = {
            ...newBookingData,
            booking_type: 'meal',
            restaurant_name: newBookingData.restaurant_name || 'Restaurant',
            meal_name: newBookingData.meal_name || selectedMeal,
            booking_id: newBookingData.booking_id || res.booking_id
          };
          await notificationService.sendBookingConfirmation(notificationBooking);
          await notificationService.scheduleBookingReminder(notificationBooking);
        } else {
          console.log('No meal booking data available for notification');
        }
      } catch (notificationError) {
        console.log('Failed to send meal booking notification:', notificationError);
      }
      
      // Clear form and close modal
      setNewBooking({ ...newBooking, date: '', time: '', guests: '', occasion: '' });
      setMealModalVisible(false);
      setSelectedMeal(null);
      
    } catch (err) {
      let msg = 'Meal booking failed.';
      if (err.response && err.response.data) {
        msg += ` Reason: ${JSON.stringify(err.response.data)}`;
      } else if (err.message) {
        msg += ` (${err.message})`;
      }
      setConfirmationError(msg);
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Navigate to marketplace to select a meal
  const handleBrowseMeals = () => {
    navigation.navigate('Marketplace');
  };

  // Filtered reservations (from API)
  const filteredReservations = bookingHistory.filter(r => {
    // Check if reservation object exists
    if (!r) {
      return false;
    }
    
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    const name = r.restaurant_name || r.restaurant || r.meal_name || r.meal || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Guest Mode Indicator */}
      {isGuest && (
        <View style={styles.guestModeIndicator}>
          <Ionicons name="person-outline" size={20} color="#9b59b6" />
          <Text style={styles.guestModeText}>Guest Mode</Text>
          <TouchableOpacity 
            style={styles.convertToUserButton}
            onPress={() => {
              Alert.alert(
                'Convert to Registered User',
                'Would you like to create an account to save your bookings and get personalized recommendations?',
                [
                  { text: 'Not Now', style: 'cancel' },
                  { 
                    text: 'Create Account', 
                    onPress: () => {
                      // Navigate to signup screen
                      navigation.navigate('Onboarding', { screen: 'ChooseAccountType' });
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.convertToUserText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Kebab Menu */}
      <View style={{ alignItems: 'flex-end', marginRight: 16, marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="dots-three-vertical" size={24} color="#27ae60" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('reservations'); setMenuVisible(false); }}>
              <Ionicons name="calendar" size={18} color="#27ae60" />
              <Text style={styles.menuText}>My Reservations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('book'); setMenuVisible(false); }}>
              <Ionicons name="add-circle" size={18} color="#27ae60" />
              <Text style={styles.menuText}>Book New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('invite'); setMenuVisible(false); }}>
              <MaterialIcons name="person-add" size={18} color="#27ae60" />
              <Text style={styles.menuText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tab Content */}
      {activeTab === 'reservations' && (
        bookingLoading ? <ActivityIndicator size="large" style={{ flex: 1 }} /> : bookingError ? <Text style={{ color: 'red', textAlign: 'center' }}>{bookingError}</Text> :
        <>
          {/* Filter Bar */}
          <View style={styles.filterBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {FILTERS.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterBtn, activeFilter === f.key && styles.filterBtnActive]}
                  onPress={() => setActiveFilter(f.key)}
                >
                  <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#27ae60" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurant..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* Reservation List */}
          <FlatList
            data={filteredReservations}
            keyExtractor={item => item.booking_id?.toString() || item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => {
              // Ensure item exists and has required properties
              if (!item) {
                return null;
              }
              
              const title = item.restaurant_name || item.restaurant || item.meal || '';
              const time = item.time ? new Date(item.time).toLocaleString() : '-';
              const guests = item.guests || 1;
              const status = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown';
              const bookingType = item.booking_type || 'restaurant';
              const mealName = item.meal_name || null;
              
              return (
                <View style={styles.reservationCard}>
                  <Text style={styles.resTitle}>{title}</Text>
                  <Text style={styles.resTime}>Time: {time}</Text>
                  <Text style={styles.resGuests}>Guests: {guests}</Text>
                  <Text style={styles.resStatus}>Status: {status}</Text>
                  {bookingType && (
                    <Text style={styles.resType}>
                      Type: {bookingType === 'meal' ? 'Meal Booking' : 'Restaurant Booking'}
                    </Text>
                  )}
                  {mealName && (
                    <Text style={styles.resMeal}>Meal: {mealName}</Text>
                  )}
                  <TouchableOpacity style={styles.bookBtn} onPress={() => fetchConfirmation(item.booking_id || item.id)}>
                    <Text style={styles.bookBtnText}>View Details</Text>
                  </TouchableOpacity>
                  {(status !== 'cancelled' && status !== 'past') && (
                    <TouchableOpacity
                      style={[styles.bookBtn, { backgroundColor: '#ff4e4e', marginTop: 6 }]}
                      onPress={() => handleCancelBooking(item.booking_id || item.id)}
                    >
                      <Text style={[styles.bookBtnText, { color: '#fff' }]}>Cancel Booking</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No reservations found.</Text>}
            refreshControl={
              <RefreshControl
                refreshing={bookingLoading}
                onRefresh={loadBookings}
              />
            }
          />
        </>
      )}

      {activeTab === 'book' && (
        <View style={styles.bookingForm}>
          <Text style={styles.formTitle}>How would you like to book?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 }}>
            <TouchableOpacity
              style={[styles.optionBtn, newBooking.type === 'restaurant' && { backgroundColor: '#27ae60' }]}
              onPress={() => setNewBooking({ ...newBooking, type: 'restaurant' })}
            >
              <Ionicons name="restaurant" size={40} color={newBooking.type === 'restaurant' ? '#fff' : '#27ae60'} />
              <Text style={[styles.optionBtnText, newBooking.type === 'restaurant' && { color: '#fff' }]}>By Restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, newBooking.type === 'meal' && { backgroundColor: '#CAFF4E' }]}
              onPress={() => setNewBooking({ ...newBooking, type: 'meal' })}
            >
              <MaterialIcons name="fastfood" size={40} color={newBooking.type === 'meal' ? '#27ae60' : '#27ae60'} />
              <Text style={[styles.optionBtnText, newBooking.type === 'meal' && { color: '#27ae60' }]}>By Meal</Text>
            </TouchableOpacity>
          </View>
          {newBooking.type === 'restaurant' && (
            <View style={{ marginTop: 32 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#27ae60', marginBottom: 8 }}>Book by Restaurant</Text>
              
              {/* Show selected restaurant if coming from homepage */}
              {newBooking.restaurant_name && (
                <View style={styles.selectedRestaurantCard}>
                  <Ionicons name="restaurant" size={24} color="#27ae60" />
                  <View style={styles.selectedRestaurantInfo}>
                    <Text style={styles.selectedRestaurantName}>{newBooking.restaurant_name}</Text>
                    <Text style={styles.selectedRestaurantId}>Restaurant ID: {newBooking.restaurant}</Text>
                  </View>
                </View>
              )}
              
              {/* Browse restaurants button */}
              <TouchableOpacity 
                style={styles.browseRestaurantsButton} 
                onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
              >
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={styles.browseRestaurantsButtonText}>Browse Restaurants</Text>
              </TouchableOpacity>
              
              <Text style={{ color: '#888', marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
                Select a restaurant from the homepage to continue
              </Text>
            </View>
          )}
          {newBooking.type === 'meal' && (
            <View style={{ marginTop: 32 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#27ae60', marginBottom: 8 }}>Book by Meal</Text>
              
              {/* Show selected meal if coming from marketplace */}
              {newBooking.meal_name && (
                <View style={styles.selectedMealCard}>
                  <MaterialIcons name="fastfood" size={24} color="#27ae60" />
                  <View style={styles.selectedMealInfo}>
                    <Text style={styles.selectedMealName}>{newBooking.meal_name}</Text>
                    <Text style={styles.selectedMealRestaurant}>Restaurant ID: {newBooking.restaurant}</Text>
                  </View>
                </View>
              )}
              
              {/* Browse meals button */}
              <TouchableOpacity 
                style={styles.browseMealsButton} 
                onPress={handleBrowseMeals}
              >
                <MaterialIcons name="search" size={20} color="#fff" />
                <Text style={styles.browseMealsButtonText}>Browse Available Meals</Text>
              </TouchableOpacity>
              
              <Text style={{ color: '#888', marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
                Select a meal from the marketplace to continue
              </Text>
            </View>
          )}
          {/* Meal Booking Modal */}
          <Modal
            visible={mealModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setMealModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#27ae60', marginBottom: 12 }}>Book {selectedMeal}</Text>
                <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={newBooking.date} onChangeText={v => setNewBooking({ ...newBooking, date: v })} />
                <TextInput style={styles.input} placeholder="Time (HH:MM)" value={newBooking.time} onChangeText={v => setNewBooking({ ...newBooking, time: v })} />
                <TextInput style={styles.input} placeholder="Number of Guests" keyboardType="numeric" value={newBooking.guests} onChangeText={v => setNewBooking({ ...newBooking, guests: v })} />
                <TextInput style={styles.input} placeholder="Occasion (optional)" value={newBooking.occasion} onChangeText={v => setNewBooking({ ...newBooking, occasion: v })} />
                <TouchableOpacity style={styles.bookBtn} onPress={handleBookMeal}>
                  <Text style={styles.bookBtnText}>Book Meal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bookBtn, { backgroundColor: '#888', marginTop: 8 }]} onPress={() => setMealModalVisible(false)}>
                  <Text style={styles.bookBtnText}>Cancel</Text>
                </TouchableOpacity>
                {confirmationError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{confirmationError}</Text>}
              </View>
            </View>
          </Modal>
          {/* Restaurant Booking Modal */}
          <Modal
            visible={newBooking.restaurant_name && newBooking.type === 'restaurant'}
            transparent
            animationType="slide"
            onRequestClose={() => setNewBooking({ ...newBooking, restaurant: '', restaurant_name: '' })}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#27ae60', marginBottom: 12 }}>Book {newBooking.restaurant_name}</Text>
                <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={newBooking.date} onChangeText={v => setNewBooking({ ...newBooking, date: v })} />
                <TextInput style={styles.input} placeholder="Time (HH:MM)" value={newBooking.time} onChangeText={v => setNewBooking({ ...newBooking, time: v })} />
                <TextInput style={styles.input} placeholder="Number of Guests" keyboardType="numeric" value={newBooking.guests} onChangeText={v => setNewBooking({ ...newBooking, guests: v })} />
                <TextInput style={styles.input} placeholder="Occasion (optional)" value={newBooking.occasion} onChangeText={v => setNewBooking({ ...newBooking, occasion: v })} />
                <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
                  <Text style={styles.bookBtnText}>Book Table</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bookBtn, { backgroundColor: '#888', marginTop: 8 }]} onPress={() => setNewBooking({ ...newBooking, restaurant: '', restaurant_name: '' })}>
                  <Text style={styles.bookBtnText}>Cancel</Text>
                </TouchableOpacity>
                {confirmationError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{confirmationError}</Text>}
              </View>
            </View>
          </Modal>
        </View>
      )}

      {activeTab === 'confirmation' && (
        confirmationLoading ? <ActivityIndicator size="large" style={{ flex: 1 }} /> : confirmationError ? <Text style={{ color: 'red', textAlign: 'center' }}>{confirmationError}</Text> :
        confirmation && (
          <View style={styles.bookingForm}>
            <Text style={styles.formTitle}>Booking Confirmed!</Text>
            <Text style={styles.label}>Restaurant:</Text>
            <Text style={styles.value}>{confirmation.restaurant_name || confirmation.restaurant_id}</Text>
            <Text style={styles.label}>Date & Time:</Text>
            <Text style={styles.value}>{confirmation.time ? new Date(confirmation.time).toLocaleString() : '-'}</Text>
            <Text style={styles.label}>Guests:</Text>
            <Text style={styles.value}>{confirmation.guests || 1}</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={() => setActiveTab('reservations')}>
              <Text style={styles.bookBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )
      )}

      {activeTab === 'invite' && (
        <View style={styles.inviteForm}>
          <Text style={styles.formTitle}>Invite Someone</Text>
          <TextInput
            style={styles.input}
            placeholder="Friend's Email"
            keyboardType="email-address"
            value={inviteEmail}
            onChangeText={setInviteEmail}
          />
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>Send Invite</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eafaf1', paddingTop: 16 },
  filterBar: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 10 },
  filterBtn: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#f4f4f4', marginRight: 8 },
  filterBtnActive: { backgroundColor: '#CAFF4E' },
  filterText: { color: '#27ae60', fontSize: 13 },
  filterTextActive: { color: '#222', fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 10, marginBottom: 8, paddingHorizontal: 10, height: 38 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  reservationCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginHorizontal: 10, marginVertical: 6, elevation: 2 },
  resTitle: { fontSize: 17, fontWeight: 'bold', color: '#27ae60' },
  resTime: { color: '#555', marginTop: 2 },
  resGuests: { color: '#888', marginTop: 2 },
  resStatus: { marginTop: 6, fontWeight: 'bold' },
  bookingForm: { backgroundColor: '#fff', borderRadius: 16, margin: 18, padding: 18, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 10, textAlign: 'center' },
  input: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 15 },
  bookBtn: { backgroundColor: '#27ae60', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 6 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  inviteForm: { backgroundColor: '#fff', borderRadius: 16, margin: 18, padding: 18, elevation: 2 },
  inviteBtn: { backgroundColor: '#CAFF4E', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 6 },
  inviteBtnText: { color: '#27ae60', fontWeight: 'bold', fontSize: 16 },
  optionBtn: { flex: 1, alignItems: 'center', padding: 18, borderRadius: 16, marginHorizontal: 8 },
  optionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginTop: 8 },
  label: { fontSize: 14, color: '#555', marginTop: 12 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#27ae60' },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  menuBox: { backgroundColor: '#fff', borderRadius: 10, marginTop: 50, marginRight: 16, padding: 12, elevation: 4, minWidth: 180 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuText: { marginLeft: 10, fontSize: 16, color: '#27ae60', fontWeight: 'bold' },
  selectedMealCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: '#f8f9fa', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  selectedMealInfo: { 
    marginLeft: 12,
    flex: 1
  },
  selectedMealName: { 
    fontWeight: 'bold', 
    color: '#27ae60',
    fontSize: 16,
    marginBottom: 4
  },
  selectedMealRestaurant: { 
    color: '#888',
    fontSize: 14
  },
  browseMealsButton: { 
    backgroundColor: '#27ae60', 
    borderRadius: 10, 
    padding: 15, 
    alignItems: 'center', 
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  browseMealsButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
    marginLeft: 8
  },
  resType: { 
    color: '#666', 
    marginTop: 2,
    fontSize: 12,
    fontStyle: 'italic'
  },
  resMeal: { 
    color: '#27ae60', 
    marginTop: 2,
    fontSize: 12,
    fontWeight: 'bold'
  },
  selectedRestaurantCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: '#f8f9fa', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  selectedRestaurantInfo: { 
    marginLeft: 12,
    flex: 1
  },
  selectedRestaurantName: { 
    fontWeight: 'bold', 
    color: '#27ae60',
    fontSize: 16,
    marginBottom: 4
  },
  selectedRestaurantId: { 
    color: '#888',
    fontSize: 14
  },
  browseRestaurantsButton: { 
    backgroundColor: '#27ae60', 
    borderRadius: 10, 
    padding: 15, 
    alignItems: 'center', 
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  browseRestaurantsButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
    marginLeft: 8
  },
  guestModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  guestModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 10
  },
  convertToUserButton: {
    backgroundColor: '#CAFF4E',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  convertToUserText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 16
  },
});