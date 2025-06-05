import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainHomeScreen from './MainHomeScreen';
import ReservationsScreen from './ReservationsScreen';
import MarketplaceScreen from './MarketplaceScreen';
import ProfileScreen from './ProfileScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#d4f3e3' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'mainHome') {
            return <Ionicons name="home" size={size} color={color} />;
          }
          if (route.name === 'Reservations') {
            return <Ionicons name="calendar" size={size} color={color} />;
          }
          if (route.name === 'Marketplace') {
            return <Ionicons name="cart" size={size} color={color} />;
          }
          if (route.name === 'Profile') {
            return <Ionicons name="person" size={size} color={color} />;
          }
          if (route.name === 'Map') {
            // Changed to a modern pin icon
            return <Ionicons name="location-sharp" size={size} color={color} />;
          }
        },
      })}>
      <Tab.Screen name="mainHome" component={MainHomeScreen} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}