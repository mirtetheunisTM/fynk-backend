//Functies voor: getSessions, getSession, createSession, updateSession, getLastSession, linkTask, unlinkTask, getTasks
const sessionModel = require('../models/sessionModel');
const db = require('../config/db'); // Add this at the top

// Get all sessions for user
// GET /sessions
const getSessions = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const sessions = await sessionModel.getSessionsByUserId(userId);
        res.status(200).json({ message: 'Sessions retrieved successfully', data: sessions });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sessions', error: error.message });
    }
}

// Get a single session by ID
// GET /sessions/:id
const getSession = async (req, res) => {
    try {
        const session_id = req.params.id;
        const session = await sessionModel.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Session retrieved successfully', data: session });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving session', error: error.message });
    }
}

// Get the last session for a user
// GET /sessions/last
const getLastSession = async (req, res) => {
    try {
        const user_id = req.user.id; // Assuming user ID is stored in req.user
        const lastSession = await sessionModel.getLastSessionByUserId(user_id);
        if (!lastSession) {
            return res.status(404).json({ message: 'No sessions found for this user' });
        }
        res.status(200).json({ message: 'Last session retrieved successfully', data: lastSession });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving last session', error: error.message });
    }
}

// Create a new session
// POST /sessions
const createSession = async (req, res) => {
    try {
        const user_id = req.user.user_id || req.user.id; // JWT kan user_id of id bevatten
        const { start_time, focus_mode_id } = req.body;
        if (!start_time || !focus_mode_id) {
            return res.status(400).json({ message: 'start_time and focus_mode_id are required' });
        }
        const sessionData = { start_time, user_id, focus_mode_id };
        const newSession = await sessionModel.createSession(sessionData);
        // Set user status to active directly to avoid circular dependency and function errors
        await db.query('UPDATE "User" SET is_active = true WHERE user_id = $1', [user_id]);
        res.status(201).json({ message: 'Session created successfully', data: newSession });
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

// Finish an existing session
// POST /sessions/:id/finish
const finishSession = async (req, res) => {
    try {
        const session_id = req.params.id;
        const { end_time, successful, rating } = req.body;

        // Haal de sessie op om start_time te weten (voor duration)
        const session = await sessionModel.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Bepaal end_time en duration
        const endTime = end_time ? new Date(end_time) : new Date();
        const startTime = new Date(session.start_time);
        const duration = Math.round((endTime - startTime) / 60000); // in minuten

        // Update de sessie
        const updates = {
            end_time: endTime,
            duration,
            successful,
            rating
        };
        const updatedSession = await sessionModel.updateSessionById(session_id, updates);

        res.status(200).json({ message: 'Session finished successfully', data: updatedSession });
    } catch (error) {
        res.status(500).json({ message: 'Error finishing session', error: error.message });
    }
};

// Update an existing session
// PUT /sessions/:id
const updateSession = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const sessionData = req.body;
        const updatedSession = await sessionModel.updateSessionById(sessionId, sessionData);
        if (!updatedSession) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Session updated successfully', data: updatedSession });
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error: error.message });
    }
}

// Link a task to a session
// POST /sessions/:id/task/:taskId
const linkTask = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const taskId = req.params.taskId;
        const linkedSession = await sessionModel.linkTaskToSession(sessionId, taskId);
        if (!linkedSession) {
            return res.status(404).json({ message: 'Session or task not found' });
        }
        res.status(200).json({ message: 'Task linked to session successfully', data: linkedSession });
    } catch (error) {
        res.status(500).json({ message: 'Error linking task to session', error: error.message });
    }
}

// link multiple tasks to a session
// POST /sessions/:id/tasks
    const linkTasksBatch = async (req, res) => {
        try {
            const sessionId = req.params.id;
            const { taskIds } = req.body;
            if (!Array.isArray(taskIds) || taskIds.length === 0) {
                return res.status(400).json({ message: 'No tasks provided' });
            }
            const results = await sessionModel.linkMultipleTasksToSession(sessionId, taskIds);
            res.status(200).json({ message: 'Tasks linked to session successfully', data: results });
        } catch (error) {
            res.status(500).json({ message: 'Error linking tasks to session', error: error.message });
        }
    };

// Unlink a task from a session
// DELETE /sessions/:id/task/:taskId
const unlinkTask = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const taskId = req.params.taskId;
        const unlinkedSession = await sessionModel.unlinkTaskFromSession(sessionId, taskId);
        if (!unlinkedSession) {
            return res.status(404).json({ message: 'Session or task not found' });
        }
        res.status(200).json({ message: 'Task unlinked from session successfully', data: unlinkedSession });
    } catch (error) {
        res.status(500).json({ message: 'Error unlinking task from session', error: error.message });
    }
}

// Get all tasks linked to a session
// GET /sessions/:id/tasks
const getTasks = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const tasks = await sessionModel.getTasksBySessionId(sessionId);
        if (!tasks) {
            return res.status(404).json({ message: 'No tasks found for this session' });
        }
        res.status(200).json({ message: 'Tasks retrieved successfully', data: tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
}

module.exports = {
    getSessions,
    getSession,
    createSession,
    finishSession,
    updateSession,
    getLastSession,
    linkTask,
    linkTasksBatch,
    unlinkTask,
    getTasks
};