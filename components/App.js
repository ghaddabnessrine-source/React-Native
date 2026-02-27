import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
  useColorScheme,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text
} from 'react-native';
import { TaskCategories, TaskPriority, TaskUtils, ReminderTimes } from '../types/task.js';
import { useTaskOperations } from '../hooks/useTaskOperations.js';
import { useAnimations } from '../hooks/useAnimations.js';
import TaskItem from './TaskItem.js';
import AddEditModal from './AddEditModal.js';
import Header from './Header.js';
import SearchBar from './SearchBar.js';
import FilterBar from './FilterBar.js';
import Notification from './Notification.js';

const styles = StyleSheet.create({
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
    paddingBottom: 100,
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

const TodoList = () => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const { tasks, loadTasks, addTask, updateTask, deleteTask, toggleTaskComplete, resetForm } = useTaskOperations();
  const { fadeAnim, slideAnim, addButtonScale, startFadeIn, animateAddButton, showNotificationAnimation } = useAnimations();
  
  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(TaskCategories.OTHER);
  const [selectedPriority, setSelectedPriority] = useState(TaskPriority.MEDIUM);
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [selectedReminder, setSelectedReminder] = useState(ReminderTimes.NONE);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const { width: screenWidth } = Dimensions.get('window');

  // Load tasks and start animations on component mount
  useEffect(() => {
    loadTasks();
    startFadeIn();
  }, []);

  // Show notification with animation
  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setShowNotifications(true);
    
    showNotificationAnimation(() => {
      setShowNotifications(false);
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    showNotification(
      newMode ? 'Dark mode enabled 🌙' : 'Light mode enabled ☀️',
      'success'
    );
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: selectedDueDate || null,
      reminder: selectedReminder
    };

    const newTask = await addTask(taskData);
    if (newTask) {
      resetFormState();
      setShowAddModal(false);
      Keyboard.dismiss();
      showNotification(`Task "${newTask.title}" added successfully!`, 'success');
    } else {
      showNotification('Failed to add task', 'error');
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const updates = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: selectedDueDate || null,
      reminder: selectedReminder
    };

    const updatedTask = await updateTask(editingTask.id, updates);
    if (updatedTask) {
      resetFormState();
      setEditingTask(null);
      setShowEditModal(false);
      Keyboard.dismiss();
      showNotification(`Task "${updatedTask.title}" updated successfully!`, 'success');
    } else {
      showNotification('Failed to update task', 'error');
    }
  };

  const resetFormState = () => {
    const formDefaults = resetForm();
    setNewTaskTitle(formDefaults.title);
    setNewTaskDescription(formDefaults.description);
    setSelectedCategory(formDefaults.category);
    setSelectedPriority(formDefaults.priority);
    setSelectedDueDate(formDefaults.dueDate);
    setSelectedReminder(formDefaults.reminder);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setSelectedCategory(task.category);
    setSelectedPriority(task.priority);
    setSelectedDueDate(task.dueDate || '');
    setSelectedReminder(task.reminder || ReminderTimes.NONE);
    setShowEditModal(true);
  };

  // Filter and search tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = TaskUtils.filterByCategory(filtered, filterCategory);
    }

    // Search
    if (searchQuery.trim()) {
      filtered = TaskUtils.searchTasks(filtered, searchQuery);
    }

    // Sort by priority and date
    return TaskUtils.sortByPriority(TaskUtils.sortByDate(filtered));
  };


  const handleTaskToggle = async (taskId) => {
    const updatedTask = await toggleTaskComplete(taskId);
    if (updatedTask) {
      const message = updatedTask.completed 
        ? `Task "${updatedTask.title}" completed! 🎉` 
        : `Task "${updatedTask.title}" marked as incomplete`;
      showNotification(message, updatedTask.completed ? 'success' : 'info');
    } else {
      showNotification('Failed to update task', 'error');
    }
  };

  const handleTaskDelete = async (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    const success = await deleteTask(taskId);
    if (success) {
      showNotification(`Task "${taskToDelete.title}" deleted`, 'info');
    } else {
      showNotification('Failed to delete task', 'error');
    }
  };

  const handleModalClose = () => {
    if (showEditModal) {
      setShowEditModal(false);
      setEditingTask(null);
    } else {
      setShowAddModal(false);
    }
    resetFormState();
  };

  const renderTaskItem = ({ item, index }) => {
    return (
      <TaskItem
        item={item}
        isDarkMode={isDarkMode}
        onToggleComplete={handleTaskToggle}
        onEdit={openEditModal}
        onDelete={handleTaskDelete}
      />
    );
  };

  return (
    <Animated.View style={[styles.container, isDarkMode && styles.darkContainer, { opacity: fadeAnim }]}>
      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        isDarkMode={isDarkMode}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
      />
      
      {/* Filter Bar */}
      <FilterBar
        filterCategory={filterCategory}
        isDarkMode={isDarkMode}
        tasks={tasks}
        onFilterChange={setFilterCategory}
      />
      
      {/* Task List */}
      <FlatList
        data={getFilteredTasks()}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
              {searchQuery || filterCategory !== 'all' 
                ? '🔍 No tasks found' 
                : '📝 No tasks yet. Add your first task!'}
            </Text>
          </Animated.View>
        }
      />
      
      {/* Animated Add Button */}
      <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            animateAddButton();
            setShowAddModal(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Notification */}
      <Notification
        showNotification={showNotifications}
        isDarkMode={isDarkMode}
        notificationMessage={notificationMessage}
        slideAnim={slideAnim}
      />
      
      {/* Modals */}
      <AddEditModal
        visible={showAddModal}
        isEdit={false}
        isDarkMode={isDarkMode}
        newTaskTitle={newTaskTitle}
        newTaskDescription={newTaskDescription}
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        selectedDueDate={selectedDueDate}
        selectedReminder={selectedReminder}
        onTitleChange={setNewTaskTitle}
        onDescriptionChange={setNewTaskDescription}
        onCategoryChange={setSelectedCategory}
        onPriorityChange={setSelectedPriority}
        onDueDateChange={setSelectedDueDate}
        onReminderChange={setSelectedReminder}
        onClose={handleModalClose}
        onSave={handleAddTask}
      />
      
      <AddEditModal
        visible={showEditModal}
        isEdit={true}
        isDarkMode={isDarkMode}
        newTaskTitle={newTaskTitle}
        newTaskDescription={newTaskDescription}
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        selectedDueDate={selectedDueDate}
        selectedReminder={selectedReminder}
        onTitleChange={setNewTaskTitle}
        onDescriptionChange={setNewTaskDescription}
        onCategoryChange={setSelectedCategory}
        onPriorityChange={setSelectedPriority}
        onDueDateChange={setSelectedDueDate}
        onReminderChange={setSelectedReminder}
        onClose={handleModalClose}
        onSave={handleUpdateTask}
      />
    </Animated.View>
  );
};

export default TodoList;
