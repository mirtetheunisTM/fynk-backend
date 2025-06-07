var express = require('express');
var router = express.Router();
const tasksController = require('../controllers/tasks');

/* all tasks for users: router.get('/', tasksController.getTasks);
get single task: router.get(/:id, tasksController.getTask);
create task: router.post(/, tasksController.createTask);
update task: router.put(/:id, tasksController.updateTask);
mark task as completed: router.put(/:id/complete, tasksController.completeTask);
delete task: router.delete(/:id, tasksController.deleteTask);
get tasks by status: router.get(/status/:status, tasksController.getTasksByStatus);
get all sessions task is linked to: router.get(/:id/sessions, tasksController.getSessions); */

module.exports = router;