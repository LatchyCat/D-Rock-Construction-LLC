const natural = require('natural');
const classifier = new natural.BayesClassifier();

// Load intents and train classifier
const intentsData = require('../../ml/intents.json');
intentsData.intents.forEach(intent => {
  intent.patterns.forEach(pattern => {
    classifier.addDocument(pattern, intent.tag);
  });
});
classifier.train();

// New Feature 1: Threshold for confidence
const CONFIDENCE_THRESHOLD = 0.6;

// New Feature 2: Multi-intent detection
const MAX_INTENTS = 3;

module.exports = {
  async classifyIntent(message) {
    try {
      const classifications = await new Promise((resolve) => {
        classifier.getClassifications(message, (err, classifications) => {
          if (err) {
            console.error('Error in getClassifications:', err);
            resolve([]);
          } else {
            resolve(classifications);
          }
        });
      });

      // Filter classifications based on confidence threshold
      const confidentClassifications = classifications.filter(c => c.value > CONFIDENCE_THRESHOLD);

      if (confidentClassifications.length === 0) {
        return {
          primaryIntent: 'unknown',
          confidence: 0,
          allIntents: []
        };
      }

      // Sort by confidence (highest first)
      confidentClassifications.sort((a, b) => b.value - a.value);

      return {
        primaryIntent: confidentClassifications[0].label,
        confidence: confidentClassifications[0].value,
        allIntents: confidentClassifications.slice(0, MAX_INTENTS).map(c => ({
          intent: c.label,
          confidence: c.value
        }))
      };
    } catch (error) {
      console.error('Error in classifyIntent:', error);
      return {
        primaryIntent: 'error',
        confidence: 0,
        allIntents: []
      };
    }
  },

  // New method to handle edge cases and improve robustness
  async enhancedClassifyIntent(message) {
    try {
      const result = await this.classifyIntent(message);

      // Handle edge cases
      if (result.primaryIntent === 'unknown') {
        // Attempt to extract key phrases or entities
        const keyPhrases = this.extractKeyPhrases(message);
        if (keyPhrases.length > 0) {
          // Use key phrases to make a best guess at intent
          const guessedIntent = this.guessIntentFromKeyPhrases(keyPhrases);
          result.primaryIntent = guessedIntent.intent;
          result.confidence = guessedIntent.confidence;
        }
      }

      return result;
    } catch (error) {
      console.error('Error in enhancedClassifyIntent:', error);
      return {
        primaryIntent: 'error',
        confidence: 0,
        allIntents: []
      };
    }
  },

  extractKeyPhrases(message) {
    try {
      // Simple key phrase extraction (you can make this more sophisticated)
      const words = new natural.WordTokenizer().tokenize(message);
      return words.filter(word => word.length > 3);  // Consider words longer than 3 characters as key phrases
    } catch (error) {
      console.error('Error in extractKeyPhrases:', error);
      return [];
    }
  },

  guessIntentFromKeyPhrases(keyPhrases) {
    try {
      // Simple guessing logic (you can improve this based on your specific use case)
      const intentScores = {};
      intentsData.intents.forEach(intent => {
        intentScores[intent.tag] = 0;
        keyPhrases.forEach(phrase => {
          if (intent.patterns.some(pattern => pattern.toLowerCase().includes(phrase.toLowerCase()))) {
            intentScores[intent.tag]++;
          }
        });
      });

      const bestGuess = Object.entries(intentScores).reduce((max, [intent, score]) =>
        score > max[1] ? [intent, score] : max, ['unknown', 0]);

      return {
        intent: bestGuess[0],
        confidence: bestGuess[1] / keyPhrases.length  // Normalize confidence
      };
    } catch (error) {
      console.error('Error in guessIntentFromKeyPhrases:', error);
      return {
        intent: 'unknown',
        confidence: 0
      };
    }
  }
};
