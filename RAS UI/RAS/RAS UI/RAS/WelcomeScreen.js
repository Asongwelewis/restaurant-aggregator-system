import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import LoginScreen from './LoginScreen';

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
          backgroundColor: '#CAFF4E',
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
  const [showLogin, setShowLogin] = useState(false);
  const [showBubbles, setShowBubbles] = useState(true); // NEW: control bubbles visibility

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const oScale = useRef(new Animated.Value(1)).current;
  const oOpacity = useRef(new Animated.Value(1)).current;
  const restOpacity = useRef(new Animated.Value(1)).current;

  // Animation sequence as a function so we can call it on mount and after closing login
  const playIntroAnimation = useCallback(() => {
    titleOpacity.setValue(0);
    buttonOpacity.setValue(0);
    oScale.setValue(1);
    oOpacity.setValue(1);
    restOpacity.setValue(1);
    setShowTitle(false);
    setShowButton(false);
    setShowBubbles(true); // Show bubbles again on replay

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
  }, [titleOpacity, buttonOpacity, oScale, oOpacity, restOpacity]);

  useEffect(() => {
    playIntroAnimation();
  }, [playIntroAnimation]);

  const handleGetStarted = () => {
    // Hide bubbles just before the "O" grows
    setShowBubbles(false);
    Animated.parallel([
      Animated.timing(oScale, {
        toValue: 40, // Large enough to cover the screen
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(restOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(oOpacity, {
        toValue: 0,
        delay: 900,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLogin(true);
    });
  };

  // When closing login, reset state and replay animation
  const handleCloseLogin = () => {
    setShowLogin(false);
    playIntroAnimation();
  };

  return (
    <View style={styles.container}>
      {/* Floating Bubbles */}
      {showBubbles && (
        <>
          <FloatingBubble size={180} initialTop={-40} initialLeft={-60} delay={0} />
          <FloatingBubble size={120} initialTop={height * 0.2} initialLeft={width * 0.7} delay={300} />
          <FloatingBubble size={90} initialTop={height * 0.6} initialLeft={-30} delay={600} />
          <FloatingBubble size={140} initialTop={height * 0.7} initialLeft={width * 0.6} delay={900} />
        </>
      )}

      {/* App Title with animated "O" */}
      {showTitle && !showLogin && (
        <Animated.View style={{ opacity: titleOpacity, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.Text
            style={[
              styles.title,
              {
                color: '#CAFF4E',
                textShadowColor: '#CAFF4E',
                transform: [{ scale: oScale }],
                opacity: oOpacity,
                zIndex: 10,
              },
            ]}
          >
            O
          </Animated.Text>
          <Animated.Text style={[styles.title, { opacity: restOpacity }]}>
            dis
          </Animated.Text>
        </Animated.View>
      )}

      {/* Get Started Button */}
      {showButton && !showLogin && (
        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Login Overlay */}
      {showLogin && (
        <LoginScreen
          navigation={navigation}
          onClose={handleCloseLogin}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#CAFF4E',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  getStartedButtonText: {
    color: '#27ae60',
    fontSize: 20,
    fontWeight: 'bold',
  },
});