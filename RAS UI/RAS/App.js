import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import RestaurantProfileScreen from './src/screens/RestaurantProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SplashScreen from './src/screens/SplashScreen';
import ChooseAccountTypeScreen from './src/screens/ChooseAccountTypeScreen';
import RestaurantRegistrationScreen from './src/screens/RestaurantRegistrationScreen';
import SearchScreen from './src/screens/SearchScreen';
import ShareScreen from './src/screens/ShareScreen';
import RestaurantHomeScreen from './src/screens/RestaurantHomeScreen';
import HomeStack from './src/navigation/HomeStack';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  // Determine user type (restaurant or normal user)
  // Try to get from route.params or AsyncStorage
  const [userType, setUserType] = React.useState(null);
  React.useEffect(() => {
    async function fetchUserType() {
      let type = null;
      if (route && route.params && route.params.userType) {
        type = route.params.userType;
      } else {
        try {
          const tokens = await AsyncStorage.getItem('authTokens');
          const user = tokens ? JSON.parse(tokens).user : null;
          type = user?.type || null;
        } catch (e) { type = null; }
      }
      setUserType(type);
    }
    fetchUserType();
  }, [route]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#d4f3e3',
          borderTopWidth: 1,
          borderTopLeftRadius: 28,   // <-- Add this
          borderTopRightRadius: 28,  // <-- And this
          position: 'absolute',      // <-- Required for border radius to show
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,             // Optional: shadow for Android
          shadowColor: '#000',       // Optional: shadow for iOS
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Ionicons name="home" size={size} color={color} />;
          if (route.name === 'Reservations') return <FontAwesome5 name="calendar-check" size={size} color={color} />;
          if (route.name === 'TransactionsAndDeliveries') return <MaterialIcons name="local-shipping" size={size} color={color} />;
          if (route.name === 'Profile') return <Ionicons name="person-circle" size={size} color={color} />;
          if (route.name === 'Map') return <Ionicons name="location-sharp" size={size} color={color} />; // modern pin icon
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={userType === 'restaurant' ? RestaurantHomeScreen : HomeScreen}
        options={{ title: 'Home' }}
      />
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
        <Stack.Screen name="Share" component={ShareScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}