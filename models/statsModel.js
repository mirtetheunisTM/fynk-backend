const db = require('../config/db');

// Update a specific field in the Stats table
const updateStatsField = async (userId, field, value) => {
    // Check if the user has a row in the Stats table
    const checkQuery = `
        SELECT 1 FROM "Stats" WHERE user_id = $1;
    `;
    const checkResult = await db.query(checkQuery, [userId]);

    // If no row exists, create one
    if (checkResult.rows.length === 0) {
        const insertQuery = `
            INSERT INTO "Stats" (user_id) VALUES ($1);
        `;
        await db.query(insertQuery, [userId]);
    }

    // Update the specific field
    const updateQuery = `
        UPDATE "Stats"
        SET ${field} = $2
        WHERE user_id = $1;
    `;
    await db.query(updateQuery, [userId, value]);
};

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
    const currentStreak = result.rows[0]?.current_streak || 0;
    await updateStatsField(userId, 'current_streak', currentStreak);
    return currentStreak;
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
    const longestStreak = result.rows[0]?.streak || 0;
    await updateStatsField(userId, 'longest_streak', longestStreak);
    return longestStreak;
};

// Update the top focus method in the Stats table
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
    const topFocusMethod = result.rows[0]?.focus_mode_name || null;
    await updateStatsField(userId, 'top_focus_method', topFocusMethod);
    return topFocusMethod;
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

// total time spent in focus sessions
const getTotalFocusTime = async (userId) => {
    const query = `
        SELECT SUM(duration) AS total_duration
        FROM "FocusSession"
        WHERE user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.total_duration || 0;
};

// update sessions completed in Stats table

// get amount of focus sessions completed
const sessionsCompleted = async (userId) => {
    const query = `
        SELECT COUNT(*) AS sessions_completed
        FROM "FocusSession"
        WHERE user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.session_count || 0;
};

// Level and XP system
// get current level
const getCurrentLevel = async (userId) => {
    try {
        const query = `
            SELECT s.current_level, lt.level_name
            FROM "Stats" s
            JOIN "LevelThresholds" lt ON s.current_level = lt.level
            WHERE s.user_id = $1;
        `;
        const result = await db.query(query, [userId]);

        if (result.rows.length === 0) {
            throw new Error('User stats not found');
        }

        const { current_level, level_name } = result.rows[0];
        return { currentLevel: current_level, levelName: level_name };
    } catch (error) {
        console.error('Error retrieving current level:', error.message);
        throw error;
    }
};

// get current XP
const getCurrentXP = async (userId) => {
    const query = `
        SELECT current_xp FROM "Stats" WHERE user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.current_xp || 0; // Default to 0 if not found
};

// get xp required for NEXT level
const getNextLevelThreshold = (level) => {
    // fetch from  LevelThresholds table
    const query = `
        SELECT xp_required FROM "LevelThresholds" WHERE level = $1;
    `;
    return db.query(query, [level])
        .then(result => result.rows[0]?.xp_threshold || 0) // Default to 0 if not found
        .catch(err => {
            console.error('Error fetching next level threshold:', err);
            return 0; // Default to 0 on error
        });
};

// update the current level and XP in the Stats table
const updateXPAndLevel = async (userId, xpEarned) => {
    try {
        // Ensure a row exists for the user in the Stats table
        const initializeStatsQuery = `
            INSERT INTO "Stats" (user_id, current_xp, current_level, total_focus_min, avg_session_duration, sessions_completed, longest_streak, current_streak, credits, last_updated)
            VALUES ($1, 0, 1, 0, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) DO NOTHING;
        `;
        await db.query(initializeStatsQuery, [userId]);

        // Update XP and increment sessions_completed in Stats table
        const statsQuery = `
            UPDATE "Stats"
            SET 
                current_xp = current_xp + $1,
                sessions_completed = sessions_completed + 1
            WHERE user_id = $2
            RETURNING current_xp, current_level, sessions_completed;
        `;
        const statsResult = await db.query(statsQuery, [xpEarned, userId]);

        if (statsResult.rows.length === 0) {
            throw new Error('Failed to update stats for user');
        }

        const { current_xp, current_level } = statsResult.rows[0];

        // Fetch XP threshold for the next level
        const thresholdQuery = `
            SELECT xp_required
            FROM "LevelThresholds"
            WHERE level = $1;
        `;
        const thresholdResult = await db.query(thresholdQuery, [current_level + 1]);
        const nextLevelThreshold = thresholdResult.rows[0]?.xp_required;

        // Check if user leveled up
        if (nextLevelThreshold && current_xp >= nextLevelThreshold) {
            const newLevel = current_level + 1;
            await db.query(`
                UPDATE "Stats"
                SET current_level = $1
                WHERE user_id = $2;
            `, [newLevel, userId]);
        }
    } catch (error) {
        console.error('Error updating XP and level:', error.message);
        throw error;
    }
};


module.exports = {
    getCurrentStreak,
    getLongestStreak,
    getTopFocusMethod,
    getCheersStats,
    getBestFocusTime,
    getBestFocusDay,
    getAverageFocusSession,
    getTotalFocusTime,
    sessionsCompleted,
    updateStatsField,
    getCurrentLevel,
    getCurrentXP,
    getNextLevelThreshold,
    updateXPAndLevel
};