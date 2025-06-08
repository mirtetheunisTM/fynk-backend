var express = require('express');
var router = express.Router();
const sessionsController = require('../controllers/sessions');
const authMiddleware = require('../middleware/auth');

/* all sessions for user: router.get(/, sessionsController.getSessions);
get single session: router.get(/:id, sessionsController.getSession);
create session: router.post(/, sessionsController.createSession);
update session: router.put(/:id, sessionsController.updateSession);
get last session: router.get(/last, sessionsController.getLastSession); */

/* link task to session: router.post(/:id/task/:taskId, sessionsController.linkTask);
unlink task from session: router.delete(/:id/task/:taskId, sessionsController.unlinkTask);
all tasks linked to session: router.get(/:id/tasks, sessionsController.getTasks); */

// Get all sessions for the logged-in user
router.get('/', authMiddleware, sessionsController.getSessions);

// Get the last session for a user
router.get('/last', authMiddleware, sessionsController.getLastSession);

// Get a single session by ID
router.get('/:id', authMiddleware, sessionsController.getSession);

// Create a new session
router.post('/', authMiddleware, sessionsController.createSession);

// Update an existing session
router.put('/:id', authMiddleware, sessionsController.updateSession);

// Link a task to a session
router.post('/:id/task/:taskId', authMiddleware, sessionsController.linkTask);

// Unlink a task from a session
router.delete('/:id/task/:taskId', authMiddleware, sessionsController.unlinkTask);

// Get all tasks linked to a session
router.get('/:id/tasks', authMiddleware, sessionsController.getTasks);


module.exports = router;