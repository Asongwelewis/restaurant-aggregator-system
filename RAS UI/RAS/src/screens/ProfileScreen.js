import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, TextInput, Alert, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../api/config';

// For language support, you would use a library like i18n-js or react-i18next in a real app
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];

export default function ProfileScreen(props) {
  // Add fallback for useTheme
  let themeContext;
  try {
    themeContext = useTheme();
  } catch {
    themeContext = {};
  }
  const darkMode = themeContext?.darkMode ?? false;
  const setDarkMode = themeContext?.setDarkMode ?? (() => {});
  const theme = darkMode ? darkStyles : styles;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [languageModal, setLanguageModal] = useState(false);

  // Fetch user info from backend using stored token
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setFetchError('');
      try {
        const tokens = await AsyncStorage.getItem('authTokens');
        if (!tokens) throw new Error('No authentication token found.');
        // Parse tokens and get id_token (not access)
        const parsedTokens = JSON.parse(tokens);
        const idToken = parsedTokens.id_token || parsedTokens.idToken || parsedTokens.access || parsedTokens.token;
        if (!idToken) throw new Error('No id_token found in stored tokens.');

        console.log('idToken being sent:', idToken);

        // Use the correct endpoint and header
        const endpoint = '/auth/profile';
        console.log('Trying endpoint:', `${BASE_URL}${endpoint}`);
        const res = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: { 'id-token': idToken }
        });

        setUser(res.data);
        setPhone(res.data.phone || '');
        setBio(res.data.bio || '');
      } catch (err) {
        console.log('Profile fetch error:', err?.response?.data || err.message || err);
        setFetchError(
          err?.response?.data?.detail ||
          err?.message ||
          'Failed to load profile.'
        );
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {/* handle delete */} }
      ]
    );
  };

  // Placeholder for notification logic
  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    if (value) {
      // Register for push notifications here
      Alert.alert("Notifications enabled", "You will receive notifications about new posts.");
    } else {
      // Unregister or mute notifications here
      Alert.alert("Notifications disabled", "You will not receive notifications.");
    }
  };

  // Placeholder for language change logic
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLanguageModal(false);
    // Here you would update your i18n library and reload texts
    Alert.alert("Language changed", `App language set to ${lang.label}`);
  };

  if (loading) {
    return (
      <View style={[theme.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={[theme.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{fetchError}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.container}>
      {/* Profile Picture */}
      <TouchableOpacity style={theme.avatarContainer}>
        <Image
          source={{ uri: user?.profilePic || 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={theme.avatar}
        />
        <Text style={theme.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* Username, Email, Phone, Bio */}
      <View style={theme.infoSection}>
        <Text style={theme.label}>Username</Text>
        {editing ? (
          <TextInput
            style={theme.input}
            value={user?.username || ''}
            editable={false}
          />
        ) : (
          <Text style={theme.infoText}>{user?.username || ''}</Text>
        )}
        <Text style={theme.label}>Email</Text>
        {editing ? (
          <TextInput
            style={theme.input}
            value={user?.email || ''}
            editable={false}
          />
        ) : (
          <Text style={theme.infoText}>{user?.email || ''}</Text>
        )}
        <Text style={theme.label}>Phone</Text>
        {editing ? (
          <TextInput
            style={theme.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Add your phone number"
            placeholderTextColor={darkMode ? "#aaa" : "#888"}
          />
        ) : (
          <Text style={theme.infoText}>{user?.phone || "Not set"}</Text>
        )}
        <Text style={theme.label}>Bio</Text>
        {editing ? (
          <TextInput
            style={[theme.input, { minHeight: 40 }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor={darkMode ? "#aaa" : "#888"}
            multiline
          />
        ) : (
          <Text style={theme.infoText}>{user?.bio || "No bio yet."}</Text>
        )}
        <TouchableOpacity
          style={theme.editBtn}
          onPress={() => setEditing(!editing)}
        >
          <Ionicons name={editing ? "checkmark" : "create-outline"} size={20} color="#27ae60" />
          <Text style={theme.editBtnText}>{editing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={theme.section}>
        <Text style={theme.sectionTitle}>Settings</Text>
        <View style={theme.settingRow}>
          <Ionicons name="notifications-outline" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            thumbColor={notificationsEnabled ? "#27ae60" : "#ccc"}
            trackColor={{ true: "#b7e0c6", false: "#ccc" }}
          />
        </View>
        <View style={theme.settingRow}>
          <Ionicons name="moon" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#27ae60" : "#ccc"}
            trackColor={{ true: "#b7e0c6", false: "#ccc" }}
          />
        </View>
        <View style={theme.settingRow}>
          <MaterialIcons name="lock-outline" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Private Account</Text>
          <Switch
            value={privateAccount}
            onValueChange={setPrivateAccount}
            thumbColor={privateAccount ? "#27ae60" : "#ccc"}
            trackColor={{ true: "#b7e0c6", false: "#ccc" }}
          />
        </View>
        <View style={theme.settingRow}>
          <MaterialIcons name="lock-outline" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Change Password</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={22} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={theme.settingRow}>
          <FontAwesome name="language" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Language</Text>
          <TouchableOpacity onPress={() => setLanguageModal(true)}>
            <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>{language.label}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Modal */}
      <Modal
        visible={languageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModal(false)}
      >
        <View style={theme.modalOverlay}>
          <View style={theme.modalContent}>
            <Text style={theme.sectionTitle}>Select Language</Text>
            {LANGUAGES.map(lang => (
              <Pressable
                key={lang.code}
                style={theme.languageOption}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text style={[
                  theme.languageText,
                  lang.code === language.code && { color: '#27ae60', fontWeight: 'bold' }
                ]}>
                  {lang.label}
                </Text>
              </Pressable>
            ))}
            <TouchableOpacity onPress={() => setLanguageModal(false)} style={{ marginTop: 12 }}>
              <Text style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Support & Logout */}
      <View style={theme.section}>
        <Text style={theme.sectionTitle}>Support</Text>
        <TouchableOpacity style={theme.settingRow}>
          <Ionicons name="help-circle-outline" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.settingRow}>
          <MaterialIcons name="policy" size={22} color="#27ae60" />
          <Text style={theme.settingText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.settingRow}>
          <MaterialIcons name="delete-forever" size={22} color="#e74c3c" />
          <Text style={[theme.settingText, { color: '#e74c3c' }]}>Delete Account</Text>
          <TouchableOpacity onPress={handleDeleteAccount}>
            <Ionicons name="chevron-forward" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={theme.settingRow}>
          <MaterialIcons name="logout" size={22} color="#e74c3c" />
          <Text style={[theme.settingText, { color: '#e74c3c' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Light theme styles
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#27ae60',
  },
  changePhotoText: {
    color: '#27ae60',
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  label: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
  },
  infoText: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#27ae60',
    marginBottom: 4,
    paddingVertical: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  editBtnText: {
    color: '#27ae60',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 15,
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  languageOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#222',
  },
});

// Dark theme styles
const darkStyles = StyleSheet.create({
  ...styles,
  container: {
    ...styles.container,
    backgroundColor: '#181a1b',
  },
  infoSection: {
    ...styles.infoSection,
    backgroundColor: '#232526',
  },
  section: {
    ...styles.section,
    backgroundColor: '#232526',
  },
  label: {
    ...styles.label,
    color: '#aaa',
  },
  infoText: {
    ...styles.infoText,
    color: '#fff',
  },
  input: {
    ...styles.input,
    color: '#fff',
    borderBottomColor: '#27ae60',
  },
  sectionTitle: {
    ...styles.sectionTitle,
    color: '#27ae60',
  },
  settingText: {
    ...styles.settingText,
    color: '#fff',
  },
  modalContent: {
    ...styles.modalContent,
    backgroundColor: '#232526',
  },
  languageText: {
    ...styles.languageText,
    color: '#fff',
  },
});