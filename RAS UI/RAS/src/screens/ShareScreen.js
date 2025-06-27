import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function ShareScreen({ navigation }) {
  const [dishName, setDishName] = useState('');
  const [review, setReview] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleShare = () => {
    if (!dishName || !review) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    // Here you would send the new dish/review to your backend or state
    Alert.alert('Shared!', 'Your dish/review has been posted.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Go Back Arrow */}
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#27ae60" />
      </TouchableOpacity>
      <Text style={styles.title}>Share a New Dish or Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Write your review..."
        value={review}
        onChangeText={setReview}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.previewImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={48} color="#ccc" />
        </View>
      )}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <FontAwesome name="send" size={20} color="#fff" />
        <Text style={styles.shareBtnText}>Share</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 18,
    marginTop: 32,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d4f3e3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  previewImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 10,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});