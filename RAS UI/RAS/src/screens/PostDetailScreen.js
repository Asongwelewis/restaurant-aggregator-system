import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments([
        ...comments,
        { id: Date.now().toString(), user: 'Guest', text: commentText },
      ]);
      setCommentText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={28} color="#27ae60" />
      </TouchableOpacity>
      <View style={styles.post}>
        <View style={styles.profileRow}>
          <Image source={{ uri: post.profilePic }} style={styles.profilePic} />
          <View>
            <Text style={styles.profileName}>{post.profileName}</Text>
            <Text style={styles.profileIntro}>{post.intro}</Text>
          </View>
        </View>
        <View style={styles.postHeader}>
          <Ionicons name="restaurant" size={22} color="#27ae60" />
          <Text style={styles.restaurantName}>{post.restaurant}</Text>
        </View>
        <Image source={{ uri: post.image }} style={styles.postImage} />
        <Text style={styles.postDescription}>{post.description}</Text>
      </View>
      <Text style={styles.commentsTitle}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Ionicons name="person-circle" size={28} color="#27ae60" />
            <View>
              <Text style={styles.commentUser}>{item.user}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eafaf1' },
  backBtn: { margin: 12, alignSelf: 'flex-start' },
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
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
    color: '#27ae60',
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
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 4,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 18,
    marginVertical: 6,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 4,
    fontSize: 14,
  },
  commentText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#222',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 2,
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});