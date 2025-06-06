var express = require('express');
var router = express.Router();
const sessionsController = require('../controllers/sessions');

/* all sessions for user: router.get(/, sessionsController.getSessions);
get single session: router.get(/:id, sessionsController.getSession);
create session: router.post(/, sessionsController.createSession);
update session: router.put(/:id, sessionsController.updateSession);
get last session: router.get(/last, sessionsController.getLastSession); */

/* link task to session: router.post(/:id/task/:taskId, sessionsController.linkTask);
unlink task from session: router.delete(/:id/task/:taskId, sessionsController.unlinkTask);
all tasks linked to session: router.get(/:id/tasks, sessionsController.getTasks); */