const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { OpenAI } = require('openai');
const authMiddleware = require('../middlewares/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI response
router.post('/generate',
  authMiddleware,
  [
    body('prompt').notEmpty().trim(),
    body('model').optional().isIn(['gpt-4', 'gpt-3.5-turbo', 'claude-3']),
    body('maxTokens').optional().isInt({ min: 1, max: 4000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { prompt, model = 'gpt-4', maxTokens = 500 } = req.body;

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant responding in Arabic.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;

      // Log usage (in a real app, you'd track user quotas)
      // await UsageLog.create({ userId: req.user.id, model, tokens: completion.usage.total_tokens });

      res.json({
        success: true,
        response,
        model,
        tokens: completion.usage?.total_tokens,
      });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  }
);

// Generate image with DALL-E
router.post('/generate-image',
  authMiddleware,
  [
    body('prompt').notEmpty().trim(),
    body('size').optional().isIn(['256x256', '512x512', '1024x1024']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { prompt, size = '512x512' } = req.body;

      const image = await openai.images.generate({
        prompt,
        n: 1,
        size,
      });

      res.json({
        success: true,
        imageUrl: image.data[0].url,
        prompt,
        size,
      });
    } catch (error) {
      console.error('Image generation error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  }
);

// Analyze sentiment
router.post('/analyze-sentiment',
  authMiddleware,
  [
    body('text').notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const { text } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Analyze the sentiment of the following text and return a JSON with sentiment (positive, negative, neutral), confidence (0-1), and keyEmotions array.' },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      res.json({
        success: true,
        analysis,
      });
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
  }
);

// Summarize text
router.post('/summarize',
  authMiddleware,
  [
    body('text').notEmpty().trim(),
    body('length').optional().isIn(['short', 'medium', 'long']),
  ],
  async (req, res) => {
    try {
      const { text, length = 'medium' } = req.body;

      const lengthMap = {
        short: 'in 2-3 sentences',
        medium: 'in a paragraph',
        long: 'in multiple paragraphs',
      };

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `Summarize the following text ${lengthMap[length]} in Arabic.` },
          { role: 'user', content: text },
        ],
      });

      const summary = completion.choices[0].message.content;

      res.json({
        success: true,
        summary,
        length,
      });
    } catch (error) {
      console.error('Summarization error:', error);
      res.status(500).json({ error: 'Failed to summarize text' });
    }
  }
);

// Translate text
router.post('/translate',
  authMiddleware,
  [
    body('text').notEmpty().trim(),
    body('targetLang').notEmpty().isIn(['ar', 'en', 'fr', 'es', 'de']),
  ],
  async (req, res) => {
    try {
      const { text, targetLang } = req.body;

      const languageNames = {
        ar: 'Arabic',
        en: 'English',
        fr: 'French',
        es: 'Spanish',
        de: 'German',
      };

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `Translate the following text to ${languageNames[targetLang]}.` },
          { role: 'user', content: text },
        ],
      });

      const translation = completion.choices[0].message.content;

      res.json({
        success: true,
        translation,
        sourceText: text,
        targetLang,
      });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: 'Failed to translate text' });
    }
  }
);

// Get available AI models
router.get('/models', authMiddleware, async (req, res) => {
  try {
    // In a real app, you might fetch from OpenAI API
    const models = [
      { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', maxTokens: 8192 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective', maxTokens: 4096 },
      { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s latest model', maxTokens: 200000 },
      { id: 'dall-e-3', name: 'DALL-E 3', description: 'Image generation', maxTokens: null },
    ];

    res.json({
      success: true,
      models,
    });
  } catch (error) {
    console.error('Models fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

module.exports = router;