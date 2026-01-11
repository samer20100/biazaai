const { validationResult } = require('express-validator');
const QRCode = require('qrcode');
const axios = require('axios');
const { OpenAI } = require('openai');
const Automation = require('../models/Automation');
const MessageLog = require('../models/MessageLog');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AutomationController {
  // Connect WhatsApp Business
  static async connectWhatsApp(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phoneNumberId, accessToken } = req.body;
      const userId = req.user.id;

      // In a real implementation, you would verify the credentials with WhatsApp Cloud API
      const verification = await axios.get(
        `https://graph.facebook.com/v18.0/${phoneNumberId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      ).catch(() => null);

      if (!verification) {
        return res.status(400).json({ error: 'Invalid WhatsApp credentials' });
      }

      // Save automation settings
      const automation = await Automation.findOneAndUpdate(
        { userId, channel: 'whatsapp' },
        {
          userId,
          channel: 'whatsapp',
          credentials: { phoneNumberId, accessToken },
          status: 'connected',
          connectedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        message: 'WhatsApp connected successfully',
        automation,
      });
    } catch (error) {
      console.error('WhatsApp connection error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Generate QR code for WhatsApp linking
  static async generateWhatsAppQR(req, res) {
    try {
      const userId = req.user.id;
      const qrData = `https://biazaai.com/link/whatsapp?userId=${userId}&token=${Date.now()}`;

      const qrCode = await QRCode.toDataURL(qrData);

      res.json({
        success: true,
        qrCode,
        qrData,
      });
    } catch (error) {
      console.error('QR generation error:', error);
      res.status(500).json({ error: 'Failed to generate QR' });
    }
  }

  // Handle incoming WhatsApp webhook
  static async handleWhatsAppWebhook(req, res) {
    try {
      const { body } = req;

      // Verify webhook signature (simplified)
      if (body.object !== 'whatsapp_business_account') {
        return res.sendStatus(400);
      }

      // Process incoming message
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body;

        // Log message
        await MessageLog.create({
          channel: 'whatsapp',
          from,
          to: changes.value.metadata.display_phone_number,
          message: text,
          direction: 'incoming',
          timestamp: new Date(),
        });

        // Generate AI response
        const aiResponse = await this.generateResponse(text, 'whatsapp', { from });

        // Send response back via WhatsApp API (in real implementation)
        // await this.sendWhatsAppMessage(from, aiResponse);

        // Log outgoing message
        await MessageLog.create({
          channel: 'whatsapp',
          from: changes.value.metadata.display_phone_number,
          to: from,
          message: aiResponse,
          direction: 'outgoing',
          timestamp: new Date(),
        });
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook error:', error);
      res.sendStatus(500);
    }
  }

  // Connect Telegram Bot
  static async connectTelegram(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { botToken } = req.body;
      const userId = req.user.id;

      // Verify bot token
      const verification = await axios.get(
        `https://api.telegram.org/bot${botToken}/getMe`
      ).catch(() => null);

      if (!verification || !verification.data.ok) {
        return res.status(400).json({ error: 'Invalid Telegram bot token' });
      }

      const botInfo = verification.data.result;

      // Save automation settings
      const automation = await Automation.findOneAndUpdate(
        { userId, channel: 'telegram' },
        {
          userId,
          channel: 'telegram',
          credentials: { botToken, botUsername: botInfo.username },
          status: 'connected',
          connectedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        message: 'Telegram bot connected successfully',
        automation,
        botInfo,
      });
    } catch (error) {
      console.error('Telegram connection error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Set Telegram webhook
  static async setTelegramWebhook(req, res) {
    try {
      const { token } = req.query;
      const automation = await Automation.findOne({ 'credentials.botToken': token });

      if (!automation) {
        return res.status(404).json({ error: 'Bot not found' });
      }

      const webhookUrl = `${process.env.BASE_URL}/api/automation/telegram/webhook/callback?token=${token}`;

      await axios.post(
        `https://api.telegram.org/bot${token}/setWebhook`,
        { url: webhookUrl }
      );

      res.json({ success: true, webhookUrl });
    } catch (error) {
      console.error('Webhook setup error:', error);
      res.status(500).json({ error: 'Failed to set webhook' });
    }
  }

  // Save automation settings
  static async saveSettings(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const { welcomeMessage, responseDelay, aiEnabled } = req.body;

      const settings = await Automation.findOneAndUpdate(
        { userId },
        { settings: { welcomeMessage, responseDelay, aiEnabled } },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        message: 'Settings saved',
        settings: settings.settings,
      });
    } catch (error) {
      console.error('Save settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get automation settings
  static async getSettings(req, res) {
    try {
      const userId = req.user.id;
      const automation = await Automation.findOne({ userId });

      res.json({
        success: true,
        settings: automation?.settings || {},
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Generate AI response (core logic)
  static async generateAIResponse(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, channel, context } = req.body;
      const userId = req.user.id;

      // Get user's automation settings
      const automation = await Automation.findOne({ userId });
      const aiEnabled = automation?.settings?.aiEnabled ?? true;

      let response;
      if (aiEnabled && process.env.OPENAI_API_KEY) {
        // Use OpenAI for intelligent response
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful assistant responding in Arabic.' },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
        });
        response = completion.choices[0].message.content;
      } else {
        // Fallback to rule-based response
        response = this.getRuleBasedResponse(message, channel);
      }

      // Log the interaction
      await MessageLog.create({
        userId,
        channel,
        message,
        response,
        direction: 'outgoing',
        timestamp: new Date(),
      });

      res.json({
        success: true,
        response,
        aiUsed: aiEnabled,
      });
    } catch (error) {
      console.error('AI response error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  }

  // Rule-based fallback responses
  static getRuleBasedResponse(message, channel) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
      return 'مرحباً! كيف يمكنني مساعدتك اليوم؟';
    } else if (lowerMessage.includes('شكرا')) {
      return 'العفو! نحن هنا لخدمتك.';
    } else if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة')) {
      return 'يمكنك الاطلاع على الأسعار من خلال زيارة صفحة التسعير على موقعنا.';
    } else {
      return 'شكراً على رسالتك. فريق الدعم سيرد عليك قريباً.';
    }
  }

  // Get connected accounts
  static async getConnectedAccounts(req, res) {
    try {
      const userId = req.user.id;
      const accounts = await Automation.find({ userId });

      res.json({
        success: true,
        accounts,
      });
    } catch (error) {
      console.error('Get accounts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Disconnect account
  static async disconnectAccount(req, res) {
    try {
      const { accountId } = req.params;
      const userId = req.user.id;

      const result = await Automation.deleteOne({ _id: accountId, userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json({
        success: true,
        message: 'Account disconnected',
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AutomationController;