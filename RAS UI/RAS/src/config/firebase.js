// React Native Firebase Configuration
// This file contains configuration for React Native Firebase
// The actual Firebase initialization is handled by the native modules

// Google Sign-In Configuration
export const googleSignInConfig = {
  webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com', // Get this from Firebase console
  iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com', // Optional for iOS
  offlineAccess: true,
};

// Facebook Login Configuration
export const facebookLoginConfig = {
  appId: 'YOUR_FACEBOOK_APP_ID',
  appName: 'Restaurant Aggregator',
  version: 'v18.0', // Latest Facebook SDK version
};

// API Configuration
export const apiConfig = {
  baseUrl: 'http://192.168.66.36:8000', // Your FastAPI backend URL
  timeout: 10000,
};

// Instructions to set up React Native Firebase:
/*
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication in Firebase Console
3. Add Email/Password, Google, and Facebook sign-in methods
4. Download google-services.json (Android) and GoogleService-Info.plist (iOS)
5. Place them in the appropriate directories:
   - Android: android/app/google-services.json
   - iOS: ios/GoogleService-Info.plist

For Google Login:
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs for your app
4. Replace webClientId above with your web client ID

For Facebook Login:
1. Create a Facebook App at https://developers.facebook.com/
2. Add Facebook Login product
3. Configure OAuth settings
4. Replace appId above with your Facebook app ID

For Android setup:
1. Add google-services.json to android/app/
2. Update android/build.gradle and android/app/build.gradle
3. Configure Facebook SDK in android/app/src/main/res/values/strings.xml

For iOS setup:
1. Add GoogleService-Info.plist to ios/
2. Update ios/Podfile
3. Configure Facebook SDK in Info.plist
*/ 