// api/models/faq.js
module.exports = {
    attributes: {
      question: { type: 'string', required: true },
      answer: { type: 'string', required: true },
      category: { type: 'string', defaultsTo: 'General' },
      keywords: { type: 'json', defaultsTo: [] }
    }
  };
