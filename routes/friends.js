const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends');
const authMiddleware = require('../middleware/auth');

// Get all friends for the logged-in user
router.get('/', authMiddleware, friendsController.getFriends);

// Send a friend request
router.post('/request', authMiddleware, friendsController.sendFriendRequest);

// Get incoming friend requests
router.get('/requests', authMiddleware, friendsController.getIncomingFriendRequests);

// Accept a friend request
router.post('/requests/:id/accept', authMiddleware, friendsController.acceptFriendRequest);

// Reject a friend request
router.post('/requests/:id/reject', authMiddleware, friendsController.rejectFriendRequest);

// Remove a friend
router.delete('/remove/:id', authMiddleware, friendsController.removeFriend);

// search for friends
router.post('/search', authMiddleware, friendsController.searchFriends);

module.exports = router;
