var express = require('express');
var router = express.Router();
const tasksController = require('../controllers/tasks');
const authMiddleware = require('../middleware/auth');

/* all tasks for users: router.get('/', tasksController.getTasks);
get single task: router.get(/:id, tasksController.getTask);
create task: router.post(/, tasksController.createTask);
update task: router.put(/:id, tasksController.updateTask);
mark task as completed: router.put(/:id/complete, tasksController.completeTask);
delete task: router.delete(/:id, tasksController.deleteTask);
get tasks by status: router.get(/status/:status, tasksController.getTasksByStatus);
*/

router.get('/', authMiddleware, tasksController.getTasks); // Get all tasks for the logged-in user
router.get('/:id', authMiddleware, tasksController.getTask); // Get a specific task by ID
router.post('/', authMiddleware, tasksController.createTask); // Create a new task
router.put('/:id', authMiddleware, tasksController.updateTask); // Update an existing task
router.put('/:id/complete', authMiddleware, tasksController.completeTask); // Mark a task as completed
router.delete('/:id', authMiddleware, tasksController.deleteTask); // Delete a task
router.get('/status/:status', authMiddleware, tasksController.getTasksByStatus); // Get tasks by status

module.exports = router;