import * as SecureStore from 'expo-secure-store';
import { TaskUtils } from '../types/task.js';

const STORAGE_KEY = 'todo_tasks';

export class TaskStorage {
  // Save all tasks to storage
  static async saveTasks(tasks) {
    try {
      const jsonValue = JSON.stringify(tasks);
      await SecureStore.setItemAsync(STORAGE_KEY, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  }

  // Load all tasks from storage
  static async loadTasks() {
    try {
      const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  // Add a new task
  static async addTask(taskData) {
    try {
      const tasks = await this.loadTasks();
      const newTask = TaskUtils.createTask(
        taskData.title,
        taskData.description,
        taskData.category,
        taskData.priority
      );
      tasks.push(newTask);
      await this.saveTasks(tasks);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  }

  // Update an existing task
  static async updateTask(taskId, updates) {
    try {
      const tasks = await this.loadTasks();
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      tasks[taskIndex] = TaskUtils.updateTask(tasks[taskIndex], updates);
      await this.saveTasks(tasks);
      return tasks[taskIndex];
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  // Delete a task
  static async deleteTask(taskId) {
    try {
      const tasks = await this.loadTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await this.saveTasks(filteredTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  // Toggle task completion
  static async toggleTaskComplete(taskId) {
    try {
      const tasks = await this.loadTasks();
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      tasks[taskIndex] = TaskUtils.toggleComplete(tasks[taskIndex]);
      await this.saveTasks(tasks);
      return tasks[taskIndex];
    } catch (error) {
      console.error('Error toggling task completion:', error);
      return null;
    }
  }

  // Get task statistics
  static async getTaskStats() {
    try {
      const tasks = await this.loadTasks();
      const total = tasks.length;
      const completed = tasks.filter(task => task.completed).length;
      const pending = total - completed;
      
      const statsByCategory = {};
      const statsByPriority = {};

      tasks.forEach(task => {
        // Category stats
        statsByCategory[task.category] = (statsByCategory[task.category] || 0) + 1;
        
        // Priority stats
        statsByPriority[task.priority] = (statsByPriority[task.priority] || 0) + 1;
      });

      return {
        total,
        completed,
        pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        statsByCategory,
        statsByPriority
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        statsByCategory: {},
        statsByPriority: {}
      };
    }
  }

  // Clear all tasks
  static async clearAllTasks() {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  }
}
