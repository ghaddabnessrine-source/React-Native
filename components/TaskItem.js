import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ReminderTimes } from '../types/task';

const TaskItem = ({ 
  item, 
  isDarkMode, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const isTaskOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
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

  const getReminderDisplayText = (reminder) => {
    switch (reminder) {
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
          onPress={() => onToggleComplete(item.id)}
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
          {item.reminder && item.reminder !== ReminderTimes.NONE && (
            <Text style={[styles.reminderText, isDarkMode && styles.darkReminderText]}>
              🔔 {getReminderDisplayText(item.reminder)}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  dueDateText: {
    fontSize: 12,
    color: '#666',
  },
  overdueDueDateText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  overdueTitle: {
    color: '#FF3B30',
  },
  overdueTask: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  reminderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  darkReminderText: {
    color: '#ccc',
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
});

export default TaskItem;
