const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'telegram', 'email', 'web'],
    required: true,
  },
  credentials: {
    // WhatsApp
    phoneNumberId: String,
    accessToken: String,
    // Telegram
    botToken: String,
    botUsername: String,
    // Generic
    apiKey: String,
    webhookUrl: String,
  },
  status: {
    type: String,
    enum: ['connected', 'pending', 'disconnected', 'error'],
    default: 'pending',
  },
  settings: {
    welcomeMessage: { type: String, default: 'مرحباً! كيف يمكنني مساعدتك؟' },
    responseDelay: { type: Number, default: 5, min: 1, max: 60 }, // seconds
    aiEnabled: { type: Boolean, default: true },
    language: { type: String, default: 'ar' },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      timezone: { type: String, default: 'Asia/Riyadh' },
    },
  },
  stats: {
    totalMessages: { type: Number, default: 0 },
    successfulReplies: { type: Number, default: 0 },
    failedReplies: { type: Number, default: 0 },
    lastMessageAt: Date,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
  lastSyncedAt: Date,
}, {
  timestamps: true,
});

// Index for faster queries
automationSchema.index({ userId: 1, channel: 1 }, { unique: true });
automationSchema.index({ status: 1 });

const Automation = mongoose.model('Automation', automationSchema);

module.exports = Automation;