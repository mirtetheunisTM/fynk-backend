const friendsModel = require('../models/friendsModel');

// Get all friend user_ids for a user
// GET /friends
const getFriends = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const friendUserIds = await friendsModel.getFriendUserIds(userId);
        res.status(200).json({ message: 'Friends retrieved successfully', data: friendUserIds });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving friends', error: error.message });
    }
}

// Send a friend request
// POST /friends/request
const sendFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const { friendId } = req.body;
        if (!friendId) {
            return res.status(400).json({ message: 'friendId is required' });
        }
        const newRequest = await friendsModel.sendFriendRequest(userId, friendId);
        res.status(201).json({ message: 'Friend request sent successfully', data: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error: error.message });
    }
}

// Get incoming friend requests
// GET /friends/requests/
const getIncomingFriendRequests = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const requests = await friendsModel.getIncomingFriendRequests(userId);
        res.status(200).json({ message: 'Incoming friend requests retrieved successfully', data: requests });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving incoming friend requests', error: error.message });
    }
}

// Accept a friend request
// POST /friends/request/:id/accept
const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        if (!requestId) {
            return res.status(400).json({ message: 'requestId is required' });
        }
        const updatedRequest = await friendsModel.acceptFriendRequest(requestId);
        res.status(200).json({ message: 'Friend request accepted successfully', data: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error: error.message });
    }
}

// Reject a friend request
// POST /friends/request/:id/reject
const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        if (!requestId) {
            return res.status(400).json({ message: 'requestId is required' });
        }
        const updatedRequest = await friendsModel.rejectFriendRequest(requestId);
        res.status(200).json({ message: 'Friend request rejected successfully', data: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting friend request', error: error.message });
    }
}

// Remove a friend
const removeFriend = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const { friendId } = req.body;
        if (!friendId) {
            return res.status(400).json({ message: 'friendId is required' });
        }
        const result = await friendsModel.removeFriend(userId, friendId);
        res.status(200).json({ message: 'Friend removed successfully', data: result });
        
    } catch (error) {
        res.status(500).json({ message: 'Error removing friend', error: error.message });
    }
}

// search for friends
const searchFriends = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        const friends = await friendsModel.searchFriendsByUsername(username);
        res.status(200).json({ message: 'Friends retrieved successfully', data: friends });
    } catch (error) {
        res.status(500).json({ message: 'Error searching for friends', error: error.message });
    }
}

module.exports = {
    getFriends,
    sendFriendRequest,
    getIncomingFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    searchFriends

};