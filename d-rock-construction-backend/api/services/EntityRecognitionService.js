// api/services/EntityRecognitionService.js
const natural = require('natural');
const moment = require('moment');

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

module.exports = {
  recognizeEntities: function(message) {
    const entities = [];
    const tokens = tokenizer.tokenize(message.toLowerCase());
    const stemmedTokens = tokens.map(token => stemmer.stem(token));

    // Date recognition
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // MM/DD/YYYY
      /\b\d{1,2}-\d{1,2}-\d{4}\b/, // MM-DD-YYYY
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}\b/i // Month Day, Year
    ];

    datePatterns.forEach(pattern => {
      const match = message.match(pattern);
      if (match) {
        entities.push({ type: 'DATE', value: moment(match[0], ['MM/DD/YYYY', 'MM-DD-YYYY', 'MMMM Do, YYYY']).format('YYYY-MM-DD') });
      }
    });

    // Phone number recognition
    const phonePattern = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
    const phoneMatch = message.match(phonePattern);
    if (phoneMatch) {
      entities.push({ type: 'PHONE', value: phoneMatch[0] });
    }

    // Email recognition
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = message.match(emailPattern);
    if (emailMatch) {
      entities.push({ type: 'EMAIL', value: emailMatch[0] });
    }

    // Service type recognition
    const services = ['exterior trim', 'siding', 'roofing', 'windows', 'doors'];
    services.forEach(service => {
      if (tokens.includes(service) || stemmedTokens.includes(stemmer.stem(service))) {
        entities.push({ type: 'SERVICE', value: service });
      }
    });

    return entities;
  },

  // New Feature 1: Custom Entity Recognition
  recognizeCustomEntities: function(message, customEntities) {
    const recognizedEntities = this.recognizeEntities(message);
    const tokens = tokenizer.tokenize(message.toLowerCase());
    const stemmedTokens = tokens.map(token => stemmer.stem(token));

    customEntities.forEach(entity => {
      const entityTokens = tokenizer.tokenize(entity.value.toLowerCase());
      const entityStemmed = entityTokens.map(token => stemmer.stem(token));

      if (entityStemmed.every(token => stemmedTokens.includes(token))) {
        recognizedEntities.push({ type: entity.type, value: entity.value });
      }
    });

    return recognizedEntities;
  },

  // New Feature 2: Sentiment Analysis
  analyzeSentiment: function(message) {
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokens = tokenizer.tokenize(message);
    const sentiment = analyzer.getSentiment(tokens);

    let sentimentCategory;
    if (sentiment > 0.2) sentimentCategory = 'POSITIVE';
    else if (sentiment < -0.2) sentimentCategory = 'NEGATIVE';
    else sentimentCategory = 'NEUTRAL';

    return {
      score: sentiment,
      category: sentimentCategory
    };
  }
};
