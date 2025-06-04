import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import RestaurantProfileScreen from './RestaurantProfileScreen'; // Make sure this exists
import UserProfileScreen from './UserProfileScreen'; // You will create this below

// Sample restaurant lists for horizontal scroll
const restaurantLists = [
  [
    {
      id: 'r1',
      name: 'Green Garden',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/men/12.jpg',
      stars: 5,
    },
    {
      id: 'r2',
      name: 'Oceanic',
      location: 'Lisbon, Portugal',
      image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
      stars: 4,
    },
    {
      id: 'r3',
      name: 'Mountain Dine',
      location: 'Geneva, Switzerland',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/men/23.jpg',
      stars: 3,
    },
  ],
  [
    {
      id: 'r4',
      name: 'Urban Bites',
      location: 'Berlin, Germany',
      image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/men/33.jpg',
      stars: 4,
    },
    {
      id: 'r5',
      name: 'Sunset Grill',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/women/34.jpg',
      stars: 5,
    },
    {
      id: 'r6',
      name: 'City Eats',
      location: 'Rome, Italy',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/men/35.jpg',
      stars: 2,
    },
  ],
  [
    {
      id: 'r7',
      name: 'Riverbank',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/women/36.jpg',
      stars: 3,
    },
    {
      id: 'r8',
      name: 'Skyline Diner',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/men/37.jpg',
      stars: 5,
    },
    {
      id: 'r9',
      name: 'Café Central',
      location: 'Vienna, Austria',
      image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
      profilePic: 'https://randomuser.me/api/portraits/women/38.jpg',
      stars: 4,
    },
  ],
];

// Generate 30 posts, inserting a horizontal restaurant list at index 0, 10, 20
const basePosts = [
  {
    id: '1',
    restaurant: 'Pizza Palace',
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    profileName: 'Mario Rossi',
    intro: 'Best pizza chef in town!',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Try our new spicy pepperoni pizza!',
    likes: 12,
    comments: [
      { id: 'c1', user: 'Anna', text: 'Looks delicious!' },
      { id: 'c2', user: 'John', text: 'Can’t wait to try it.' },
    ],
  },
  {
    id: '2',
    restaurant: 'Sushi World',
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    profileName: 'Sakura Tanaka',
    intro: 'Fresh sushi every day.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh sushi rolls every day!',
    likes: 20,
    comments: [
      { id: 'c3', user: 'Mike', text: 'Love this place!' },
    ],
  },
  {
    id: '3',
    restaurant: 'Burger House',
    profilePic: 'https://randomuser.me/api/portraits/men/65.jpg',
    profileName: 'Bob Smith',
    intro: 'Burgers with a smile!',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    description: 'Juicy burgers and crispy fries.',
    likes: 8,
    comments: [],
  },
];

// Generate more posts for demo
function generatePosts() {
  const posts = [];
  let restaurantListIndex = 0;
  for (let i = 0; i < 30; i++) {
    // Insert restaurant list at 0, 10, 20
    if (i % 10 === 0) {
      posts.push({ type: 'restaurantList', id: `list-${i}`, list: restaurantLists[restaurantListIndex % restaurantLists.length] });
      restaurantListIndex++;
    }
    // Use basePosts in a loop for demo
    const base = basePosts[i % basePosts.length];
    posts.push({
      ...base,
      id: (i + 1).toString(),
      type: 'post',
    });
  }
  return posts;
}

// Add your filter options here
const FILTERS = [
  { key: 'all', label: 'All', icon: <Ionicons name="fast-food" size={22} color="#27ae60" /> },
  { key: 'pizza', label: 'Pizza', icon: <MaterialCommunityIcons name="pizza" size={22} color="#e17055" /> },
  { key: 'sushi', label: 'Sushi', icon: <MaterialCommunityIcons name="fish" size={22} color="#0984e3" /> },
  { key: 'burger', label: 'Burger', icon: <FontAwesome5 name="hamburger" size={22} color="#fdcb6e" /> },
  { key: 'vegan', label: 'Vegan', icon: <MaterialCommunityIcons name="leaf" size={22} color="#00b894" /> },
  { key: 'dessert', label: 'Dessert', icon: <MaterialCommunityIcons name="cupcake" size={22} color="#d35400" /> },
];

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState(generatePosts());
  const [composerText, setComposerText] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');

  const renderStars = (count) => (
    <View style={{ flexDirection: 'row', marginTop: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={16}
          color="#f1c40f"
        />
      ))}
    </View>
  );

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(item =>
        item.id === postId
          ? {
              ...item,
              likes: likedPosts[postId]
                ? item.likes - 1
                : item.likes + 1,
            }
          : item
      )
    );
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderRestaurantList = ({ list }) => (
    <View style={styles.restaurantListContainer}>
      <Text style={styles.restaurantListTitle}>Featured Restaurants</Text>
      <FlatList
        data={list}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RestaurantProfile', { restaurant: item })
            }
          >
            <View style={styles.restaurantCard}>
              <Image source={{ uri: item.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantProfileRow}>
                <Image source={{ uri: item.profilePic }} style={styles.restaurantProfilePic} />
                <Text style={styles.restaurantName}>{item.name}</Text>
              </View>
              <Text style={styles.restaurantLocation}>{item.location}</Text>
              {renderStars(item.stars)}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderPost = ({ item }) => {
    if (item.type === 'restaurantList') {
      return renderRestaurantList(item);
    }
    const isLiked = likedPosts[item.id];
    return (
      <View style={styles.post}>
        {/* Profile info */}
        <TouchableOpacity
          style={styles.profileRow}
          onPress={() =>
            navigation.navigate('UserProfile', {
              user: {
                profilePic: item.profilePic,
                profileName: item.profileName,
                intro: item.intro,
              },
            })
          }
        >
          <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
          <View>
            <Text style={styles.profileName}>{item.profileName}</Text>
            <Text style={styles.profileIntro}>{item.intro}</Text>
          </View>
        </TouchableOpacity>
        {/* Restaurant name */}
        <TouchableOpacity
          style={styles.postHeader}
          onPress={() =>
            navigation.navigate('RestaurantProfile', {
              restaurant: {
                name: item.restaurant,
                image: item.image,
                profilePic: item.profilePic,
                location: item.location || 'Unknown',
                stars: item.stars || 4,
                reviews: item.comments?.length || 0,
                likes: item.likes,
              },
            })
          }
        >
          <Ionicons name="restaurant" size={22} color="#27ae60" />
          <Text style={styles.restaurantName}>{item.restaurant}</Text>
        </TouchableOpacity>
        {/* Post image */}
        <Image source={{ uri: item.image }} style={styles.postImage} />
        {/* Description */}
        <Text style={styles.postDescription}>{item.description}</Text>
        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons
              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={22}
              color={isLiked ? "#27ae60" : "#27ae60"}
            />
            <Text style={[
              styles.actionText,
              isLiked && { color: "#27ae60", fontWeight: "bold" }
            ]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#27ae60" />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filtering logic
  const filteredPosts = posts.filter(item => {
    if (item.type !== 'post') return true; // keep restaurant lists
    if (activeFilter === 'all') return true;
    const type = item.restaurant?.toLowerCase() || '';
    if (activeFilter === 'pizza') return type.includes('pizza');
    if (activeFilter === 'sushi') return type.includes('sushi');
    if (activeFilter === 'burger') return type.includes('burger');
    if (activeFilter === 'vegan') return type.includes('vegan') || type.includes('garden');
    if (activeFilter === 'dessert') return type.includes('dessert') || type.includes('café') || type.includes('cake');
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>oodis</Text>
        <Ionicons name="search" size={28} color="#27ae60" />
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                activeFilter === f.key && styles.filterBtnActive,
              ]}
              onPress={() => setActiveFilter(f.key)}
            >
              {f.icon}
              <Text style={[
                styles.filterLabel,
                activeFilter === f.key && styles.filterLabelActive,
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Composer */}
      <View style={styles.composer}>
        <Ionicons name="restaurant" size={32} color="#27ae60" />
        <TextInput
          style={styles.composerInput}
          placeholder="Share a new dish or review..."
          value={composerText}
          onChangeText={setComposerText}
        />
        <TouchableOpacity style={styles.composerBtn}>
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // changed from '#eafaf1' to white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#d4f3e3',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    letterSpacing: 2,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  composerInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#222',
  },
  composerBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantListContainer: {
    marginVertical: 10,
    marginBottom: 16,
  },
  restaurantListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 18,
    marginBottom: 6,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 8,
    width: 180,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 160,
    height: 90,
    borderRadius: 12,
    marginBottom: 6,
  },
  restaurantProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  restaurantProfilePic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#27ae60',
  },
  restaurantLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  post: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 18,
    padding: 12,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  profileIntro: {
    fontSize: 13,
    color: '#888',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 2,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 4,
  },
  postDescription: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eafaf1',
    paddingTop: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 15,
  },
  filterBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eafaf1',
    marginBottom: 2,
  },
  filterBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#f4f4f4',
    minWidth: 60,
  },
  filterBtnActive: {
    backgroundColor: '#CAFF4E',
  },
  filterLabel: {
    fontSize: 12,
    color: '#27ae60',
    marginTop: 2,
    fontWeight: 'bold',
  },
  filterLabelActive: {
    color: '#222',
  },
});