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
import HomeStack from './src/navigation/HomeStack';
import SubscriptionScreen from './src/screens/Restaurant/SubscriptionScreen';
import RestaurantTabNavigator from './src/navigation/RestaurantTabNavigator';
import { RestaurantProvider } from './src/context/RestaurantContext';
import { AccountTypeProvider } from './src/context/AccountTypeContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SettingsScreen from './src/screens/Restaurant/SettingsScreen';
import NotificationsScreen from './src/screens/Restaurant/NotificationsScreen';
import RatingsAndReviewsScreen from './src/screens/RatingsAndReviewsScreen';
import GuestMapListScreen from './src/screens/GuestMapListScreen';
import AdvancedBookingScreen from './src/screens/AdvancedBookingScreen';
import AdCampaignsScreen from './src/screens/AdCampaignsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SuperAdminPanel from './src/screens/SuperAdminPanel';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}> 
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#27ae60',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#d4f3e3',
            borderTopWidth: 1,
            borderTopLeftRadius: 18,   // Reduced for smaller screens
            borderTopRightRadius: 18,  // Reduced for smaller screens
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0, // Lowered the tab bar to the very bottom for the user side
            height: 54, // Reduced height for 6-inch screens
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: -1 },
            shadowRadius: 4,
          },
          tabBarIcon: ({ color, size }) => {
            const iconSize = 22; // Slightly smaller icons for compactness
            if (route.name === 'Home') return <Ionicons name="home" size={iconSize} color={color} />;
            if (route.name === 'Reservations') return <FontAwesome5 name="calendar-check" size={iconSize} color={color} />;
            if (route.name === 'TransactionsAndDeliveries') return <MaterialIcons name="local-shipping" size={iconSize} color={color} />;
            if (route.name === 'Profile') return <Ionicons name="person-circle" size={iconSize} color={color} />;
            if (route.name === 'Map') return <Ionicons name="location-sharp" size={iconSize} color={color} />;
            if (route.name === 'RatingsAndReviews') return <Ionicons name="star" size={iconSize} color={color} />;
          },
          tabBarLabelStyle: {
            fontSize: 11, // Smaller font for labels
            marginBottom: 2,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Reservations" component={ReservationsScreen} />
        <Tab.Screen name="TransactionsAndDeliveries" component={MarketplaceScreen} options={{ title: 'Transactions & Deliveries' }} />
        <Tab.Screen name="Profile" component={UserProfileScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="RatingsAndReviews" component={RatingsAndReviewsScreen} options={{
          tabBarLabel: 'Ratings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <AccountTypeProvider>
        <RestaurantProvider>
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
              <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
              <Stack.Screen name="RestaurantTabs" component={RestaurantTabNavigator} />
              <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
              <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
              <Stack.Screen name="RatingsAndReviews" component={RatingsAndReviewsScreen} />
              <Stack.Screen name="GuestMapList" component={GuestMapListScreen} />
              <Stack.Screen name="AdvancedBooking" component={AdvancedBookingScreen} />
              <Stack.Screen name="AdCampaigns" component={AdCampaignsScreen} />
              <Stack.Screen name="Analytics" component={AnalyticsScreen} />
              <Stack.Screen name="SuperAdminPanel" component={SuperAdminPanel} />
            </Stack.Navigator>
          </NavigationContainer>
        </RestaurantProvider>
      </AccountTypeProvider>
    </SafeAreaProvider>
  );
}