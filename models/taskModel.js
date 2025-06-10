const { v4: uuidv4 } = require('uuid');

// In-memory storage for tasks
const tasks = [];
// database connection
const db = require('../config/db');

// ORGANIZE TASKS IN EISENHOWER MATRIX
// Categories: 'Deadline Drama', 'Future Me Problem', 'Quick Fix', 'Nice, Not Necessary'
// Helper: categorize task based on importance (1-4 stars) and deadline
function categorizeTask(importance, deadline) {
    const now = new Date();
    const due = new Date(deadline);
    const msInDay = 24 * 60 * 60 * 1000;
    const daysLeft = (due - now) / msInDay;

    // importance: 4 = hoogste, 1 = laagste
    switch (true) {
        case (importance >= 3 && daysLeft <= 2):
            return 'Deadline Drama';
        case (importance >= 3 && daysLeft > 2):
            return 'Future Me Problem';
        case (importance <= 2 && daysLeft <= 2):
            return 'Quick Fix';
        default:
            return 'Nice, Not Necessary';
    }
}

// Create a new task
const createTask = async (taskData) => {
    // add task in database
    const query = `
        INSERT INTO "Task" (user_id, title, description, importance, due_date, status, category_id, urgency_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [
        taskData.userId,
        taskData.title,
        taskData.description,
        taskData.importance, // importance is now a number (1-4)
        taskData.dueDate, // make sure this matches your DB column name
        'todo', // Default status
        taskData.categoryId, // pass the category_id (foreign key)
        // If you want to categorize the task based on importance and due date, you can do it here
        categorizeTask(taskData.importance, taskData.dueDate)
    ];

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('Task creation failed');
    }
    return result.rows[0];
};

// Get all tasks for a user from database
const getTasksByUserId = async (userId) => {
    const query = `
        SELECT * FROM "Task"
        WHERE user_id = $1
        ORDER BY due_date ASC;
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows; // Returns an array of tasks for the user
};

// Get tasks by user and status
const getTasksByUserIdAndStatus = async (userId, status) => {
    const query = `
        SELECT * FROM "Task"
        WHERE user_id = $1 AND status = $2
        ORDER BY due_date ASC;
    `;
    const values = [userId, status];
    const result = await db.query(query, values);
    return result.rows; // Returns an array of tasks for the user with the specified status
};

// Get a specific task by ID
const getTaskById = async (id) => {
    const query = `
        SELECT * FROM "Task"
        WHERE task_id = $1;
    `;
    const values = [id];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null; // Returns the task if found, otherwise null
};

// Update a task
const updateTask = async (id, updates) => {
    const fields = [];
    const values = [];
    let index = 1;

    if (updates.title) {
        fields.push(`title = $${index++}`);
        values.push(updates.title);
    }
    if (updates.description) {
        fields.push(`description = $${index++}`);
        values.push(updates.description);
    }
    if (updates.importance) {
        fields.push(`importance = $${index++}`);
        values.push(updates.importance);
    }
    if (updates.dueDate) {
        fields.push(`due_date = $${index++}`);
        values.push(updates.dueDate);
    }
    if (updates.status) {
        fields.push(`status = $${index++}`);
        values.push(updates.status);
    }
    if (updates.categoryId) {
        fields.push(`category_id = $${index++}`);
        values.push(updates.categoryId);
    }

    if (fields.length === 0) {
        throw new Error('No updates provided');
    }

    const query = `
        UPDATE "Task"
        SET ${fields.join(', ')}
        WHERE task_id = $${index}
        RETURNING *;
    `;
    values.push(id);

    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null; // Returns the updated task or null if not found
};

// Complete a task
const completeTask = async (id) => {
    const query = `
        UPDATE "Task"
        SET status = 'completed'
        WHERE task_id = $1
        RETURNING *;
    `;
    const values = [id];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null; // Returns the completed task or null if not found
};

// Delete a task
const deleteTask = async (id) => {
    const query = `
        DELETE FROM "Task"
        WHERE task_id = $1
        RETURNING *;
    `;
    const values = [id];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null; // Returns the deleted task or null if not found
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