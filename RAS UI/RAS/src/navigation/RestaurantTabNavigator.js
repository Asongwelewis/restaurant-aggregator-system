import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RestaurantManagementScreen from '../screens/Restaurant/RestaurantManagementScreen';
import MenuManagementScreen from '../screens/Restaurant/MenuManagementScreen';
import RestaurantProfileScreen from '../screens/RestaurantProfileScreen';
import RatingsAndReviewsScreen from '../screens/RatingsAndReviewsScreen';

const Tab = createBottomTabNavigator();

export default function RestaurantTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#27ae60',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          }
        }}
      >
        <Tab.Screen
          name="RestaurantManagement"
          component={RestaurantManagementScreen}
          options={{
            tabBarLabel: 'Restaurant',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MenuManagement"
          component={MenuManagementScreen}
          options={{
            tabBarLabel: 'Menu',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="RestaurantProfile"
          component={RestaurantProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="RatingsAndReviews"
          component={RatingsAndReviewsScreen}
          options={{
            tabBarLabel: 'Ratings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}