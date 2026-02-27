import React from 'react';
import { StyleSheet, View } from 'react-native';
import TodoList from '@/components/App.js';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TodoList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
