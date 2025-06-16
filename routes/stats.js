const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats');
const authMiddleware = require('../middleware/auth');


// Route to fetch all statistics for the logged-in user
router.get('/', authMiddleware, statsController.getStatistics);

// Route to fetch current streak
router.get('/streak', authMiddleware, statsController.getCurrentStreak);

// Route to fetch current level
router.get('/level', authMiddleware, statsController.getCurrentLevel);
// Route to fetch current XP
router.get('/xp', authMiddleware, statsController.getCurrentXP);
// Route to fetch next level threshold  
router.get('/nextLevel', authMiddleware, statsController.getNextLevelThreshold);
// Route to fetch next level and name
router.get('/nextLevelName', authMiddleware, statsController.getNextLevelName);

module.exports = router;