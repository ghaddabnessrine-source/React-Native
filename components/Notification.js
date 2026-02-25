import React from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';

const Notification = ({ 
  showNotification, 
  isDarkMode, 
  notificationMessage, 
  slideAnim 
}) => {
  if (!showNotification) return null;

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        isDarkMode && styles.darkNotificationContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[styles.notificationText, isDarkMode && styles.darkNotificationText]}>
        {notificationMessage}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  darkNotificationContainer: {
    backgroundColor: '#45a049',
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  darkNotificationText: {
    color: '#fff',
  },
});

export default Notification;
