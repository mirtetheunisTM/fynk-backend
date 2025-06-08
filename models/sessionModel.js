const { v4: uuidv4 } = require('uuid');

// In-memory storage for sessions and task links
const sessions = [];
const sessionTasks = []; // { sessionId, taskId }

// Create a new session
const createSession = async (session) => {
    session.id = uuidv4();
    sessions.push(session);
    return session;
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
    // Prevent duplicate links
    if (!sessionTasks.find(link => link.sessionId === sessionId && link.taskId === taskId)) {
        sessionTasks.push({ sessionId, taskId });
    }
    return { sessionId, taskId };
};

// Unlink a task from a session
const unlinkTaskFromSession = async (sessionId, taskId) => {
    const index = sessionTasks.findIndex(link => link.sessionId === sessionId && link.taskId === taskId);
    if (index === -1) return null;
    return sessionTasks.splice(index, 1)[0];
};

// Get all tasks linked to a session
const getTasksBySessionId = async (sessionId) => {
    return sessionTasks.filter(link => link.sessionId === sessionId).map(link => link.taskId);
};

module.exports = {
    createSession,
    getSessionsByUserId,
    getSessionById,
    updateSessionById,
    getLastSessionByUserId,
    linkTaskToSession,
    unlinkTaskFromSession,
    getTasksBySessionId
};