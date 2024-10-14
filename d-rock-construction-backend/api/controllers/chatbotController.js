const mongoose = require('mongoose');
const Chatbot = require('../models/chatbot');
const EmailService = require('../services/EmailService');

const ChatbotController = {
  processMessage: async function(req, res) {
    try {
      const { message, conversationId } = req.body;

      let conversation;
      if (conversationId) {
        conversation = await Chatbot.findById(conversationId);
        if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
      } else {
        conversation = new Chatbot({
          conversationType: 'unknown',
          messages: [],
          status: 'active'
        });
      }

      conversation.addMessage('user', message);

      const intent = ChatbotController.classifyIntent(message);
      const { botResponse, formFields } = ChatbotController.generateResponse(intent);
      conversation.addMessage('bot', botResponse);
      conversation.changeConversationType(intent);

      await conversation.save();

      res.json({
        response: botResponse,
        intent: intent,
        formFields: formFields,
        conversationId: conversation._id
      });
    } catch (error) {
      console.error('Error in processMessage:', error);
      res.status(500).json({ error: 'An error occurred while processing the message' });
    }
  },

  submitForm: async function(req, res) {
    try {
      const { conversationId, formData, type } = req.body;

      if (!process.env.CLIENT_EMAIL) {
        return res.status(500).json({ error: 'Client email is not configured' });
      }

      let conversation = await Chatbot.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      // Update conversation type based on the form type
      conversation.conversationType = type === 'quote_request' ? 'request_quote' : 'schedule_callback';

      conversation.updateInfo(formData);
      conversation.status = 'completed';
      await conversation.save();

      const { emailSubject, emailBody } = ChatbotController.prepareEmail(conversation, formData);

      try {
        await EmailService.sendEmail(process.env.CLIENT_EMAIL, emailSubject, emailBody);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      res.json({ message: 'Form submitted successfully. We will contact you soon.', conversationId: conversation._id });
    } catch (error) {
      console.error('Error in submitForm:', error);
      res.status(500).json({ error: 'An error occurred while submitting the form' });
    }
  },

  submitCallback: async function(req, res) {
    try {
      const { conversationId, formData } = req.body;

      if (!formData.preferredDate || !formData.preferredTime) {
        return res.status(400).json({ error: 'Missing required fields for callback request' });
      }

      let conversation;
      if (conversationId) {
        conversation = await Chatbot.findById(conversationId);
        if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
      } else {
        conversation = new Chatbot({
          conversationType: 'schedule_callback',
          messages: [],
          status: 'completed'
        });
      }

      conversation.changeConversationType('schedule_callback');
      conversation.updateCustomerInfo({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      conversation.updateCallbackInfo({
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime
      });
      conversation.status = 'completed';
      await conversation.save();

      const { emailSubject, emailBody } = ChatbotController.prepareEmail(conversation, formData);

      try {
        await EmailService.sendEmail(process.env.CLIENT_EMAIL, emailSubject, emailBody);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        return res.status(500).json({ error: 'An error occurred while sending the email notification' });
      }

      res.json({ message: 'Callback request submitted successfully. We will contact you soon.', conversationId: conversation._id });
    } catch (error) {
      console.error('Error in submitCallback:', error);
      res.status(500).json({ error: 'An error occurred while submitting the callback request' });
    }
  },

  submitQuote: async function(req, res) {
    try {
      const { conversationId, formData } = req.body;

      if (!formData.projectType || !formData.projectDescription) {
        return res.status(400).json({ error: 'Missing required fields for quote request' });
      }

      let conversation;
      if (conversationId) {
        conversation = await Chatbot.findById(conversationId);
        if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
      } else {
        conversation = new Chatbot({
          conversationType: 'request_quote',
          messages: [],
          status: 'completed'
        });
      }

      conversation.changeConversationType('request_quote');
      conversation.updateCustomerInfo({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      conversation.updateQuoteInfo({
        projectType: formData.projectType,
        projectDescription: formData.projectDescription,
        estimatedBudget: formData.estimatedBudget
      });
      conversation.status = 'completed';
      await conversation.save();

      const { emailSubject, emailBody } = ChatbotController.prepareEmail(conversation, formData);

      try {
        await EmailService.sendEmail(process.env.CLIENT_EMAIL, emailSubject, emailBody);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        return res.status(500).json({ error: 'An error occurred while sending the email notification' });
      }

      res.json({ message: 'Quote request submitted successfully. We will contact you soon.', conversationId: conversation._id });
    } catch (error) {
      console.error('Error in submitQuote:', error);
      res.status(500).json({ error: 'An error occurred while submitting the quote request' });
    }
  },



  // Helper methods
  classifyIntent: function(message) {
    const lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes('quote') || lowercaseMessage.includes('estimate')) {
      return 'request_quote';
    } else if (lowercaseMessage.includes('schedule') || lowercaseMessage.includes('call back')) {
      return 'schedule_callback';
    }
    return 'unknown';
  },


  generateResponse: function(intent) {
    switch (intent) {
      case 'request_quote':
        return {
          botResponse: "Great! I can help you request a quote. Please provide the following information:",
          formFields: ['name', 'email', 'phone', 'projectType', 'projectDescription', 'estimatedBudget']
        };
      case 'schedule_callback':
        return {
          botResponse: "Certainly! I'd be happy to help you schedule a callback. Please provide the following information:",
          formFields: ['name', 'phone', 'email', 'preferredDate', 'preferredTime']
        };
      default:
        return {
          botResponse: "Welcome! I'm here to help you request a quote or schedule a callback. Which would you like to do?",
          formFields: []
        };
    }
  },

  prepareEmail: function(conversation, formData) {
    if (conversation.conversationType === 'schedule_callback') {
      return {
        emailSubject: 'New Callback Request',
        emailBody: `A new customer has requested to schedule a call back:
          Name: ${conversation.customerInfo.name || 'N/A'}
          Phone: ${conversation.customerInfo.phone || 'N/A'}
          Email: ${conversation.customerInfo.email || 'N/A'}
          Preferred Date: ${conversation.callbackInfo.preferredDate || 'N/A'}
          Preferred Time: ${conversation.callbackInfo.preferredTime || 'N/A'}`
      };
    } else if (conversation.conversationType === 'request_quote') {
      return {
        emailSubject: 'New Quote Request',
        emailBody: `A new customer has requested a quote for a project:
          Name: ${conversation.customerInfo.name || 'N/A'}
          Email: ${conversation.customerInfo.email || 'N/A'}
          Phone: ${conversation.customerInfo.phone || 'N/A'}
          Project Type: ${conversation.quoteInfo.projectType || 'N/A'}
          Project Description: ${conversation.quoteInfo.projectDescription || 'N/A'}
          Estimated Budget: ${conversation.quoteInfo.estimatedBudget || 'N/A'}`
      };
    }
  },

  getProactiveEngagement: async function(req, res) {
    // Implementation for proactive engagement
    res.json({ message: 'Proactive engagement feature is under development' });
  },

  getModelPerformance: async function(req, res) {
    // Implementation for model performance
    res.json({ message: 'Model performance feature is under development' });
  }
};

module.exports = ChatbotController;
