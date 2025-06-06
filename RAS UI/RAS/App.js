import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './Screens/WelcomeScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import PostDetailScreen from './Screens/PostDetailScreen';
import MarketplaceScreen from './Screens/MarketplaceScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MapScreen from './Screens/MapScreen';
import ReservationsScreen from './Screens/ReservationsScreen';
import RestaurantProfileScreen from './Screens/RestaurantProfileScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SplashScreen from './Screens/SplashScreen';
import ChooseAccountTypeScreen from './Screens/ChooseAccountTypeScreen';
import RestaurantRegistrationScreen from './Screens/RestaurantRegistrationScreen';
import SearchScreen from './Screens/SearchScreen';
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
          if (route.name === 'TransactionsAndDeliveries') return <MaterialIcons name="local-shipping" size={size} color={color} />;
          if (route.name === 'Profile') return <Ionicons name="person-circle" size={size} color={color} />;
          if (route.name === 'Map') return <Ionicons name="location-sharp" size={size} color={color} />; // modern pin icon
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} />
      <Tab.Screen name="TransactionsAndDeliveries" component={MarketplaceScreen} options={{ title: 'Transactions & Deliveries' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="ChooseAccountType" component={ChooseAccountTypeScreen} />
        <Stack.Screen name="RestaurantRegistration" component={RestaurantRegistrationScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}