const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const QRCode = require('qrcode');
const AutomationController = require('../controllers/automation');
const authMiddleware = require('../middlewares/auth');

// WhatsApp Integration
router.post('/whatsapp/connect',
  authMiddleware,
  [
    body('phoneNumberId').notEmpty(),
    body('accessToken').notEmpty(),
  ],
  AutomationController.connectWhatsApp
);

router.get('/whatsapp/qr', authMiddleware, AutomationController.generateWhatsAppQR);

router.post('/whatsapp/webhook', AutomationController.handleWhatsAppWebhook);

// Telegram Integration
router.post('/telegram/connect',
  authMiddleware,
  [
    body('botToken').notEmpty(),
  ],
  AutomationController.connectTelegram
);

router.get('/telegram/webhook', AutomationController.setTelegramWebhook);

// Generic automation settings
router.post('/settings',
  authMiddleware,
  [
    body('welcomeMessage').optional(),
    body('responseDelay').optional().isInt({ min: 1, max: 60 }),
    body('aiEnabled').optional().isBoolean(),
  ],
  AutomationController.saveSettings
);

router.get('/settings', authMiddleware, AutomationController.getSettings);

// AI Response Logic
router.post('/respond',
  authMiddleware,
  [
    body('message').notEmpty(),
    body('channel').isIn(['whatsapp', 'telegram']),
    body('context').optional(),
  ],
  AutomationController.generateAIResponse
);

// Get connected accounts
router.get('/accounts', authMiddleware, AutomationController.getConnectedAccounts);

// Disconnect account
router.delete('/accounts/:accountId', authMiddleware, AutomationController.disconnectAccount);

module.exports = router;