const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware to authenticate requests

const db = require('../config/db'); // Assuming you have a db module to handle database queries

// GET route to ge focusmodes from database
// This route retrieves all focus modes from the database
router.get('/', authMiddleware, async (req, res) => {
    try {
        const focusModes = await db.query('SELECT * FROM "FocusMode" ORDER BY name ASC;');
        res.status(200).json({ message: 'Focus modes retrieved successfully', data: focusModes.rows });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving focus modes', error: error.message });
    }
});

// GET route to get a specific focus mode by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const focusModeId = req.params.id;
        const focusMode = await db.query('SELECT * FROM "FocusMode" WHERE focus_mode_id = $1;', [focusModeId]);
        if (focusMode.rows.length === 0) {
            return res.status(404).json({ message: 'Focus mode not found' });
        }
        res.status(200).json({ message: 'Focus mode retrieved successfully', data: focusMode.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving focus mode', error: error.message });
    }
});

module.exports = router;