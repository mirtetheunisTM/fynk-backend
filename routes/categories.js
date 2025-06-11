const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "Category" ORDER BY name ASC;');
        res.status(200).json({ message: 'Categories retrieved successfully', data: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error: error.message });
    }
});

// GET route to get a specific category by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const result = await db.query('SELECT * FROM "Category" WHERE category_id = $1;', [categoryId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category retrieved successfully', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category', error: error.message });
    }
});

module.exports = router;