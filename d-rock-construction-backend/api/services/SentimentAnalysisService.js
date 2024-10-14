const natural = require('natural');
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// Add a simple emotion classifier
const emotionClassifier = {
  classify: (score) => {
    if (score <= -0.75) return 'Very Negative';
    if (score <= -0.25) return 'Negative';
    if (score <= 0.25) return 'Neutral';
    if (score <= 0.75) return 'Positive';
    return 'Very Positive';
  }
};

// Add a list of common emotional keywords
const emotionalKeywords = {
  positive: ['happy', 'excited', 'glad', 'satisfied', 'pleased', 'delighted'],
  negative: ['angry', 'sad', 'upset', 'frustrated', 'disappointed', 'annoyed']
};

module.exports = {
  analyzeSentiment: async function(message) {
    try {
      const words = await this.tokenizeMessage(message);
      const score = sentiment.getSentiment(words);
      const emotion = emotionClassifier.classify(score);
      const emotionalWords = this.findEmotionalWords(words);

      // Calculate confidence based on message length and presence of emotional words
      const confidence = this.calculateConfidence(words.length, emotionalWords.length);

      return {
        score,
        emotion,
        emotionalWords,
        confidence,
        analysis: this.provideSentimentAnalysis(score, emotion, emotionalWords)
      };
    } catch (error) {
      console.error('Error in analyzeSentiment:', error);
      return {
        score: 0,
        emotion: 'Neutral',
        emotionalWords: [],
        confidence: 0,
        analysis: 'Unable to perform sentiment analysis due to an error.'
      };
    }
  },

  tokenizeMessage: function(message) {
    return new Promise((resolve, reject) => {
      new natural.WordTokenizer().tokenize(message, (err, words) => {
        if (err) {
          console.error('Error in tokenization:', err);
          reject(err);
        } else {
          resolve(words);
        }
      });
    });
  },

  findEmotionalWords: function(words) {
    const lowercaseWords = words.map(word => word.toLowerCase());
    return [
      ...emotionalKeywords.positive.filter(word => lowercaseWords.includes(word)),
      ...emotionalKeywords.negative.filter(word => lowercaseWords.includes(word))
    ];
  },

  calculateConfidence: function(totalWords, emotionalWords) {
    // Simple confidence calculation
    const lengthFactor = Math.min(totalWords / 10, 1); // Max out at 10 words
    const emotionFactor = emotionalWords / totalWords;
    return (lengthFactor + emotionFactor) / 2;
  },

  provideSentimentAnalysis: function(score, emotion, emotionalWords) {
    let analysis = `The overall sentiment is ${emotion} with a score of ${score.toFixed(2)}. `;

    if (emotionalWords.length > 0) {
      analysis += `Emotional words detected: ${emotionalWords.join(', ')}. `;
    }

    analysis += 'This suggests that ';

    if (score > 0.5) {
      analysis += 'the message is very positive. The user seems quite satisfied or happy.';
    } else if (score > 0) {
      analysis += 'the message is somewhat positive. The user seems generally content.';
    } else if (score === 0) {
      analysis += 'the message is neutral. The user doesn\'t express strong emotions.';
    } else if (score > -0.5) {
      analysis += 'the message is somewhat negative. The user might be slightly dissatisfied.';
    } else {
      analysis += 'the message is very negative. The user seems upset or frustrated.';
    }

    return analysis;
  }
};
