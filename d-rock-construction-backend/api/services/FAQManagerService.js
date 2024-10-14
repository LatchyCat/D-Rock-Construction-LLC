// api/services/FAQManagerService.js
const FAQ = require('../models/faq'); // Assuming you have a FAQ model
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

module.exports = {
  updateFAQDatabase: async function(question, answer, category = 'General') {
    try {
      // Check if a similar question already exists
      const similarFAQ = await this.findSimilarQuestion(question);
      if (similarFAQ) {
        // Update existing FAQ
        similarFAQ.answer = answer;
        similarFAQ.category = category;
        await similarFAQ.save();
        console.log(`Updated existing FAQ: Q: ${similarFAQ.question}`);
        return similarFAQ;
      } else {
        // Create new FAQ
        const newFAQ = await FAQ.create({
          question,
          answer,
          category,
          keywords: this.extractKeywords(question)
        }).fetch();
        console.log(`Created new FAQ: Q: ${question}`);
        return newFAQ;
      }
    } catch (error) {
      console.error('Error updating FAQ database:', error);
      throw error;
    }
  },

  updateChatbotKnowledge: async function(question, answer) {
    try {
      // This is a placeholder for updating the chatbot's knowledge base
      // In a real-world scenario, this might involve:
      // 1. Updating a vector database
      // 2. Retraining or fine-tuning the NLP model
      // 3. Updating a knowledge graph

      console.log(`Updating chatbot knowledge with new FAQ: Q: ${question}`);

      // Simulate updating a vector database
      const vector = this.questionToVector(question);
      console.log('Updated vector database with:', vector);

      // Simulate updating a knowledge graph
      const keywords = this.extractKeywords(question);
      console.log('Updated knowledge graph with keywords:', keywords);

      // In a real implementation, you might call an API to update your NLP model
      // await this.updateNLPModel(question, answer);

      return true;
    } catch (error) {
      console.error('Error updating chatbot knowledge:', error);
      throw error;
    }
  },

  findSimilarQuestion: async function(question) {
    const allFAQs = await FAQ.find();
    const tfidf = new TfIdf();

    allFAQs.forEach((faq, index) => {
      tfidf.addDocument(faq.question);
    });

    const questionTokens = tokenizer.tokenize(question);
    const similarities = tfidf.tfidf(questionTokens, 0);

    let maxSimilarity = 0;
    let mostSimilarFAQ = null;

    allFAQs.forEach((faq, index) => {
      if (similarities[index] > maxSimilarity) {
        maxSimilarity = similarities[index];
        mostSimilarFAQ = faq;
      }
    });

    // You can adjust this threshold as needed
    return maxSimilarity > 0.5 ? mostSimilarFAQ : null;
  },

  extractKeywords: function(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const stopwords = natural.stopwords;
    return tokens.filter(token => !stopwords.includes(token));
  },

  questionToVector: function(question) {
    // This is a placeholder for converting a question to a vector
    // In a real implementation, you might use word embeddings or a more sophisticated method
    return this.extractKeywords(question).map(keyword => keyword.length);
  },

  // New Feature 1: FAQ Search
  searchFAQ: async function(query) {
    const allFAQs = await FAQ.find();
    const tfidf = new TfIdf();

    allFAQs.forEach((faq, index) => {
      tfidf.addDocument(faq.question);
    });

    const queryTokens = tokenizer.tokenize(query);
    const results = allFAQs.map((faq, index) => ({
      faq,
      relevance: tfidf.tfidf(queryTokens, index)
    }));

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  },

  // New Feature 2: FAQ Categories Management
  getFAQCategories: async function() {
    const categories = await FAQ.distinct('category');
    return categories;
  },

  getFAQsByCategory: async function(category) {
    return await FAQ.find({ category });
  }
};
