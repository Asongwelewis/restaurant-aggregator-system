import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { loginUser } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../api/config';

// Function to fetch protected data
export async function fetchProtectedData() {
  const idToken = await AsyncStorage.getItem('idToken');
  const response = await axios.get(`${BASE_URL}/protected-endpoint`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
}

// Function to save tokens securely
export async function saveTokens({ userId, idToken, refreshToken, accessToken }) {
  if (userId) await AsyncStorage.setItem('userId', userId);
  if (idToken) await AsyncStorage.setItem('idToken', idToken);
  if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
  if (accessToken) await AsyncStorage.setItem('accessToken', accessToken);
}

export default function LoginButton({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const tokens = await loginUser(email, password);
      await saveTokens(tokens);
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
      Alert.alert("Login Successful", "You have successfully logged in!");
      if (navigation) navigation.replace('MainTabs');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation && navigation.navigate('Signup')}
          style={styles.link}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    width: '100%',
    alignSelf: 'center',
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: '#d4f3e3',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
});