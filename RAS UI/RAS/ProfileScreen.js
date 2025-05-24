import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [email, setEmail] = useState('guest@email.com');
  const [username, setUsername] = useState('Guest');
  const [editing, setEditing] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* Username and Email */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Username</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        ) : (
          <Text style={styles.infoText}>{username}</Text>
        )}
        <Text style={styles.label}>Email</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.infoText}>{email}</Text>
        )}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditing(!editing)}
        >
          <Ionicons name={editing ? "checkmark" : "create-outline"} size={20} color="#27ae60" />
          <Text style={styles.editBtnText}>{editing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingRow}>
          <Ionicons name="notifications-outline" size={22} color="#27ae60" />
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? "#27ae60" : "#ccc"}
            trackColor={{ true: "#b7e0c6", false: "#ccc" }}
          />
        </View>
        <View style={styles.settingRow}>
          <MaterialIcons name="lock-outline" size={22} color="#27ae60" />
          <Text style={styles.settingText}>Change Password</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={22} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.settingRow}>
          <FontAwesome name="language" size={22} color="#27ae60" />
          <Text style={styles.settingText}>Language</Text>
          <TouchableOpacity>
            <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support & Logout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="help-circle-outline" size={22} color="#27ae60" />
          <Text style={styles.settingText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <MaterialIcons name="logout" size={22} color="#e74c3c" />
          <Text style={[styles.settingText, { color: '#e74c3c' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
});