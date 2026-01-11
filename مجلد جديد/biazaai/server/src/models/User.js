const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'canceled', 'pending'],
      default: 'active',
    },
    expiresAt: Date,
    features: {
      maxAutomations: { type: Number, default: 1 },
      maxMessages: { type: Number, default: 1000 },
      aiAccess: { type: Boolean, default: true },
      prioritySupport: { type: Boolean, default: false },
    },
  },
  settings: {
    language: { type: String, default: 'ar' },
    timezone: { type: String, default: 'Asia/Riyadh' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
  },
  stats: {
    totalAutomations: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.status': 1 });

// Virtual for subscription status
userSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.status !== 'active') return false;
  if (this.subscription.expiresAt && this.subscription.expiresAt < new Date()) {
    return false;
  }
  return true;
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;