// const { v4: uuidv4 } = require('uuid');

// In-memory storage for sessions and task links
const sessions = [];
const sessionTasks = []; // { sessionId, taskId }

// database connection
const db = require('../config/db');


// Create a new session
const createSession = async (session) => {
  const query = `
    INSERT INTO "FocusSession" (start_time, user_id, focus_mode_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [
    session.start_time,
    session.user_id,
    session.focus_mode_id
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Get all sessions for a user
const getSessionsByUserId = async (userId) => {
    return sessions.filter(s => s.userId === userId);
};

// Get a single session by ID
const getSessionById = async (id) => {
    return sessions.find(s => s.id === id);
};

// Get the last session for a user
const getLastSessionByUserId = async (userId) => {
    const userSessions = sessions.filter(s => s.userId === userId);
    if (userSessions.length === 0) return null;
    // Assuming sessions are created in order, last one is the most recent
    return userSessions[userSessions.length - 1];
};

// Update a session by ID
const updateSessionById = async (id, updates) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return null;
    Object.assign(session, updates);
    return session;
};

// Link a task to a session
const linkTaskToSession = async (sessionId, taskId) => {
    const query = `
        INSERT INTO "FocusSessionTask" (session_id, task_id, created_at, completed)
        VALUES ($1, $2, NOW(), false)
        RETURNING *;
    `;
    const values = [sessionId, taskId];
    const result = await db.query(query, values);
    return result.rows[0];
};

// link multiple tasks to a session
const linkMultipleTasksToSession = async (sessionId, taskIds) => {
    const results = [];
    for (const taskId of taskIds) {
        const query = `
            INSERT INTO "FocusSessionTask" (session_id, task_id, created_at, completed)
            VALUES ($1, $2, NOW(), false)
            RETURNING *;
        `;
        const values = [sessionId, taskId];
        const result = await db.query(query, values);
        results.push(result.rows[0]);
    }
    return results;
};

// Unlink a task from a session
const unlinkTaskFromSession = async (sessionId, taskId) => {
    const query = `
        DELETE FROM "FocusSessionTask"
        WHERE session_id = $1 AND task_id = $2
        RETURNING *;
    `;
    const values = [sessionId, taskId];
    const result = await db.query(query, values);
    return result.rows[0]; // Returns the deleted task link if it existed
};

// Get all tasks linked to a session
const getTasksBySessionId = async (sessionId) => {
    const query = `
        SELECT t.*
        FROM "FocusSessionTask" fst
        JOIN "Task" t ON fst.task_id = t.task_id
        WHERE fst.session_id = $1;
    `;
    const values = [sessionId];
    const result = await db.query(query, values);
    return result.rows; // Returns an array of tasks linked to the session
};

module.exports = {
    createSession,
    getSessionsByUserId,
    getSessionById,
    updateSessionById,
    getLastSessionByUserId,
    linkTaskToSession,
    linkMultipleTasksToSession,
    unlinkTaskFromSession,
    getTasksBySessionId
};