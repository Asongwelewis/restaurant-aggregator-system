import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RatingReviewScreen({ navigation, route }) {
  const { item, type } = route.params; // 'restaurant' or 'meal'
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    loadExistingReview();
  }, []);

  const loadExistingReview = async () => {
    try {
      const savedReviews = await AsyncStorage.getItem('user_reviews');
      if (savedReviews) {
        const reviews = JSON.parse(savedReviews);
        const existing = reviews.find(r => r.itemId === item.id && r.type === type);
        if (existing) {
          setExistingReview(existing);
          setRating(existing.rating);
          setReview(existing.review);
          setPhotos(existing.photos || []);
        }
      }
    } catch (error) {
      console.error('Error loading existing review:', error);
    }
  };

  const handleStarPress = (starIndex) => {
    setRating(starIndex + 1);
  };

  const addPhoto = () => {
    // In a real app, this would open camera/gallery
    Alert.alert('Add Photo', 'Photo functionality coming soon!');
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    if (review.trim().length < 10) {
      Alert.alert('Review Required', 'Please write a review with at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const newReview = {
        id: existingReview?.id || Date.now().toString(),
        itemId: item.id,
        type: type,
        rating: rating,
        review: review.trim(),
        photos: photos,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        itemName: item.name,
        itemImage: item.image,
        restaurantName: type === 'meal' ? item.restaurant : item.name,
      };

      const savedReviews = await AsyncStorage.getItem('user_reviews');
      let reviews = savedReviews ? JSON.parse(savedReviews) : [];
      
      // Remove existing review if updating
      reviews = reviews.filter(r => !(r.itemId === item.id && r.type === type));
      
      // Add new review
      reviews.push(newReview);
      
      await AsyncStorage.setItem('user_reviews', JSON.stringify(reviews));
      
      Alert.alert(
        'Review Submitted!',
        'Thank you for your review. It helps other users make better decisions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const savedReviews = await AsyncStorage.getItem('user_reviews');
              let reviews = savedReviews ? JSON.parse(savedReviews) : [];
              reviews = reviews.filter(r => !(r.itemId === item.id && r.type === type));
              await AsyncStorage.setItem('user_reviews', JSON.stringify(reviews));
              
              Alert.alert('Review Deleted', 'Your review has been removed.');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Failed to delete review.');
            }
          }
        }
      ]
    );
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starContainer}
        >
          <Ionicons
            name={i < rating ? "star" : "star-outline"}
            size={32}
            color={i < rating ? "#f1c40f" : "#ccc"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const renderPhoto = ({ item, index }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} />
      <TouchableOpacity
        style={styles.removePhotoButton}
        onPress={() => removePhoto(index)}
      >
        <Ionicons name="close-circle" size={24} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#27ae60" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {existingReview ? 'Edit Review' : 'Write Review'}
          </Text>
          {existingReview && (
            <TouchableOpacity onPress={deleteReview}>
              <Ionicons name="trash-outline" size={20} color="#ff4757" />
            </TouchableOpacity>
          )}
        </View>

        {/* Item Info */}
        <View style={styles.itemInfo}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCuisine}>
              {type === 'meal' ? `${item.restaurant} • ${item.cuisine}` : item.cuisine}
            </Text>
            <View style={styles.itemRating}>
              <Ionicons name="star" size={16} color="#f1c40f" />
              <Text style={styles.itemRatingText}>{item.rating}</Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rating</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        </View>

        {/* Review Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            value={review}
            onChangeText={setReview}
            placeholder={`Share your experience with ${item.name}...`}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {review.length}/500 characters
          </Text>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
          <View style={styles.photosContainer}>
            <FlatList
              data={photos}
              renderItem={renderPhoto}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
                  <Ionicons name="camera" size={32} color="#27ae60" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              }
            />
            {photos.length > 0 && (
              <TouchableOpacity style={styles.addMorePhotoButton} onPress={addPhoto}>
                <Ionicons name="add" size={24} color="#27ae60" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Review Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={styles.tipText}>Be specific about what you liked or didn't like</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={styles.tipText}>Mention food quality, service, and atmosphere</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={styles.tipText}>Keep it honest and constructive</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || review.trim().length < 10) && styles.submitButtonDisabled
            ]}
            onPress={submitReview}
            disabled={rating === 0 || review.trim().length < 10 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {existingReview ? 'Update Review' : 'Submit Review'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  itemInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRatingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#f1c40f',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starContainer: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#27ae60',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addPhotoText: {
    color: '#27ae60',
    fontSize: 12,
    marginTop: 4,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addMorePhotoButton: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#27ae60',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsContainer: {
    gap: 8,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  submitContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 