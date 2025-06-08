const { v4: uuidv4 } = require('uuid');

// In-memory storage for tasks
const tasks = [];

// ORGANIZE TASKS IN EISENHOWER MATRIX
// Categories: 'Deadline Drama', 'Future Me Problem', 'Quick Fix', 'Nice, Not Necessary'
// Helper: categorize task based on importance and deadline
function categorizeTask(importance, deadline) {
    const now = new Date();
    const due = new Date(deadline);
    const msInDay = 24 * 60 * 60 * 1000;
    const daysLeft = (due - now) / msInDay;

    switch (true) {
        case (importance === 'high' && daysLeft <= 2):
            return 'Deadline Drama';
        case (importance === 'high' && daysLeft > 2):
            return 'Future Me Problem';
        case (importance === 'low' && daysLeft <= 2):
            return 'Quick Fix';
        default:
            return 'Nice, Not Necessary';
    }
}

// Create a new task
const createTask = async (taskData) => {
    const task = {
        id: uuidv4(),
        userId: taskData.userId,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        importance: taskData.importance, // 'high' or 'low'
        deadline: taskData.deadline,
        status: taskData.status || 'pending',
        category: categorizeTask(taskData.importance, taskData.deadline)
    };
    tasks.push(task);
    return task;
};

// Get all tasks for a user
const getTasksByUserId = async (userId) => {
    return tasks.filter(t => t.userId === userId);
};

// Get tasks by user and status
const getTasksByUserIdAndStatus = async (userId, status) => {
    return tasks.filter(t => t.userId === userId && t.status === status);
};

// Get a specific task by ID
const getTaskById = async (id) => {
    return tasks.find(t => t.id === id);
};

// Update a task
const updateTask = async (id, updates) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    Object.assign(task, updates);
    // Re-categorize if importance or deadline changed
    if (updates.importance || updates.deadline) {
        task.category = categorizeTask(task.importance, task.deadline);
    }
    return task;
};

// Complete a task
const completeTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    task.status = 'completed';
    return task;
};

// Delete a task
const deleteTask = async (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    return tasks.splice(index, 1)[0];
};

module.exports = {
    createTask,
    getTasksByUserId,
    getTasksByUserIdAndStatus,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask
};