import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Header = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <View style={styles.header}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>My To-Do List</Text>
      <TouchableOpacity
        style={[styles.darkModeToggle, isDarkMode && styles.darkModeToggleDark]}
        onPress={onToggleDarkMode}
      >
        <Text style={[styles.darkModeToggleText, isDarkMode && styles.darkModeToggleTextDark]}>
          {isDarkMode ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  darkTitle: {
    color: '#fff',
  },
  darkModeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  darkModeToggleDark: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  darkModeToggleText: {
    fontSize: 20,
  },
  darkModeToggleTextDark: {
    fontSize: 20,
  },
});

export default Header;
