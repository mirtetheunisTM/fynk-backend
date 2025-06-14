const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats');
const authMiddleware = require('../middleware/auth');


// Route to fetch all statistics for the logged-in user
router.get('/', authMiddleware, statsController.getStatistics);

// Route to fetch current streak
router.get('/streak', authMiddleware, statsController.getCurrentStreak);

module.exports = router;