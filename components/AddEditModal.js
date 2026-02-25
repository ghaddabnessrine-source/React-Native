import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { TaskCategories, TaskPriority, ReminderTimes } from '../types/task';

const AddEditModal = ({ 
  visible, 
  isEdit, 
  isDarkMode, 
  newTaskTitle, 
  newTaskDescription, 
  selectedCategory, 
  selectedPriority, 
  selectedDueDate, 
  selectedReminder,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onPriorityChange,
  onDueDateChange,
  onReminderChange,
  onClose,
  onSave
}) => {

  // --- Date picker compatible web & mobile ---
  const showDatePickerModal = () => {
    if (Platform.OS === 'web') {
      const choice = window.prompt('Choose due date: today, tomorrow, this week, custom', 'today');
      if (!choice) return;
      let dueDate = new Date();
      switch (choice.toLowerCase()) {
        case 'today': break;
        case 'tomorrow': dueDate.setDate(dueDate.getDate() + 1); break;
        case 'this week': dueDate.setDate(dueDate.getDate() + 7); break;
        case 'custom':
          const custom = window.prompt('Enter date (YYYY-MM-DD)', dueDate.toISOString().slice(0,10));
          if (custom) dueDate = new Date(custom);
          break;
        default: return;
      }
      onDueDateChange(dueDate.toISOString());
    } else {
      Alert.alert(
        'Due Date',
        'Choose how to set the due date',
        [
          { text: 'Today', onPress: () => onDueDateChange(new Date().toISOString()) },
          { text: 'Tomorrow', onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            onDueDateChange(tomorrow.toISOString());
          }},
          { text: 'This week', onPress: () => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            onDueDateChange(nextWeek.toISOString());
          }},
          { text: 'Custom date', onPress: () => {
            onDueDateChange(new Date().toISOString());
          }},
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  // --- Reminder picker compatible web & mobile ---
  const showReminderPicker = () => {
    if (Platform.OS === 'web') {
      const reminder = window.prompt('Reminder: None, On due date, 1 hour before, 1 day before, 1 week before', 'None');
      const reminderMap = {
        'None': ReminderTimes.NONE,
        'On due date': ReminderTimes.ON_DUE,
        '1 hour before': ReminderTimes.ONE_HOUR_BEFORE,
        '1 day before': ReminderTimes.ONE_DAY_BEFORE,
        '1 week before': ReminderTimes.ONE_WEEK_BEFORE,
      };
      const selectedValue = reminderMap[reminder] || ReminderTimes.NONE;
      onReminderChange(selectedValue);
    } else {
      const reminderOptions = ['None', 'On due date', '1 hour before', '1 day before', '1 week before'];
      Alert.alert(
        'Reminder',
        'Choose when to remind',
        reminderOptions.map(option => ({
          text: option,
          onPress: () => {
            const reminderMap = {
              'None': ReminderTimes.NONE,
              'On due date': ReminderTimes.ON_DUE,
              '1 hour before': ReminderTimes.ONE_HOUR_BEFORE,
              '1 day before': ReminderTimes.ONE_DAY_BEFORE,
              '1 week before': ReminderTimes.ONE_WEEK_BEFORE
            };
            const selectedValue = reminderMap[option] || ReminderTimes.NONE;
            onReminderChange(selectedValue);
          }
        }))
      );
    }
  };

  // --- Get reminder display text ---
  const getReminderDisplayText = () => {
    switch (selectedReminder) {
      case ReminderTimes.NONE:
        return 'No reminder';
      case ReminderTimes.ON_DUE:
        return 'On due date';
      case ReminderTimes.ONE_HOUR_BEFORE:
        return '1 hour before';
      case ReminderTimes.ONE_DAY_BEFORE:
        return '1 day before';
      case ReminderTimes.ONE_WEEK_BEFORE:
        return '1 week before';
      default:
        return 'No reminder';
    }
  };
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>
                {isEdit ? 'Edit Task' : 'Add New Task'}
              </Text>
            
             <TextInput
  style={[styles.input, isDarkMode && styles.darkInput, Platform.OS === 'web' && styles.webInput]}
  placeholder="Task title"
  placeholderTextColor={isDarkMode ? '#999' : '#666'}
  value={newTaskTitle}
  onChangeText={onTitleChange}
  maxLength={50}
  autoFocus={!isEdit}
/>
            
              <TextInput
                style={[styles.input, styles.textArea, isDarkMode && styles.darkInput]}
                placeholder="Description (optional)"
                placeholderTextColor={isDarkMode ? '#999' : '#666'}
                value={newTaskDescription}
                onChangeText={onDescriptionChange}
                multiline
                numberOfLines={2}
                maxLength={200}
                selectTextOnFocus
                {...Platform.select({
                  web: { caretColor: '#007AFF' }
                })}
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
                  onPress={showReminderPicker}
                >
                  <Text style={[styles.quickActionText, isDarkMode && styles.darkQuickActionText]}>
                    🔔 Reminder
                  </Text>
                </TouchableOpacity>
              </View>
            
              {selectedDueDate && (
                <View style={[styles.selectedInfoContainer, isDarkMode && styles.darkSelectedInfoContainer]}>
                  <Text style={[styles.selectedInfoText, isDarkMode && styles.darkSelectedInfoText]}>
                    📅 Due: {formatDateForDisplay(selectedDueDate)}
                  </Text>
                </View>
              )}
            
              <View style={[styles.selectedInfoContainer, isDarkMode && styles.darkSelectedInfoContainer]}>
                <Text style={[styles.selectedInfoText, isDarkMode && styles.darkSelectedInfoText]}>
                  🔔 Reminder: {getReminderDisplayText()}
                </Text>
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
                    onPress={() => onCategoryChange(category)}
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
                    onPress={() => onPriorityChange(priority)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      selectedPriority === priority && styles.selectedPriorityText,
                      isDarkMode && styles.darkPriorityButtonText
                    ]}>
                      {priority === 'low' ? 'Low' : priority === 'medium' ? 'Medium' : 'High'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.darkCancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={onSave}
                >
                  <Text style={styles.saveButtonText}>
                    {isEdit ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 15, width: '90%', maxHeight: '80%' },
  darkModalContent: { backgroundColor: '#2a2a2a' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  darkModalTitle: { color: '#fff' },
  input: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#dee2e6', fontSize: 16, color: '#212529' },
  darkInput: { backgroundColor: '#343a40', borderColor: '#495057', color: '#f8f9fa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  quickActionButton: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  darkQuickActionButton: { backgroundColor: '#333' },
  quickActionText: { fontSize: 14, color: '#333' },
  darkQuickActionText: { color: '#fff' },
  selectedInfoContainer: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 6, marginBottom: 12 },
  darkSelectedInfoContainer: { backgroundColor: '#333' },
  selectedInfoText: { fontSize: 14, color: '#333' },
  darkSelectedInfoText: { color: '#fff' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 8 },
  categoryButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#e0e0e0' },
  darkCategoryButton: { backgroundColor: '#333' },
  selectedCategory: { backgroundColor: '#007AFF' },
  categoryButtonText: { fontSize: 12, color: '#666' },
  darkCategoryButtonText: { color: '#ccc' },
  selectedCategoryText: { color: '#fff' },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  priorityButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#e0e0e0' },
  darkPriorityButton: { backgroundColor: '#333' },
  selectedLOW: { backgroundColor: '#d4edda' },
  selectedMEDIUM: { backgroundColor: '#fff3cd' },
  selectedHIGH: { backgroundColor: '#f8d7da' },
  priorityButtonText: { fontSize: 14, color: '#666' },
  darkPriorityButtonText: { color: '#ccc' },
  selectedPriorityText: { color: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#e0e0e0' },
  darkCancelButton: { backgroundColor: '#333' },
  cancelButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  saveButton: { backgroundColor: '#007AFF' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default AddEditModal;