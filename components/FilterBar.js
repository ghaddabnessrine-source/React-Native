import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { TaskCategories } from '../types/task';

const FilterBar = ({ 
  filterCategory, 
  isDarkMode, 
  tasks, 
  onFilterChange 
}) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filterCategory === 'all' && styles.selectedFilter, isDarkMode && styles.darkFilterButton]}
        onPress={() => onFilterChange('all')}
      >
        <Text style={[styles.filterButtonText, filterCategory === 'all' && styles.selectedFilterText, isDarkMode && styles.darkFilterButtonText]}>
          All ({tasks.length})
        </Text>
      </TouchableOpacity>
      {Object.values(TaskCategories).map(category => {
        const count = tasks.filter(task => task.category === category).length;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, filterCategory === category && styles.selectedFilter, isDarkMode && styles.darkFilterButton]}
            onPress={() => onFilterChange(category)}
          >
            <Text style={[styles.filterButtonText, filterCategory === category && styles.selectedFilterText, isDarkMode && styles.darkFilterButtonText]}>
              {category} ({count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  darkFilterButton: {
    backgroundColor: '#333',
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
  },
  darkFilterButtonText: {
    color: '#ccc',
  },
  selectedFilterText: {
    color: '#fff',
  },
});

export default FilterBar;
