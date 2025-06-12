const db = require ('../config/db');

// Get all friend user_ids for a user (bidirectional, only accepted)
const getFriendUserIds = async (userId) => {
    const query = `
        SELECT 
            CASE 
                WHEN user_id = $1 THEN friend_user_id
                ELSE user_id
            END AS friend_id
        FROM "Friendship"
        WHERE (user_id = $1 OR friend_user_id = $1) AND status = 'accepted'
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows.map(row => row.friend_id); // Array of friend user IDs
};

// send a friend request
const sendFriendRequest = async (userId, friendId) => {
    const query = `
        INSERT INTO "Friendship" (user_id, friend_user_id, status)
        VALUES ($1, $2, 'pending')
        RETURNING *;
    `;
    const values = [userId, friendId];
    const result = await db.query(query, values);
    return result.rows[0]; // Returns the created friend request
};

// get incoming friend requests
const getIncomingFriendRequests = async (userId) => {
    const query = `
        SELECT * FROM "Friendship"
        WHERE friend_user_id = $1 AND status = 'pending';
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows; // Returns an array of incoming friend requests
};

// accept a friend request
const acceptFriendRequest = async (requestId) => {
    const query = `
        UPDATE "Friendship"
        SET status = 'accepted'
        WHERE friendship_id = $1
        RETURNING *;
    `;
    const values = [requestId];
    const result = await db.query(query, values);
    return result.rows[0]; // Returns the updated friend request
};

// reject a friend request
const rejectFriendRequest = async (requestId) => {
    const query = `
        UPDATE "Friendship"
        SET status = 'rejected'
        WHERE friendship_id = $1
        RETURNING *;
    `;
    const values = [requestId];
    const result = await db.query(query, values);
    return result.rows[0]; // Returns the updated friend request
};

// remove a friend
const removeFriend = async (userId, friendId) => {
    const query = `
        DELETE FROM "Friendship"
        WHERE 
            (
                (user_id = $1 AND friend_user_id = $2)
                OR
                (user_id = $2 AND friend_user_id = $1)
            )
            AND status = 'accepted'
        RETURNING *;
    `;
    const values = [userId, friendId];
    const result = await db.query(query, values);
    return result.rows[0];
};



module.exports = {
    getFriendUserIds,
    getFriendUserIds,
    sendFriendRequest,
    getIncomingFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
};