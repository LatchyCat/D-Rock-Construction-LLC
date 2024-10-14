// api/services/ResponseGenerationService.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const path = require('path');
const intentsData = require(path.join(__dirname, '../../ml/intents.json'));


const intentResponses = Object.fromEntries(
  intentsData.intents.map(intent => [intent.tag, intent.responses])
);

module.exports = {
  generateResponse(intent, message, customFields, sentiment) {
    const responses = this.getBaseResponses(intent);
    let response = this.selectResponse(responses, intent, sentiment);

    response = this.personalizeResponse(response, customFields);
    response = this.addContextBasedInfo(response, intent, message);

    return response;
  },

  getBaseResponses(intent) {
    return intentResponses[intent] || ["I'm not sure I understand. Could you please rephrase your question?"];
  },

  getBaseResponses: function(intent) {
    return intentResponses[intent] || ["I'm here to help. What would you like to know?"];
  },


  selectResponse: function(responses, intent, sentiment) {
    // Select response based on intent and sentiment
    if (sentiment < -0.5 && intent === 'complaint') {
      return "I'm sorry to hear you're having issues. Let me connect you with our customer service team right away.";
    } else if (sentiment > 0.5) {
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      return responses[0];
    }
  },

  personalizeResponse: function(response, customFields) {
    if (customFields.name) {
      response = response.replace("Hello!", `Hello ${customFields.name}!`);
    }
    if (customFields.projectType) {
      response = response.replace("construction project", customFields.projectType);
    }
    return response;
  },

 addContextBasedInfo: function(response, intent, message) {
  const tokens = tokenizer.tokenize(message.toLowerCase());

  if (intent === 'inquiry') {
    if (tokens.includes('price') || tokens.includes('cost')) {
      response += " Our pricing varies depending on the scope of the project. Would you like a rough estimate?";
    } else if (tokens.includes('time') || tokens.includes('duration')) {
      response += " The timeline for our projects typically ranges from 1-3 weeks, depending on the complexity.";
    }
  } else if (intent === 'quote_request') {
    response += " To provide an accurate quote, we'll need some details about your property. Is it a residential or commercial project?";
  }

  return response;
},

  // New Feature 1: Multi-intent Response
  handleMultipleIntents: function(intents) {
    let response = "I understand you have multiple questions. Let me address them one by one:\n";
    intents.forEach((intent, index) => {
      response += `\n${index + 1}. `;
      switch(intent) {
        case 'quote_request':
          response += "Regarding pricing, we offer competitive rates based on the project scope.";
          break;
        case 'schedule_appointment':
          response += "Our typical project timeline is 1-3 weeks, depending on complexity.";
          break;
        case 'inquiry':
          response += "We specialize in exterior trim, including siding, fascia, and soffit installation.";
          break;
        default:
          response += "For this question, I'd need more information to provide an accurate answer.";
      }
    });
    return response + "\n\nIs there anything else you'd like to know?";
  },

  // New Feature 2: Response with Related FAQ
  addRelatedFAQ: function(response, intent) {
    const faqs = {
      'quote_request': "FAQ: Do you offer any discounts or promotions?",
      'schedule_appointment': "FAQ: What factors can affect the project timeline?",
      'inquiry': "FAQ: Do you provide warranties for your work?",
    };

    if (faqs[intent]) {
      response += `\n\nYou might also be interested in this ${faqs[intent]}`;
    }

    return response;
  }
};
