const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  automationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Automation',
    index: true,
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'telegram', 'email', 'web', 'api'],
    required: true,
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  aiUsed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed', 'pending'],
    default: 'sent',
  },
  metadata: {
    messageId: String,
    timestamp: Date,
    mediaUrl: String,
    contentType: String,
    rawData: mongoose.Schema.Types.Mixed,
  },
  processingTime: {
    type: Number, // milliseconds
  },
  error: {
    code: String,
    message: String,
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
messageLogSchema.index({ userId: 1, timestamp: -1 });
messageLogSchema.index({ channel: 1, direction: 1 });
messageLogSchema.index({ automationId: 1, status: 1 });
messageLogSchema.index({ 'metadata.messageId': 1 }, { unique: true, sparse: true });

// Virtual for human-readable date
messageLogSchema.virtual('date').get(function() {
  return this.createdAt.toLocaleDateString('ar-SA');
});

// Virtual for time ago
messageLogSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `منذ ${diffMins} دقيقة`;
  } else if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  } else {
    return `منذ ${diffDays} يوم`;
  }
});

const MessageLog = mongoose.model('MessageLog', messageLogSchema);

module.exports = MessageLog;