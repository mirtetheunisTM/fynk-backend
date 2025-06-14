const statsModel = require('../models/statsModel');

// Get all stats for a user
// GET /stat
const getStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        const longestStreak = await statsModel.getLongestStreak(userId);
        const currentStreak = await statsModel.getCurrentStreak(userId);
        const topFocusMethod = await statsModel.getTopFocusMethod(userId);
        const cheersStats = await statsModel.getCheersStats(userId);
        const bestFocusTimeNumeric = await statsModel.getBestFocusTime(userId);
        const bestFocusDayNumeric = await statsModel.getBestFocusDay(userId);
        const averageFocusSession = await statsModel.getAverageFocusSession(userId);

        // Convert numeric values to readable formats
        const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const formatHour = (hour) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour} ${period}`;
        };

        res.status(200).json({
            message: 'Statistics retrieved successfully',
            data: {
                longestStreak: longestStreak || 0,
                currentStreak: currentStreak || 0,
                topFocusMethod: topFocusMethod || null,
                cheersGiven: cheersStats.cheers_given || 0,
                cheersReceived: cheersStats.cheers_received || 0,
                bestFocusTime: formatHour(bestFocusTimeNumeric) || null,
                bestFocusDay: dayMapping[bestFocusDayNumeric] || null,
                averageFocusSession: averageFocusSession || 0,
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
};

module.exports = {
    getStatistics,
    getCurrentStreak,
};