import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import LoginScreen from './LoginScreen'; //please ensure this path is correct based on the project structure

const { width, height } = Dimensions.get('window');

function FloatingBubble({ size, initialTop, initialLeft, delay }) {
  const scale = useRef(new Animated.Value(0)).current;
  const top = useRef(new Animated.Value(initialTop)).current;
  const left = useRef(new Animated.Value(initialLeft)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 1200,
      delay,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(top, {
          toValue: initialTop + 20,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(top, {
          toValue: initialTop - 20,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(top, {
          toValue: initialTop,
          duration: 6000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(left, {
          toValue: initialLeft + 20,
          duration: 7000,
          useNativeDriver: false,
        }),
        Animated.timing(left, {
          toValue: initialLeft - 20,
          duration: 7000,
          useNativeDriver: false,
        }),
        Animated.timing(left, {
          toValue: initialLeft,
          duration: 7000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          backgroundColor: 'rgb(149, 204, 46)',
          position: 'absolute',
          top: top,
          left: left,
          borderRadius: size / 2,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export default function WelcomeScreen({ navigation }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // Add this line
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in title after a short delay
    setTimeout(() => {
      setShowTitle(true);
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowButton(true);
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }, 700);
      });
    }, 1200);
  }, []);

  return (
    <View style={styles.container}>
      {/* Floating Bubbles */}// scrum master adjust size an dposition as needed 
      <FloatingBubble size={180} initialTop={-40} initialLeft={-60} delay={0} />
      <FloatingBubble size={120} initialTop={height * 0.2} initialLeft={width * 0.7} delay={300} />
      <FloatingBubble size={90} initialTop={height * 0.6} initialLeft={-30} delay={600} />
      <FloatingBubble size={140} initialTop={height * 0.7} initialLeft={width * 0.6} delay={900} />

      {/* App Title */}
      {showTitle && (
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>Odis</Text>
        </Animated.View>
      )}

      {/* Get Started Button */}
      {showButton && !showLogin && (
        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => setShowLogin(true)}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Login Overlay */}
      {showLogin && (
        <LoginScreen
          navigation={navigation}
          onClose={() => setShowLogin(false)}
        />
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
  getStartedButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});