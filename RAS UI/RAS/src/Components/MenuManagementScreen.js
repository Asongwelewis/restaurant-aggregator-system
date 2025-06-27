import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const RESTAURANT_ID = 1; // TODO: Replace with real owner context

export default function MenuManagementScreen() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', available: true });

  // Fetch meals
  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/restaurants/${RESTAURANT_ID}/meals`);
      setMeals(res.data.meals || []);
    } catch (err) {
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeals(); }, []);

  // Add or update meal
  const handleSaveMeal = async () => {
    if (!form.name || !form.price) {
      Alert.alert('Name and price are required.');
      return;
    }
    try {
      if (editMeal) {
        await axios.put(`${API_BASE_URL}/restaurants/${RESTAURANT_ID}/meals/${editMeal.id}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/restaurants/${RESTAURANT_ID}/meals`, form);
      }
      setModalVisible(false);
      setEditMeal(null);
      setForm({ name: '', description: '', price: '', image_url: '', available: true });
      fetchMeals();
    } catch (err) {
      Alert.alert('Failed to save meal.');
    }
  };

  // Edit meal
  const handleEdit = (meal) => {
    setEditMeal(meal);
    setForm({
      name: meal.name,
      description: meal.description,
      price: String(meal.price),
      image_url: meal.image_url || '',
      available: meal.available !== false,
    });
    setModalVisible(true);
  };

  // Delete meal
  const handleDelete = async (mealId) => {
    Alert.alert('Delete Meal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/restaurants/${RESTAURANT_ID}/meals/${mealId}`);
          fetchMeals();
        } catch {
          Alert.alert('Failed to delete meal.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Management</Text>
      {loading ? <ActivityIndicator size="large" /> : error ? <Text style={styles.error}>{error}</Text> : (
        <FlatList
          data={meals}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.mealCard}>
              {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.mealImage} /> : <MaterialIcons name="fastfood" size={32} color="#27ae60" />}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealDesc}>{item.description}</Text>
                <Text style={styles.mealPrice}>${item.price}</Text>
                <Text style={styles.mealAvail}>{item.available ? 'Available' : 'Unavailable'}</Text>
              </View>
              <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 8 }}>
                <Ionicons name="create-outline" size={22} color="#27ae60" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#ff4e4e" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No meals found.</Text>}
        />
      )}
      <TouchableOpacity style={styles.addBtn} onPress={() => { setEditMeal(null); setForm({ name: '', description: '', price: '', image_url: '', available: true }); setModalVisible(true); }}>
        <Ionicons name="add-circle" size={28} color="#fff" />
        <Text style={styles.addBtnText}>Add Meal</Text>
      </TouchableOpacity>
      {/* Meal Form Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.formTitle}>{editMeal ? 'Edit Meal' : 'Add Meal'}</Text>
              <TextInput style={styles.input} placeholder="Meal Name" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
              <TextInput style={styles.input} placeholder="Description" value={form.description} onChangeText={v => setForm({ ...form, description: v })} />
              <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={form.price} onChangeText={v => setForm({ ...form, price: v })} />
              <TextInput style={styles.input} placeholder="Image URL (optional)" value={form.image_url} onChangeText={v => setForm({ ...form, image_url: v })} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                <Text style={{ marginRight: 8 }}>Available:</Text>
                <TouchableOpacity onPress={() => setForm({ ...form, available: !form.available })} style={styles.toggleBtn}>
                  <Ionicons name={form.available ? 'checkmark-circle' : 'close-circle'} size={24} color={form.available ? '#27ae60' : '#ff4e4e'} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMeal}>
                <Text style={styles.saveBtnText}>{editMeal ? 'Update' : 'Add'} Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#888', marginTop: 8 }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.saveBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eafaf1', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 16, textAlign: 'center' },
  error: { color: 'red', textAlign: 'center', marginVertical: 10 },
  mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginVertical: 6, elevation: 2 },
  mealImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#eee' },
  mealName: { fontWeight: 'bold', fontSize: 16, color: '#27ae60' },
  mealDesc: { color: '#555', fontSize: 13 },
  mealPrice: { color: '#222', fontWeight: 'bold', marginTop: 2 },
  mealAvail: { color: '#888', fontSize: 12, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#27ae60', borderRadius: 10, padding: 12, justifyContent: 'center', marginTop: 18 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 18, width: '90%', maxHeight: '90%' },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 10, textAlign: 'center' },
  input: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 15 },
  toggleBtn: { marginLeft: 4 },
  saveBtn: { backgroundColor: '#27ae60', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 6 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
