import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChooseAccountTypeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>???</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Signup')}
        >
          <Ionicons name="person-circle" size={64} color="#27ae60" />
          <Text style={styles.optionText}>I'm a Person</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('RestaurantRegistration')}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={64} color="#CAFF4E" />
          <Text style={styles.optionText}>I'm a Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#27ae60' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  option: {
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 18,
    padding: 30,
    marginHorizontal: 10,
    elevation: 2,
  },
  optionText: { marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#222' },
});