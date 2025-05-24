import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

function Bubble({ size, top, left, delay }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 1200,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          top,
          left,
          backgroundColor: 'rgba(46, 204, 113, 0.3)',
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export default function WelcomeScreen({ navigation }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show title after bubbles
    setTimeout(() => {
      setShowTitle(true);
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowButtons(true);
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }).start();
        }, 700);
      });
    }, 1400);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Bubbles */}
      <Bubble size={180} top={-40} left={-60} delay={0} />
      <Bubble size={120} top={height * 0.2} left={width * 0.7} delay={300} />
      <Bubble size={90} top={height * 0.6} left={-30} delay={600} />
      <Bubble size={140} top={height * 0.7} left={width * 0.6} delay={900} />

      {/* App Title */}
      {showTitle && (
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>Foodist</Text>
        </Animated.View>
      )}

      {/* Login/Signup Buttons */}
      {showButtons && (
        <Animated.View style={{ opacity: buttonsOpacity }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation && navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation && navigation.navigate('Signup')}
          >
            <Text style={[styles.buttonText, styles.signupText]}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#27ae60',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(39, 174, 96, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  signupText: {
    color: '#27ae60',
  },
});