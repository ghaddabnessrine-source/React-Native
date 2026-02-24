import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { TaskStorage } from '../services/simpleTaskStorage.js';
import { TaskCategories, TaskPriority, TaskUtils, ReminderTimes } from '../types/task.js';

const TodoList = () => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(TaskCategories.OTHER);
  const [selectedPriority, setSelectedPriority] = useState(TaskPriority.MEDIUM);
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [selectedReminder, setSelectedReminder] = useState(ReminderTimes.NONE);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const addButtonScale = useRef(new Animated.Value(1)).current;
  const { width: screenWidth } = Dimensions.get('window');

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
    // Initial fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await TaskStorage.loadTasks();
    setTasks(loadedTasks);
  };

  // Show notification with animation
  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setShowNotifications(true);
    
    // Slide in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowNotifications(false);
      });
    }, 3000);
  };

  // Add button press animation
  const animateAddButton = () => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    showNotification(
      newMode ? 'Mode sombre activé 🌙' : 'Mode clair activé ☀️',
      'success'
    );
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de tâche');
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

    const newTask = await TaskStorage.addTask(taskData);
    if (newTask) {
      setTasks([...tasks, newTask]);
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setSelectedCategory(TaskCategories.OTHER);
      setSelectedPriority(TaskPriority.MEDIUM);
      setSelectedDueDate('');
      setSelectedReminder(ReminderTimes.NONE);
      setShowAddModal(false);
      Keyboard.dismiss();
      showNotification(`Tâche "${newTask.title}" ajoutée avec succès!`, 'success');
    } else {
      showNotification('Échec de l\'ajout de tâche', 'error');
    }
  };

  const updateTask = async () => {
    if (!editingTask || !newTaskTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de tâche');
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

    const updatedTask = await TaskStorage.updateTask(editingTask.id, updates);
    if (updatedTask) {
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      // Reset form
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setSelectedCategory(TaskCategories.OTHER);
      setSelectedPriority(TaskPriority.MEDIUM);
      setSelectedDueDate('');
      setSelectedReminder(ReminderTimes.NONE);
      setShowEditModal(false);
      Keyboard.dismiss();
      showNotification(`Tâche "${updatedTask.title}" mise à jour avec succès!`, 'success');
    } else {
      showNotification('Échec de la mise à jour de tâche', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const taskToDelete = tasks.find(task => task.id === taskId);
            const success = await TaskStorage.deleteTask(taskId);
            if (success) {
              setTasks(tasks.filter(task => task.id !== taskId));
              showNotification(`Task "${taskToDelete.title}" deleted`, 'info');
            } else {
              showNotification('Failed to delete task', 'error');
            }
          }
        }
      ]
    );
  };

  const toggleTaskComplete = async (taskId) => {
    const updatedTask = await TaskStorage.toggleTaskComplete(taskId);
    if (updatedTask) {
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      const message = updatedTask.completed 
        ? `Task "${updatedTask.title}" completed! 🎉` 
        : `Task "${updatedTask.title}" marked as incomplete`;
      showNotification(message, updatedTask.completed ? 'success' : 'info');
    } else {
      showNotification('Failed to update task', 'error');
    }
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

  // Show date picker
  const showDatePickerModal = () => {
    Alert.alert(
      'Date d\'échéance',
      'Choisissez comment définir la date d\'échéance',
      [
        { text: 'Aujourd\'hui', onPress: () => setSelectedDueDate(new Date().toISOString()) },
        { text: 'Demain', onPress: () => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setSelectedDueDate(tomorrow.toISOString());
        }},
        { text: 'Cette semaine', onPress: () => {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          setSelectedDueDate(nextWeek.toISOString());
        }},
        { text: 'Date personnalisée', onPress: () => {
          // Pour l'instant, utilisez la date actuelle
          setSelectedDueDate(new Date().toISOString());
          showNotification('Utilisez la date actuelle pour le moment', 'info');
        }},
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Aucune date';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Check if task is overdue for styling
  const isTaskOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Animated task item
  const renderTaskItem = ({ item, index }) => {
    const overdue = isTaskOverdue(item);
    
    return (
      <View
        style={[
          styles.taskItem, 
          item.completed && styles.completedTask,
          overdue && styles.overdueTask,
          isDarkMode && styles.darkTaskItem,
        ]}
      >
        <View style={styles.taskHeader}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleTaskComplete(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxInner, item.completed && styles.checkboxChecked]}>
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          
          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle, 
              item.completed && styles.completedText, 
              isDarkMode && styles.darkTaskTitle,
              overdue && styles.overdueTitle
            ]}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={[
                styles.taskDescription, 
                item.completed && styles.completedText, 
                isDarkMode && styles.darkTaskDescription
              ]}>
                {item.description}
              </Text>
            ) : null}
            <View style={styles.taskMeta}>
              <Text style={[styles.categoryText, isDarkMode && styles.darkCategoryText]}>
                {item.category}
              </Text>
              <Text style={[styles.priorityText, styles[`priority${item.priority.toUpperCase()}`]]}>
                {item.priority}
              </Text>
              {item.dueDate && (
                <Text style={[styles.dueDateText, overdue && styles.overdueDueDateText]}>
                  📅 {formatDateForDisplay(item.dueDate)}
                </Text>
              )}
            </View>
            {item.reminder !== ReminderTimes.NONE && (
              <Text style={styles.reminderText}>
                🔔 {item.getReminderText()}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTask(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAddEditModal = (isEdit = false) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>
              {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </Text>
            
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              placeholder="Titre de la tâche"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              maxLength={50}
              autoFocus={!isEdit}
            />
            
            <TextInput
              style={[styles.input, styles.textArea, isDarkMode && styles.darkInput]}
              placeholder="Description (optionnel)"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
              numberOfLines={2}
              maxLength={200}
            />
            
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity
                style={[styles.quickActionButton, isDarkMode && styles.darkQuickActionButton]}
                onPress={showDatePickerModal}
              >
                <Text style={[styles.quickActionText, isDarkMode && styles.darkQuickActionText]}>
                  📅 Date
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickActionButton, isDarkMode && styles.darkQuickActionButton]}
                onPress={() => {
                  const reminderOptions = ['Aucun', '1h avant', '1j avant'];
                  Alert.alert(
                    'Rappel',
                    'Choisissez le moment du rappel',
                    reminderOptions.map(option => ({
                      text: option,
                      onPress: () => {
                        const reminderMap = {
                          'Aucun': ReminderTimes.NONE,
                          '1h avant': ReminderTimes.ONE_HOUR_BEFORE,
                          '1j avant': ReminderTimes.ONE_DAY_BEFORE
                        };
                        setSelectedReminder(reminderMap[option] || ReminderTimes.NONE);
                      }
                    }))
                  );
                }}
              >
                <Text style={[styles.quickActionText, isDarkMode && styles.darkQuickActionText]}>
                  🔔 Rappel
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.categoryContainer}>
              {Object.values(TaskCategories).map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory,
                    isDarkMode && styles.darkCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryText,
                    isDarkMode && styles.darkCategoryButtonText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.priorityContainer}>
              {Object.values(TaskPriority).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    selectedPriority === priority && styles[`selected${priority.toUpperCase()}`],
                    isDarkMode && styles.darkPriorityButton
                  ]}
                  onPress={() => setSelectedPriority(priority)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    selectedPriority === priority && styles.selectedPriorityText,
                    isDarkMode && styles.darkPriorityButtonText
                  ]}>
                    {priority === 'low' ? 'Bas' : priority === 'medium' ? 'Moyen' : 'Haut'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.darkCancelButton]}
                onPress={() => {
                  if (isEdit) {
                    setShowEditModal(false);
                    setEditingTask(null);
                  } else {
                    setShowAddModal(false);
                  }
                  // Reset form
                  setNewTaskTitle('');
                  setNewTaskDescription('');
                  setSelectedCategory(TaskCategories.OTHER);
                  setSelectedPriority(TaskPriority.MEDIUM);
                  setSelectedDueDate('');
                  setSelectedReminder(ReminderTimes.NONE);
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={isEdit ? updateTask : addTask}
              >
                <Text style={styles.saveButtonText}>
                  {isEdit ? 'Mettre à jour' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <Animated.View style={[styles.container, isDarkMode && styles.darkContainer, { opacity: fadeAnim }]}>
      {/* Header with title and dark mode toggle */}
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>My To-Do List</Text>
        <TouchableOpacity
          style={[styles.darkModeToggle, isDarkMode && styles.darkModeToggleDark]}
          onPress={toggleDarkMode}
        >
          <Text style={[styles.darkModeToggleText, isDarkMode && styles.darkModeToggleTextDark]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Enhanced Search Bar */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="🔍 Search tasks..."
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => handleSearch('')}
          >
            <Text style={[styles.clearSearchText, isDarkMode && styles.darkClearSearchText]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Enhanced Category Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterCategory === 'all' && styles.selectedFilter, isDarkMode && styles.darkFilterButton]}
          onPress={() => setFilterCategory('all')}
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
              onPress={() => setFilterCategory(category)}
            >
              <Text style={[styles.filterButtonText, filterCategory === category && styles.selectedFilterText, isDarkMode && styles.darkFilterButtonText]}>
                {category} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Task List */}
      <FlatList
        data={getFilteredTasks()}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
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
      
      {/* Notification System */}
      {showNotifications && (
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
      )}
      
      {/* Modals */}
      {renderAddEditModal(false)}
      {renderAddEditModal(true)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
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
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkTaskItem: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  completedTask: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ccc',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  darkTaskTitle: {
    color: '#fff',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  darkTaskDescription: {
    color: '#ccc',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  darkCategoryText: {
    backgroundColor: '#333',
    color: '#ccc',
  },
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
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  darkModalContent: {
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  darkModalTitle: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  darkLabel: {
    color: '#fff',
  },
  datePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  darkDatePickerButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  datePickerButtonText: {
    fontSize: 14,
    color: '#666',
  },
  darkDatePickerButtonText: {
    color: '#ccc',
  },
  reminderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  reminderButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkReminderButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  selectedReminder: {
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
  },
  reminderButtonText: {
    fontSize: 12,
    color: '#666',
  },
  darkReminderButtonText: {
    color: '#ccc',
  },
  selectedReminderText: {
    color: '#fff',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  darkQuickActionButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  darkQuickActionText: {
    color: '#ccc',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  darkCategoryButton: {
    backgroundColor: '#333',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
  },
  darkCategoryButtonText: {
    color: '#ccc',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  darkPriorityButton: {
    backgroundColor: '#333',
  },
  selectedLOW: {
    backgroundColor: '#28a745',
  },
  selectedMEDIUM: {
    backgroundColor: '#ffc107',
  },
  selectedHIGH: {
    backgroundColor: '#dc3545',
  },
  priorityButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  darkPriorityButtonText: {
    color: '#ccc',
  },
  selectedPriorityText: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  darkCancelButton: {
    backgroundColor: '#555',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Due date and reminder styles
  dueDateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  overdueDueDateText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  reminderText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Overdue task styling
  overdueTask: {
    backgroundColor: '#fff2f2',
    borderColor: '#dc3545',
  },
  darkOverdueTask: {
    backgroundColor: '#2d1f1f',
    borderColor: '#dc3545',
  },
  overdueTitle: {
    color: '#dc3545',
  },
  darkOverdueTitle: {
    color: '#ff6b6b',
  },
});

export default TodoList;
