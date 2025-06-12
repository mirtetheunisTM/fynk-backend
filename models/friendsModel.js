const db = require ('../config/db');

// GET all friends for a user
const getFriendsByUserId = async (userId) => {
    const query = `
        SELECT * FROM "Friendship"
        WHERE user_id = $1
        ORDER BY friend_name ASC;
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows; // Returns an array of friends for the user
};

module.exports = {
    getFriendsByUserId
};