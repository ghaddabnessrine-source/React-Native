// Task data model and types for the To-Do List app

export const TaskCategories = {
  PERSONAL: 'personal',
  WORK: 'work',
  SHOPPING: 'shopping',
  HEALTH: 'health',
  OTHER: 'other'
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const ReminderTimes = {
  NONE: 'none',
  ON_DUE: 'on_due',
  ONE_HOUR_BEFORE: 'one_hour_before',
  ONE_DAY_BEFORE: 'one_day_before',
  ONE_WEEK_BEFORE: 'one_week_before'
};

// Task structure
export class Task {
  constructor(title, description = '', category = TaskCategories.OTHER, priority = TaskPriority.MEDIUM, dueDate = null, reminder = ReminderTimes.NONE) {
    this.id = Date.now().toString(); // Unique ID based on timestamp
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.completed = false;
    this.dueDate = dueDate; // ISO string or null
    this.reminder = reminder; // Reminder setting
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Check if task is overdue
  isOverdue() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }

  // Check if task is due today
  isDueToday() {
    if (!this.dueDate) return false;
    const today = new Date();
    const due = new Date(this.dueDate);
    return today.toDateString() === due.toDateString();
  }

  // Get formatted due date
  getFormattedDueDate() {
    if (!this.dueDate) return 'No due date';
    const date = new Date(this.dueDate);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get reminder display text
  getReminderText() {
    const reminderTexts = {
      [ReminderTimes.NONE]: 'Aucun rappel',
      [ReminderTimes.ON_DUE]: 'À la date limite',
      [ReminderTimes.ONE_HOUR_BEFORE]: '1 heure avant',
      [ReminderTimes.ONE_DAY_BEFORE]: '1 jour avant',
      [ReminderTimes.ONE_WEEK_BEFORE]: '1 semaine avant'
    };
    return reminderTexts[this.reminder] || 'Aucun rappel';
  }
}

// Helper functions for task management
export const TaskUtils = {
  // Create a new task
  createTask(title, description, category, priority, dueDate, reminder) {
    return new Task(title, description, category, priority, dueDate, reminder);
  },

  // Toggle task completion
  toggleComplete(task) {
    return {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };
  },

  // Update task
  updateTask(task, updates) {
    return {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  // Filter tasks by completion status
  filterByStatus(tasks, completed) {
    return tasks.filter(task => task.completed === completed);
  },

  // Filter tasks by category
  filterByCategory(tasks, category) {
    return tasks.filter(task => task.category === category);
  },

  // Search tasks by title or description
  searchTasks(tasks, query) {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Sort tasks by priority and date
  sortByPriority(tasks) {
    const priorityOrder = { [TaskPriority.HIGH]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.LOW]: 2 };
    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  },

  // Sort tasks by due date
  sortByDueDate(tasks) {
    return [...tasks].sort((a, b) => {
      // Tasks without due date go to the end
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  },

  // Sort tasks by creation date
  sortByDate(tasks, newestFirst = true) {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  },

  // Filter tasks by due date status
  getTasksByDueStatus(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      overdue: tasks.filter(task => task.isOverdue()),
      dueToday: tasks.filter(task => task.isDueToday()),
      dueTomorrow: tasks.filter(task => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        return due >= tomorrow && due < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
      }),
      upcoming: tasks.filter(task => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        return due > new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
      }),
      noDueDate: tasks.filter(task => !task.dueDate)
    };
  },

  // Get tasks that need reminders
  getTasksNeedingReminders(tasks) {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || task.completed || task.reminder === ReminderTimes.NONE) return false;
      
      const due = new Date(task.dueDate);
      const reminderTime = this.calculateReminderTime(due, task.reminder);
      
      return reminderTime <= now && !task.reminderSent;
    });
  },

  // Calculate reminder time
  calculateReminderTime(dueDate, reminder) {
    const due = new Date(dueDate);
    
    switch (reminder) {
      case ReminderTimes.ON_DUE:
        return due;
      case ReminderTimes.ONE_HOUR_BEFORE:
        return new Date(due.getTime() - 60 * 60 * 1000);
      case ReminderTimes.ONE_DAY_BEFORE:
        return new Date(due.getTime() - 24 * 60 * 60 * 1000);
      case ReminderTimes.ONE_WEEK_BEFORE:
        return new Date(due.getTime() - 7 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  },

  // Format reminder message
  formatReminderMessage(task) {
    const dueDate = new Date(task.dueDate);
    const formattedDate = dueDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `Rappel: "${task.title}" est dû le ${formattedDate}`;
  }
};
