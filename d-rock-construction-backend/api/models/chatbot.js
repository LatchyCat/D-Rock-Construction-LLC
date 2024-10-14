const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  conversationType: {
    type: String,
    enum: ['schedule_callback', 'request_quote', 'unknown'],
    required: true
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  customerInfo: {
    name: String,
    email: String,
    phone: String,
  },
  callbackInfo: {
    preferredDate: Date,
    preferredTime: String,
  },
  quoteInfo: {
    projectType: String,
    projectDescription: String,
    estimatedBudget: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'follow-up'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  }
});

// Update lastInteraction on save
chatbotSchema.pre('save', function(next) {
  this.lastInteraction = new Date();
  next();
});

// Virtual for conversation duration
chatbotSchema.virtual('duration').get(function() {
  return this.lastInteraction - this.createdAt;
});

// Method to add a message to the conversation
chatbotSchema.methods.addMessage = function(sender, content) {
  this.messages.push({ sender, content });
  this.lastInteraction = new Date();
};

// Method to update customer info
chatbotSchema.methods.updateCustomerInfo = function(info) {
  this.customerInfo = { ...this.customerInfo, ...info };
};

// Method to update callback info
chatbotSchema.methods.updateCallbackInfo = function(info) {
  this.callbackInfo = { ...this.callbackInfo, ...info };
};

// Method to update quote info
chatbotSchema.methods.updateQuoteInfo = function(info) {
  this.quoteInfo = { ...this.quoteInfo, ...info };
};

// Method to change conversation type
chatbotSchema.methods.changeConversationType = function(newType) {
  if (this.schema.path('conversationType').enumValues.includes(newType)) {
    this.conversationType = newType;
  } else {
    throw new Error(`Invalid conversation type: ${newType}`);
  }
};

module.exports = mongoose.model('Chatbot', chatbotSchema);
