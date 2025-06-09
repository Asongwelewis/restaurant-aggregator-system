// Example: WelcomeWithLoginScreen.js
import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';

export default function WelcomeWithLoginScreen({ navigation }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <React.Fragment>
      <WelcomeScreen
        navigation={{
          ...navigation,
          navigate: () => setShowLogin(true), // Show login overlay
        }}
      />
      {showLogin && (
        <LoginScreen
          navigation={navigation}
          // Optionally pass a prop to close the login overlay
        />
      )}
    </React.Fragment>
  );
}