import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const bubbleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bubbleScale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Bubble */}
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{ scale: bubbleScale }],
          },
        ]}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={90} color="#fff" />
        </View>
        {/* Login Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username or number"
            placeholderTextColor="#eafaf1"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#eafaf1"
            secureTextEntry
          />
        </View>
      </Animated.View>

      {/* Lower Section */}
      <View style={styles.lowerSection}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation && navigation.navigate('Signup')}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or sign in with</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={28} color="#db4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={28} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="apple1" size={28} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BUBBLE_HEIGHT = height * 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bubble: {
    position: 'absolute',
    top: 0,
    left: -width * 0.1,
    width: width * 1.2,
    height: BUBBLE_HEIGHT,
    backgroundColor: '#27ae60',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
    alignItems: 'center',
    paddingTop: 60,
    zIndex: 2,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 8,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  lowerSection: {
    position: 'absolute',
    top: BUBBLE_HEIGHT - 30,
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    zIndex: 1,
  },
  signupButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  signupText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  orText: {
    color: '#888',
    marginVertical: 18,
    fontSize: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 12,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});