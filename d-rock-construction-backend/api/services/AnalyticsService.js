// api/services/AnalyticsService.js
const moment = require('moment');

module.exports = {
  getMostCommonIntent: function(conversations) {
    const intents = conversations.flatMap(conv => conv.messages.map(m => m.intent).filter(Boolean));
    const intentCounts = intents.reduce((acc, intent) => {
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0][0];
  },

  getAverageConversationLength: function(conversations) {
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    return totalMessages / conversations.length;
  },

  getAverageResponseTime: function(conversations) {
    let totalResponseTime = 0;
    let responseCount = 0;

    conversations.forEach(conv => {
      for (let i = 1; i < conv.messages.length; i += 2) {
        const userMessageTime = moment(conv.messages[i-1].timestamp);
        const botMessageTime = moment(conv.messages[i].timestamp);
        totalResponseTime += botMessageTime.diff(userMessageTime, 'seconds');
        responseCount++;
      }
    });

    return responseCount > 0 ? totalResponseTime / responseCount : 0;
  },

  getConversionRate: function(conversations) {
    const completedConversations = conversations.filter(conv => conv.status === 'completed');
    return (completedConversations.length / conversations.length) * 100;
  },

  // New Feature 1: User Engagement Score
  calculateUserEngagementScore: function(conversation) {
    const messageCount = conversation.messages.length;
    const uniqueIntents = new Set(conversation.messages.map(m => m.intent)).size;
    const averageSentiment = conversation.messages.reduce((sum, m) => sum + (m.sentiment || 0), 0) / messageCount;

    // Score is based on message count, intent variety, and sentiment
    const score = (messageCount * 0.4) + (uniqueIntents * 0.4) + (averageSentiment * 20);
    return Math.min(score, 100); // Cap the score at 100
  },

  // New Feature 2: Topic Clustering
  identifyPopularTopics: function(conversations, topN = 5) {
    const allMessages = conversations.flatMap(conv => conv.messages.map(m => m.content));

    // Simple word frequency analysis (you might want to use a more sophisticated NLP approach)
    const wordFrequency = allMessages.flatMap(message => message.toLowerCase().split(/\W+/))
      .reduce((acc, word) => {
        if (word.length > 3) { // Ignore short words
          acc[word] = (acc[word] || 0) + 1;
        }
        return acc;
      }, {});

    // Sort by frequency and get top N
    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word, frequency]) => ({ word, frequency }));
  }
};
