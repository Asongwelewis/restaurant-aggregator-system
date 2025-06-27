import React, { useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import KebabMenu from '../../Components/KebabMenu';
import { AccountTypeContext } from '../../context/AccountTypeContext';
import { RestaurantContext } from '../../context/RestaurantContext';
import { createMeal } from '../../api/meals';

export default function MenuManagementScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      name: 'Classic Burger',
      price: 12.99,
      description: 'Juicy beef patty with fresh vegetables',
      category: 'Main Course',
      image: null
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItem, setEditItem] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [themeMode, setThemeMode] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const scrollViewRef = useRef();
  const itemRefs = useRef({});
  const { accountType, switchAccount } = React.useContext(AccountTypeContext);
  const { restaurants, currentRestaurantId } = useContext(RestaurantContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }
  };

  const handleAddItem = async () => {
    const item = {
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category,
      image: newItem.image, // This is a local URI; now handled as file upload
    };
    try {
      // Use currentRestaurantId from context
      const restaurantId = currentRestaurantId;
      if (!restaurantId) throw new Error('No restaurant ID found');
      await createMeal(item, restaurantId);
      setNewItem({ name: '', price: '', description: '', category: '', image: null });
      setShowAddForm(false);
      // Optionally show a success message
    } catch (e) {
      // Optionally show an error message
      console.error(e);
    }
  };

  const pickEditImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setEditItem(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setEditItem({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      category: item.category,
      image: item.image || null
    });
  };

  const handleSaveEdit = () => {
    setMenuItems(prev => prev.map(item =>
      item.id === editingItemId ? { ...item, ...editItem, price: parseFloat(editItem.price) } : item
    ));
    setEditingItemId(null);
    setEditItem({ name: '', price: '', description: '', category: '', image: null });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditItem({ name: '', price: '', description: '', category: '', image: null });
  };

  const MenuItem = ({ item }) => {
    if (editingItemId === item.id) {
      return (
        <View style={[styles.menuItem, { alignItems: 'flex-start' }]}>  
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={editItem.name}
              onChangeText={text => setEditItem(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="decimal-pad"
              value={editItem.price}
              onChangeText={text => setEditItem(prev => ({ ...prev, price: text }))}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              value={editItem.description}
              onChangeText={text => setEditItem(prev => ({ ...prev, description: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={editItem.category}
              onChangeText={text => setEditItem(prev => ({ ...prev, category: text }))}
            />
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity style={[styles.saveButton, { marginRight: 8 }]} onPress={handleSaveEdit}>
                <LinearGradient colors={['#27ae60', '#2ecc71']} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCancelEdit}>
                <LinearGradient colors={['#ccc', '#eee']} style={styles.saveButtonGradient}>
                  <Text style={[styles.saveButtonText, { color: '#333' }]}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{ alignSelf: 'center' }} onPress={pickEditImage}>
            {editItem.image ? (
              <Image source={{ uri: editItem.image }} style={styles.itemImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={40} color="#27ae60" />
                <Text style={styles.imageText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.menuItem}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="food" size={40} color="#27ae60" />
          </View>
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <MaterialCommunityIcons name="pencil" size={24} color="#27ae60" />
        </TouchableOpacity>
      </View>
    );
  };

  const getMenuItemsByCategory = () => {
    const grouped = {};
    menuItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  // Category filter bar
  const renderCategoryFilter = () => {
    const grouped = getMenuItemsByCategory();
    const categories = Object.keys(grouped);
    return (
      <View style={{ flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedCategory === 'All' ? '#27ae60' : '#eee',
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 8,
            marginBottom: 6,
          }}
          onPress={() => setSelectedCategory('All')}
        >
          <Text style={{ color: selectedCategory === 'All' ? '#fff' : '#27ae60', fontWeight: 'bold' }}>All</Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={{
              backgroundColor: selectedCategory === category ? '#27ae60' : '#eee',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 16,
              marginRight: 8,
              marginBottom: 6,
            }}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={{ color: selectedCategory === category ? '#fff' : '#27ae60', fontWeight: 'bold' }}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Instagram-style grid gallery grouped by category, with filter
  const renderGallery = () => {
    const grouped = getMenuItemsByCategory();
    let categoriesToShow = Object.keys(grouped);
    if (selectedCategory !== 'All') categoriesToShow = [selectedCategory];
    return (
      <View style={{ marginBottom: 24 }}>
        {categoriesToShow.map(category => {
          const items = grouped[category];
          const rows = [];
          for (let i = 0; i < items.length; i += 3) {
            rows.push(items.slice(i, i + 3));
          }
          return (
            <View key={category} style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 6, color: '#27ae60' }}>{category}</Text>
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  {row.map((item, colIndex) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{ flex: 1, aspectRatio: 1, marginHorizontal: 2 }}
                      onPress={() => {
                        if (itemRefs.current[item.id]) {
                          itemRefs.current[item.id].measureLayout(
                            scrollViewRef.current,
                            (x, y) => scrollViewRef.current.scrollTo({ y, animated: true }),
                            () => {}
                          );
                        }
                      }}
                    >
                      {item.image ? (
                        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
                      ) : (
                        <View style={{ width: '100%', height: '100%', backgroundColor: '#eee', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialCommunityIcons name="food" size={32} color="#bbb" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  {/* Fill empty columns if needed */}
                  {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
                    <View key={i} style={{ flex: 1, aspectRatio: 1, marginHorizontal: 2 }} />
                  ))}
                </View>
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingBottom: 8, paddingHorizontal: 18 }}>
        <Text style={[styles.title, { flex: 1, marginBottom: 0 }]}>Menu Management</Text>
        <KebabMenu
          onSettings={() => navigation.navigate('SettingsScreen', { themeMode, onThemeChange: () => setThemeMode(m => m === 'dark' ? 'light' : 'dark'), notificationsEnabled, onNotifications: () => setNotificationsEnabled(n => !n) })}
          onNotificationSettings={() => navigation.navigate('NotificationsScreen')}
          onThemeChange={() => setThemeMode(m => m === 'dark' ? 'light' : 'dark')}
          onNotifications={() => setNotificationsEnabled(n => !n)}
          themeMode={themeMode}
          notificationsEnabled={notificationsEnabled}
        />
      </View>
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={styles.content}>
        {renderCategoryFilter()}
        {renderGallery()}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.addButtonGradient}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add New Item</Text>
          </LinearGradient>
        </TouchableOpacity>

        {showAddForm && (
          <View style={styles.addForm}>
            <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
              {newItem.image ? (
                <Image source={{ uri: newItem.image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons name="camera-plus" size={40} color="#27ae60" />
                  <Text style={styles.imageText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={text => setNewItem(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="decimal-pad"
              value={newItem.price}
              onChangeText={text => setNewItem(prev => ({ ...prev, price: text }))}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              value={newItem.description}
              onChangeText={text => setNewItem(prev => ({ ...prev, description: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newItem.category}
              onChangeText={text => setNewItem(prev => ({ ...prev, category: text }))}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddItem}
            >
              <LinearGradient
                colors={['#27ae60', '#2ecc71']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Save Item</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menuList}>
          {menuItems.map(item => (
            <View
              key={item.id}
              ref={ref => (itemRefs.current[item.id] = ref)}
            >
              <MenuItem item={item} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.1,
  },
  circle1: {
    backgroundColor: '#27ae60',
    width: 400,
    height: 400,
    top: -200,
    right: -200,
  },
  circle2: {
    backgroundColor: '#CAFF4E',
    width: 300,
    height: 300,
    bottom: -150,
    left: -150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 24,
  },
  addButton: {
    marginBottom: 20,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  imageSelector: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#27ae60',
    borderStyle: 'dashed',
  },
  imageText: {
    color: '#27ae60',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 8,
  },
  saveButtonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuList: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  itemPrice: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
});