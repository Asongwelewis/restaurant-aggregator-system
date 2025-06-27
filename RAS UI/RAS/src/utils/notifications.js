import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false, // Disable badge for Expo Go compatibility
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notifications (simplified for Expo Go)
  async init() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      console.log('Notifications initialized successfully');
      return true;
    } catch (error) {
      console.log('Error initializing notifications:', error);
      return false;
    }
  }

  // Schedule local notification
  async scheduleLocalNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null, // null means show immediately
      });
      console.log('Local notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.log('Error scheduling local notification:', error);
      return null;
    }
  }

  // Send immediate notification
  async sendImmediateNotification(title, body, data = {}) {
    return this.scheduleLocalNotification(title, body, data);
  }

  // Schedule booking reminder (1 hour before)
  async scheduleBookingReminder(booking) {
    try {
      if (!booking || !booking.time) {
        console.log('No booking or booking time provided for reminder');
        return null;
      }
      
      const bookingTime = new Date(booking.time);
      const reminderTime = new Date(bookingTime.getTime() - 60 * 60 * 1000); // 1 hour before
      
      // Only schedule if reminder time is in the future
      if (reminderTime > new Date()) {
        const title = 'Booking Reminder';
        const body = `Your booking at ${booking.restaurant_name || 'restaurant'} is in 1 hour. Don't forget!`;
        
        const notificationId = await this.scheduleLocalNotification(
          title,
          body,
          { type: 'booking_reminder', booking_id: booking.booking_id },
          { date: reminderTime }
        );
        
        console.log('Booking reminder scheduled for:', reminderTime);
        return notificationId;
      }
    } catch (error) {
      console.log('Error scheduling booking reminder:', error);
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(booking) {
    if (!booking) {
      console.log('No booking data provided for confirmation notification');
      return null;
    }
    
    const title = 'Booking Confirmed!';
    const body = `Your ${booking.booking_type || 'restaurant'} booking at ${booking.restaurant_name || 'restaurant'} has been confirmed.`;
    
    return this.sendImmediateNotification(title, body, {
      type: 'booking_confirmation',
      booking_id: booking.booking_id
    });
  }

  // Send booking cancellation
  async sendBookingCancellation(booking) {
    if (!booking) {
      console.log('No booking data provided for cancellation notification');
      return null;
    }
    
    const title = 'Booking Cancelled';
    const body = `Your booking at ${booking.restaurant_name || 'restaurant'} has been cancelled.`;
    
    return this.sendImmediateNotification(title, body, {
      type: 'booking_cancelled',
      booking_id: booking.booking_id
    });
  }

  // Send meal unavailable notification
  async sendMealUnavailable(booking) {
    if (!booking) {
      console.log('No booking data provided for meal unavailable notification');
      return null;
    }
    
    const title = 'Meal Unavailable';
    const body = `The meal "${booking.meal_name || 'selected meal'}" at ${booking.restaurant_name || 'restaurant'} is no longer available.`;
    
    return this.sendImmediateNotification(title, body, {
      type: 'meal_unavailable',
      booking_id: booking.booking_id
    });
  }

  // Send booking update
  async sendBookingUpdate(booking, changes) {
    if (!booking) {
      console.log('No booking data provided for update notification');
      return null;
    }
    
    const title = 'Booking Updated';
    const body = `Your booking at ${booking.restaurant_name || 'restaurant'} has been updated.`;
    
    return this.sendImmediateNotification(title, body, {
      type: 'booking_updated',
      booking_id: booking.booking_id,
      changes
    });
  }

  // Cancel scheduled notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.log('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.log('Error cancelling all notifications:', error);
    }
  }

  // Set up notification listeners
  setupNotificationListeners(navigation) {
    // Handle notification received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification response (when user taps notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      
      const data = response.notification.request.content.data;
      
      // Navigate based on notification type
      switch (data.type) {
        case 'booking_confirmation':
        case 'booking_cancelled':
        case 'booking_updated':
        case 'meal_unavailable':
        case 'booking_reminder':
          navigation.navigate('ReservationsScreen');
          break;
        default:
          break;
      }
    });
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService; 