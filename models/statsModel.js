const db = require('../config/db');

// Get the current streak of focus sessions for a user
const getCurrentStreak = async (userId) => {
    const query = `
        WITH consecutive_days AS (
            SELECT 
                session_date,
                ROW_NUMBER() OVER (ORDER BY session_date DESC) AS row_number
            FROM "FocusSession"
            WHERE user_id = $1
            GROUP BY session_date
        ),
        streak AS (
            SELECT COUNT(*) AS current_streak
            FROM consecutive_days
            WHERE session_date = CURRENT_DATE - INTERVAL '1 day' * (row_number - 1)
        )
        SELECT current_streak FROM streak;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.current_streak || 0;
};

// Longest streak
const getLongestStreak = async (userId) => {
    const query = `
        WITH consecutive_days AS (
            SELECT session_date,
                ROW_NUMBER() OVER (ORDER BY session_date) AS row_number
            FROM "FocusSession"
            WHERE user_id = $1
            GROUP BY session_date
        ),
        streaks AS (
            SELECT COUNT(*) AS streak_length
            FROM consecutive_days
            WHERE session_date = CURRENT_DATE - INTERVAL '1 day' * (row_number - 1)
            GROUP BY row_number
        )
        SELECT MAX(streak_length) AS longest_streak FROM streaks;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.streak || 0;
};

// Top focus method
const getTopFocusMethod = async (userId) => {
    const query = `
        SELECT fm.name AS focus_mode_name, COUNT(fs.focus_mode_id) AS usage_count
        FROM "FocusSession" fs
        JOIN "FocusMode" fm ON fs.focus_mode_id = fm.focus_mode_id
        WHERE fs.user_id = $1
        GROUP BY fm.name
        ORDER BY usage_count DESC
        LIMIT 1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.focus_mode_name || null; // Return the name of the focus mode
};

// Cheers given/received
const getCheersStats = async (userId) => {
    const query = `
        SELECT 
            SUM(CASE WHEN giver_user_id = $1 THEN 1 ELSE 0 END) AS cheers_given,
            SUM(CASE WHEN receiver_user_id = $1 THEN 1 ELSE 0 END) AS cheers_received
        FROM "Cheers";
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
};

// Best focus time
const getBestFocusTime = async (userId) => {
    const query = `
        SELECT EXTRACT(HOUR FROM start_time) AS focus_hour, COUNT(*) AS session_count
        FROM "FocusSession"
        WHERE user_id = $1
        GROUP BY focus_hour
        ORDER BY session_count DESC
        LIMIT 1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.focus_hour || null;
};

// Best focus day
const getBestFocusDay = async (userId) => {
    const query = `
        SELECT EXTRACT(DOW FROM start_time) AS focus_day, COUNT(*) AS session_count
        FROM "FocusSession"
        WHERE user_id = $1
        GROUP BY focus_day
        ORDER BY session_count DESC
        LIMIT 1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.focus_day || null;
};

// Average focus session
const getAverageFocusSession = async (userId) => {
    const query = `
        SELECT AVG(duration) AS average_duration
        FROM "FocusSession"
        WHERE user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.average_duration || 0;
};

module.exports = {
    getCurrentStreak,
    getLongestStreak,
    getTopFocusMethod,
    getCheersStats,
    getBestFocusTime,
    getBestFocusDay,
    getAverageFocusSession,
};