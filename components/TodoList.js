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
import { TaskStorage } from '../services/simpleTaskStorage.js';
import { TaskCategories, TaskPriority, TaskUtils, ReminderTimes } from '../types/task.js';
import { useTaskOperations } from '../hooks/useTaskOperations.js';
import { useAnimations } from '../hooks/useAnimations.js';
import { todoStyles } from '../styles/todoStyles.js';
import TaskItem from './TaskItem.js';
import AddEditModal from './AddEditModal.js';
import Header from './Header.js';
import SearchBar from './SearchBar.js';
import FilterBar from './FilterBar.js';
import Notification from './Notification.js';

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

  // Enhanced search with debouncing
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      // Search is already handled by getFilteredTasks
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const handleClearSearch = () => {
    handleSearch('');
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
    <Animated.View style={[todoStyles.container, isDarkMode && todoStyles.darkContainer, { opacity: fadeAnim }]}>
      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        isDarkMode={isDarkMode}
        onSearchChange={handleSearch}
        onClearSearch={handleClearSearch}
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
        style={todoStyles.taskList}
        contentContainerStyle={todoStyles.taskListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[todoStyles.emptyText, isDarkMode && todoStyles.darkEmptyText]}>
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
          style={todoStyles.addButton}
          onPress={() => {
            animateAddButton();
            setShowAddModal(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={todoStyles.addButtonText}>+ Add Task</Text>
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
