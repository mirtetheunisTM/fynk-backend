const statsModel = require('../models/statsModel');

// Get all stats for a user
// GET /stats
const getStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch stats dynamically
        const longestStreak = await statsModel.getLongestStreak(userId);
        const currentStreak = await statsModel.getCurrentStreak(userId);
        const avgSessionDuration = await statsModel.getAverageFocusSession(userId);
        const totalFocusMinutes = await statsModel.getTotalFocusTime(userId);
        const sessionsCompleted = await statsModel.sessionsCompleted(userId);
        const topFocusMethod = await statsModel.getTopFocusMethod(userId);
        const bestFocusDayNumeric = await statsModel.getBestFocusDay(userId);
        const bestFocusTimeNumeric = await statsModel.getBestFocusTime(userId);
        const cheersStats = await statsModel.getCheersStats(userId);

        // Map numeric day to readable day name
        const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const bestFocusDay = dayMapping[bestFocusDayNumeric] || null;

        // Format best focus time (convert 24-hour format to readable format)
        const formatHour = (hour) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12; // Convert 24-hour to 12-hour format
            return `${formattedHour} ${period}`;
        };
        const bestFocusTime = formatHour(bestFocusTimeNumeric);

        // Ensure all values are properly formatted
        res.status(200).json({
            message: 'Statistics retrieved successfully',
            data: {
                longestStreak: Number(longestStreak) || 0, // Ensure integer
                currentStreak: Number(currentStreak) || 0, // Ensure integer
                avgSessionDuration: Number(avgSessionDuration) || 0, // Ensure float
                totalFocusMinutes: Number(totalFocusMinutes) || 0, // Ensure integer
                sessionsCompleted: Number(sessionsCompleted) || 0, // Ensure integer
                topFocusMethod: topFocusMethod || null, // Ensure string or null
                bestFocusDay: bestFocusDay || null, // Convert numeric day to readable day
                bestFocusTime: bestFocusTime || null, // Convert numeric hour to readable format
                cheersGiven: Number(cheersStats?.cheers_given) || 0, // Ensure integer
                cheersReceived: Number(cheersStats?.cheers_received) || 0, // Ensure integer
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving statistics', error: error.message });
    }
};

// get current streak onkly
// GET /stats/streak
const getCurrentStreak = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentStreak = await statsModel.getCurrentStreak(userId);
        res.status(200).json({ message: 'Current streak retrieved successfully', data: currentStreak });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving current streak', error: error.message });
    }
}

// Credits & Level system
// TO DO: Implement a more complex system with levels, credits, and rewards


module.exports = {
    getStatistics,
    getCurrentStreak,
};