import { StyleSheet, Platform } from 'react-native';

export const todoStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 100, // Add padding for the floating add button
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  darkEmptyText: {
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const inputStyles = StyleSheet.create({
  input: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    fontSize: 16,
    color: '#212529',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    }),
  },
  darkInput: {
    backgroundColor: '#343a40',
    borderColor: '#495057',
    color: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export const priorityStyles = StyleSheet.create({
  priorityText: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  priorityLOW: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  priorityMEDIUM: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  priorityHIGH: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
});
