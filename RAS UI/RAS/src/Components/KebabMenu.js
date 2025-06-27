import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function KebabMenu({ onSettings, onThemeChange, onNotifications, themeMode, notificationsEnabled, onNotificationSettings }) {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.iconBtn}>
        <MaterialCommunityIcons name="dots-vertical" size={26} color="#222" />
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setVisible(false); onSettings && onSettings(); }}>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setVisible(false); onNotificationSettings && onNotificationSettings(); }}>
              <Text style={styles.menuText}>Notification Settings</Text>
            </TouchableOpacity>
            <View style={styles.menuItemRow}>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Switch value={themeMode === 'dark'} onValueChange={onThemeChange} />
            </View>
            <View style={styles.menuItemRow}>
              <Text style={styles.menuText}>Notifications</Text>
              <Switch value={notificationsEnabled} onValueChange={onNotifications} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: { marginLeft: 8 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start', // changed from flex-end
    alignItems: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 56, // push menu down a bit from the very top
    marginRight: 12,
    marginLeft: 16,
    padding: 12,
    minWidth: 180,
    elevation: 6,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#222',
  },
});
