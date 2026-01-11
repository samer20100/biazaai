const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Automation = require('../models/Automation');
const MessageLog = require('../models/MessageLog');

// Get dashboard overview
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get connected automations
    const automations = await Automation.find({ userId, status: 'connected' });

    // Get message stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messageStats = await MessageLog.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: '$direction',
          count: { $sum: 1 },
        },
      },
    ]);

    const incoming = messageStats.find(m => m._id === 'incoming')?.count || 0;
    const outgoing = messageStats.find(m => m._id === 'outgoing')?.count || 0;

    // Get channel distribution
    const channelStats = await MessageLog.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: '$channel',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activities
    const recentActivities = await MessageLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('channel direction message createdAt');

    res.json({
      success: true,
      overview: {
        totalAutomations: automations.length,
        totalMessages: incoming + outgoing,
        incomingToday: incoming,
        outgoingToday: outgoing,
        channels: channelStats.map(c => ({ channel: c._id, count: c.count })),
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get analytics for time period
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user.id;

    let startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Aggregate messages by day
    const dailyStats = await MessageLog.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            direction: '$direction',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Format for chart
    const dates = [];
    const incomingData = [];
    const outgoingData = [];

    const currentDate = new Date(startDate);
    const today = new Date();

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);

      const incoming = dailyStats.find(
        d => d._id.date === dateStr && d._id.direction === 'incoming'
      )?.count || 0;
      const outgoing = dailyStats.find(
        d => d._id.date === dateStr && d._id.direction === 'outgoing'
      )?.count || 0;

      incomingData.push(incoming);
      outgoingData.push(outgoing);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Channel distribution
    const channelDistribution = await MessageLog.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: '$channel',
          count: { $sum: 1 },
        },
      },
    ]);

    // Response success rate
    const successStats = await MessageLog.aggregate([
      {
        $match: {
          userId: userId,
          direction: 'outgoing',
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalOutgoing = successStats.reduce((sum, s) => sum + s.count, 0);
    const successful = successStats.find(s => s._id === 'sent' || s._id === 'delivered')?.count || 0;
    const successRate = totalOutgoing > 0 ? (successful / totalOutgoing) * 100 : 0;

    res.json({
      success: true,
      analytics: {
        period,
        dates,
        incomingData,
        outgoingData,
        channelDistribution: channelDistribution.map(c => ({
          channel: c._id,
          count: c.count,
        })),
        successRate: Math.round(successRate * 100) / 100,
        totalOutgoing,
        successful,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Export data
router.post('/export', authMiddleware, async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.body;
    const userId = req.user.id;

    const query = { userId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const data = await MessageLog.find(query)
      .sort({ createdAt: -1 })
      .limit(1000) // Limit for safety
      .lean();

    if (format === 'csv') {
      // In a real implementation, you'd convert to CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
      // Generate CSV here
      res.send('CSV export would be generated here');
    } else {
      res.json({
        success: true,
        format: 'json',
        count: data.length,
        data,
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Get real-time updates (for Socket.IO)
router.get('/updates', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const lastUpdate = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 5 * 60 * 1000); // Last 5 minutes

    const newMessages = await MessageLog.find({
      userId,
      createdAt: { $gte: lastUpdate },
    }).sort({ createdAt: -1 });

    const automationChanges = await Automation.find({
      userId,
      updatedAt: { $gte: lastUpdate },
    });

    res.json({
      success: true,
      updates: {
        messages: newMessages.length,
        automations: automationChanges.length,
        lastUpdate: new Date(),
      },
      details: {
        newMessages,
        automationChanges,
      },
    });
  } catch (error) {
    console.error('Updates error:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

module.exports = router;