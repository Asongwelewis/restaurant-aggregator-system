import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscriptionScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    // TODO: Implement payment processing
    // For now, we'll just navigate
    setTimeout(() => {
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'RestaurantTabs' }],
      });
    }, 1500);
  };

  const BackgroundCircles = () => (
    <>
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <BackgroundCircles />
      <View style={styles.content}>
        <MaterialCommunityIcons name="crown" size={80} color="#CAFF4E" />
        <Text style={styles.title}>Premium Restaurant Plan</Text>
        <Text style={styles.subtitle}>Start managing your restaurant today</Text>

        <View style={styles.priceCard}>
          <Text style={styles.price}>$299.99</Text>
          <Text style={styles.period}>per year</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What's Included:</Text>
          {[
            'Full restaurant management system',
            'Menu creation and management',
            'Order processing and tracking',
            'Customer analytics and insights',
            'Marketing tools and promotions',
            'Priority customer support',
            'Unlimited menu items',
            'Photo and video uploads'
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#27ae60" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, isLoading && styles.loadingButton]}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    alignItems: 'center',
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
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  priceCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  price: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  period: {
    fontSize: 16,
    color: '#666',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  subscribeButton: {
    width: '100%',
    marginBottom: 30,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingButton: {
    opacity: 0.7,
  },
});