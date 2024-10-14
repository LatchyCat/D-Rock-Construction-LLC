// api/services/ConversationFlowService.js
const natural = require('natural');

module.exports = {
  determineNextStage: function(currentStage, intent, customFields, sentiment) {
    const stageFlow = {
      'greeting': ['inquiry', 'qualification'],
      'inquiry': ['qualification', 'proposal'],
      'qualification': ['proposal', 'objection_handling'],
      'proposal': ['objection_handling', 'closing'],
      'objection_handling': ['proposal', 'closing'],
      'closing': ['wrap_up', 'follow_up']
    };

    // Consider intent and sentiment in stage determination
    if (intent === 'negative_feedback' || sentiment < -0.5) {
      return 'objection_handling';
    }

    if (intent === 'ready_to_buy' && currentStage !== 'closing') {
      return 'closing';
    }

    const nextStages = stageFlow[currentStage] || ['wrap_up'];
    return nextStages[Math.floor(Math.random() * nextStages.length)];
  },

  determineBranch: function(conversation, branchChoice) {
    const recentMessages = conversation.messages.slice(-5);
    const recentIntents = recentMessages.map(m => m.intent);

    if (recentIntents.includes('price_inquiry')) {
      return 'pricing';
    }

    if (recentIntents.includes('service_inquiry')) {
      return 'services';
    }

    if (recentIntents.includes('schedule_inquiry')) {
      return 'schedule';
    }

    return branchChoice || 'general';
  },

  getPromptForBranch: function(branch, customFields) {
    const prompts = {
      'pricing': `Would you like to know about our pricing options? ${customFields.budget ? `I see your budget is around ${customFields.budget}.` : ''}`,
      'services': `Which of our services are you interested in? We specialize in ${customFields.service_focus || 'exterior trim work'}.`,
      'schedule': `When would you like to schedule your project? ${customFields.preferred_date ? `I see you prefer ${customFields.preferred_date}.` : ''}`,
      'general': "How else can I assist you today?"
    };
    return prompts[branch] || prompts.general;
  },

  // New Feature 1: Context-aware conversation reset
  shouldResetConversation: function(conversation) {
    const timeSinceLastMessage = Date.now() - conversation.messages[conversation.messages.length - 1].timestamp;
    const hoursSinceLastMessage = timeSinceLastMessage / (1000 * 60 * 60);

    if (hoursSinceLastMessage > 24) {
      return true;
    }

    const recentMessages = conversation.messages.slice(-5);
    const uniqueIntents = new Set(recentMessages.map(m => m.intent)).size;

    return uniqueIntents >= 4; // Reset if the conversation has diverged significantly
  },

  // New Feature 2: Dynamic conversation summarization
  summarizeConversation: function(conversation) {
    const keyPoints = [];
    const intents = new Set();
    let dominantSentiment = 0;

    conversation.messages.forEach(message => {
      if (message.sender === 'user') {
        intents.add(message.intent);
        dominantSentiment += message.sentiment || 0;

        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(message.content.toLowerCase());

        if (tokens.includes('need') || tokens.includes('want')) {
          keyPoints.push(message.content);
        }
      }
    });

    dominantSentiment /= conversation.messages.length;

    return {
      keyPoints: keyPoints.slice(-3), // Last 3 key points
      uniqueIntents: Array.from(intents),
      dominantSentiment: dominantSentiment > 0 ? 'Positive' : dominantSentiment < 0 ? 'Negative' : 'Neutral',
      conversationLength: conversation.messages.length
    };
  }
};
