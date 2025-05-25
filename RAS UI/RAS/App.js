import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './HomeScreen';
import PostDetailScreen from './PostDetailScreen';
import ReservationsScreen from './ReservationsScreen';
import MarketplaceScreen from './MarketplaceScreen';
import ProfileScreen from './ProfileScreen';
import MapScreen from './MapScreen';
import ReservationsScreen from './ReservationsScreen';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#d4f3e3' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Ionicons name="home" size={size} color={color} />;
          if (route.name === 'Reservations') return <FontAwesome5 name="calendar-check" size={size} color={color} />;
          if (route.name === 'Marketplace') return <MaterialIcons name="storefront" size={size} color={color} />;
          if (route.name === 'Profile') return <Ionicons name="person-circle" size={size} color={color} />;
          if (route.name === 'Map') return <Entypo name="map" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="Reservations" component={ReservationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}