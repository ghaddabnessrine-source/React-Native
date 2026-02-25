import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const SearchBar = ({ 
  searchQuery, 
  isDarkMode, 
  onSearchChange, 
  onClearSearch 
}) => {
  return (
    <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
      <TextInput
        style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
        placeholder="Search tasks..."
        placeholderTextColor={isDarkMode ? '#999' : '#666'}
        value={searchQuery}
        onChangeText={onSearchChange}
        clearButtonMode="while-editing"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={onClearSearch}
        >
          <Text style={[styles.clearSearchText, isDarkMode && styles.darkClearSearchText]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  darkSearchContainer: {
    backgroundColor: '#2a2a2a',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  darkSearchInput: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  clearSearchButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#666',
  },
  darkClearSearchText: {
    color: '#999',
  },
});

export default SearchBar;
