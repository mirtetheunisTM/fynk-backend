// Functies voor: getTasks, getTask, createTask, updateTask, completeTask, deleteTask, getTasksByStatus,
const taskModel = require('../models/taskModel');

// Get all tasks for user
// GET /tasks
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const tasks = await taskModel.getTasksByUserId(userId);
        res.status(200).json({ message: 'Tasks retrieved successfully', data: tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
}

// Get tasks by status
// GET /tasks/:status
const getTasksByStatus = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const status = req.params.status;
        const tasks = await taskModel.getTasksByUserIdAndStatus(userId, status);
        res.status(200).json({ message: 'Tasks retrieved successfully', data: tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks by status', error: error.message });
    }
}

// Get a specific task by ID
// GET /tasks/:id
const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskModel.getTaskById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task retrieved successfully', data: task });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving task', error: error.message });
    }
}

// Create a new task
// POST /tasks
const createTask = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const taskData = req.body;
        taskData.userId = userId; // Set the user ID for the new task
        const newTask = await taskModel.createTask(taskData);
        res.status(201).json({ message: 'Task created successfully', data: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
}

// Complete a task
// PUT /tasks/:id/complete
const completeTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await taskModel.completeTask(taskId);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task completed successfully', data: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error completing task', error: error.message });
    }
}

// Update an existing task
// PUT /tasks/:id
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskData = req.body;
        const updatedTask = await taskModel.updateTask(taskId, taskData);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
}

// Delete a task
// DELETE /tasks/:id
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await taskModel.deleteTask(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully', data: deletedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
}


module.exports = {
    getTasks,
    getTasksByStatus,
    getTask,
    createTask,
    completeTask,
    updateTask,
    deleteTask,
};


