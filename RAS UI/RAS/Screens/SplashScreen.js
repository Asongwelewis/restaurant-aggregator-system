import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, ActivityIndicator, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Make the circle take the whole upper half and the image the whole lower half
const BIG_CIRCLE_SIZE = width * 1.5; // Wide enough to cover the top
const PLATE_IMAGE_HEIGHT = height * 0.55; // Take most of the lower half

export default function SplashScreen({ onFinish }) {
  // Animated values for the big circle and small bubbles
  const bigCircleScale = useRef(new Animated.Value(1)).current;
  const smallBubbles = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Simulate loading (replace with your real loading logic)
    setTimeout(() => {
      // Animate big circle shrinking and small bubbles appearing
      Animated.sequence([
        Animated.timing(bigCircleScale, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.stagger(120, smallBubbles.map(bubble =>
          Animated.timing(bubble, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )),
      ]).start(() => {
        // After animation, call onFinish to show WelcomeScreen
        setTimeout(onFinish, 500);
      });
    }, 1800); // Simulate loading time
  }, []);

  // Bubble positions (match WelcomeScreen)
  const bubblesConfig = [
    { size: 180, top: -40, left: -60 },
    { size: 120, top: height * 0.2, left: width * 0.7 },
    { size: 90, top: height * 0.6, left: -30 },
    { size: 140, top: height * 0.7, left: width * 0.6 },
  ];

  return (
    <View style={styles.container}>
      {/* Big Circle at the Top */}
      <Animated.View
        style={[
          styles.bigCircle,
          {
            transform: [{ scale: bigCircleScale }],
          },
        ]}
      />

      {/* Small Bubbles (appear after big circle animates out) */}
      {bubblesConfig.map((cfg, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.bubble,
            {
              width: cfg.size,
              height: cfg.size,
              top: cfg.top,
              left: cfg.left,
              opacity: smallBubbles[idx],
              transform: [{ scale: smallBubbles[idx] }],
            },
          ]}
        />
      ))}

      {/* Plate and Spoon Image at the Bottom */}
      <View style={styles.bottomImageContainer}>
        <Image
          source={require('./assets/plate_spoon.png')}
          style={styles.plateImage}
          resizeMode="contain"
        />
      </View>

      {/* Loading Spinner */}
      <ActivityIndicator size="large" color="#CAFF4E" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bigCircle: {
    position: 'absolute',
    top: -BIG_CIRCLE_SIZE * 0.35, // Pull up so it covers the upper half
    left: width / 2 - BIG_CIRCLE_SIZE / 2,
    width: BIG_CIRCLE_SIZE,
    height: BIG_CIRCLE_SIZE,
    borderRadius: BIG_CIRCLE_SIZE / 2,
    backgroundColor: '#CAFF4E',
    zIndex: 2,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#CAFF4E',
    borderRadius: 100,
    zIndex: 1,
  },
  bottomImageContainer: {
    position: 'absolute',
    bottom: -100, // was 0, now moved 30px lower
    left: 0,
    right: 0,
    alignItems: 'center',
    height: PLATE_IMAGE_HEIGHT,
    justifyContent: 'flex-end',
  },
  plateImage: {
    width: width,
    height: PLATE_IMAGE_HEIGHT,
  },
  loader: {
    position: 'absolute',
    top: height * 0.55,
    alignSelf: 'center',
  },
});