// models/chatbot.js
const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  conversationType: {
    type: String,
    enum: ['prospecting', 'support'],
    required: true
  },
  messages: [{
    sender: String,
    content: String,
    sentiment: Number,
    stage: String,
    timestamp: { type: Date, default: Date.now }
  }],
  customFields: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Chatbot', chatbotSchema);
