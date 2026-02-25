import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { TaskStorage } from '../services/simpleTaskStorage.js';
import { TaskCategories, TaskPriority, ReminderTimes } from '../types/task';

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await TaskStorage.loadTasks();
    setTasks(loadedTasks);
  };

  const addTask = async (taskData) => {
    const newTask = await TaskStorage.addTask(taskData);
    if (newTask) {
      setTasks([...tasks, newTask]);
      return newTask;
    }
    return null;
  };

  const updateTask = async (taskId, updates) => {
    const updatedTask = await TaskStorage.updateTask(taskId, updates);
    if (updatedTask) {
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      return updatedTask;
    }
    return null;
  };

  const deleteTask = async (taskId) => {
    return new Promise((resolve) => {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const success = await TaskStorage.deleteTask(taskId);
              if (success) {
                setTasks(tasks.filter(task => task.id !== taskId));
              }
              resolve(success);
            }
          }
        ]
      );
    });
  };

  const toggleTaskComplete = async (taskId) => {
    const updatedTask = await TaskStorage.toggleTaskComplete(taskId);
    if (updatedTask) {
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      return updatedTask;
    }
    return null;
  };

  const resetForm = () => {
    return {
      title: '',
      description: '',
      category: TaskCategories.OTHER,
      priority: TaskPriority.MEDIUM,
      dueDate: '',
      reminder: ReminderTimes.NONE
    };
  };

  return {
    tasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    resetForm
  };
};
