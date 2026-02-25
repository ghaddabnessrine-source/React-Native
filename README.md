# Todo List Mobile App

A simple and feature-rich To-Do List mobile application built with React Native and Expo.

## How to Run the Application

1. **Open the terminal** and navigate to the project directory:
   
   cd my-app
   

2. **Install dependencies**:
   
   npm install
   

3. **Start the application**:
   
   npm start
  

4. **Choose your platform**:
   - Press `i` for iOS
   - Press `a` for Android  
   - Press `w` for web browser

## Main Features

### Basic Features
- **Add tasks** - Enter title and description
- **View all tasks** - Scrollable task list
- **Complete tasks** - Mark as done with checkbox
- **Edit tasks** - Modify task details
- **Delete tasks** - Remove unwanted tasks

### Bonus Features
- **Dark Mode** - Toggle between light/dark with button
- **Search Bar** - Find tasks quickly
- **Categories** - Organize (Personal, Work, Shopping, Health, Other)
- **Priorities** - Low, Medium, High with colors
- **Due Dates** - Add deadlines to your tasks
- **Reminders** - Configure reminders before due date
- **Overdue Alerts** - Overdue tasks highlighted in red
- **Notifications** - Confirmation messages
- **Animations** - Smooth transitions and interactions

## File Structure

```
my-app/
├── app/
│   └── (tabs)/
│       └── index.tsx          # Main screen
├── components/
│   └── TodoList.js           # Main todo list component
├── services/
│   └── simpleTaskStorage.js # Storage service
└── types/
    └── task.js              # Task data model
```

## How It Works 

### Main Components

#### **Task Model (`types/task.js`)**
- Defines what a task is (title, description, category, etc.)
- **NEW**: Manages due dates and reminders
- Contains categories, priorities, and reminder options
- Utility functions to check if task is overdue

#### **Storage Service (`services/simpleTaskStorage.js`)**
- Saves tasks locally
- Functions to add, edit, delete tasks
- Uses local device storage

#### **Main Component (`components/TodoList.js`)**
- Complete and simplified user interface
- **NEW**: Compact add modal with quick buttons
- Manages all buttons and interactions
- Shows notifications and animations

### Data Flow

1. **User adds task** → `TodoList.js`
2. **Calls service** → `simpleTaskStorage.js`  
3. **Saves locally** → Device/browser
4. **Updates display** → `TodoList.js`

### Styling

- **StyleSheet**: Creates styles for each element
- **Dark Mode**: Different styles for light/dark
- **Animations**: Uses `Animated` for transitions
- **NEW**: Styles for overdue tasks and due dates

## Technologies Used

- **React Native** - For creating mobile apps
- **Expo** - To simplify development
- **JavaScript** - The programming language
- **AsyncStorage** - For saving data

## How to Use the App

### Add a Task
1. Click the blue "+ Add Task" button
2. Enter a title (required, max 50 characters)
3. Add a description (optional, max 200 characters)
4. **NEW**: Click "Date" to choose a due date
5. **NEW**: Click "Reminder" to configure a reminder
6. Choose a category and priority
7. Click "Add"

### Manage Tasks
- **Complete**: Touch the checkbox
- **Edit**: Touch "Edit"
- **Delete**: Touch "Delete"

### Search and Filter
- **Search**: Use the search bar
- **Filter**: Touch the category buttons

### Dark Mode
- **Toggle**: Touch the icon at the top

### Due Dates and Reminders
- **Add a date**: Click "Date" in the form
- **Date options**: Today, Tomorrow, This week
- **Configure reminder**: Click "Reminder"
- **Reminder options**: None, 1 hour before, 1 day before
- **Overdue tasks**: Automatically shown in red

## Tips for Beginners

### Common Problems

**App won't start?**
- Make sure you're in the right directory (`cd my-app`)
- Ensure you have Node.js installed

**Dark mode not working?**
- On mobile: Change system settings
- On web: Change browser settings
- Or use the button in the app

**Add page too crowded?**
- **Already solved**: Interface is now simplified
- Quick buttons for date and reminder
- Fewer fields and more compact

### Customization

**Change colors**
- Modify styles in `TodoList.js`
- Look for styles like `taskItem` or `addButton`

**Add categories**
- Edit `types/task.js`
- Add to `TaskCategories`

**Change animations**
- Modify values in `Animated.timing`
- Change `duration` and `delay`

**Add reminder options**
- Edit `types/task.js`
- Add to `ReminderTimes`



# React-Native
