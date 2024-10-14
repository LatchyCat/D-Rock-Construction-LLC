// // ChatbotController.js - Part 1
// const Chatbot = require('../models/chatbot');
// const tf = require('@tensorflow/tfjs-node');
// const natural = require('natural');
// const path = require('path');
// const fs = require('fs').promises;
// const axios = require('axios');
// const schedule = require('node-schedule');
// const { v4: uuidv4 } = require('uuid');

// // Import required services
// const EntityRecognitionService = require('../services/EntityRecognitionService');
// const ConversationFlowService = require('../services/ConversationFlowService');
// const ResponseGenerationService = require('../services/ResponseGenerationService');
// const EmailService = require('../services/EmailService');
// const AnalyticsService = require('../services/AnalyticsService');
// const FAQManagerService = require('../services/FAQManagerService');
// const IntentClassificationService = require('../services/IntentClassificationService');
// const SentimentAnalysisService = require('../services/SentimentAnalysisService');

// // Initialize NLP tools
// const tokenizer = new natural.WordTokenizer();
// const stemmer = natural.PorterStemmer;

// let model, metadata;

// // Load word embeddings for enhanced NLP capabilities
// async function loadWordEmbeddings(filePath) {
//   const fileContent = await fs.readFile(filePath, 'utf8');
//   const lines = fileContent.split('\n');
//   const embeddings = {};

//   for (const line of lines) {
//     const [word, ...vector] = line.trim().split(' ');
//     if (word && vector.length > 0) {
//       embeddings[word] = vector.map(Number);
//     }
//   }

//   return {
//     getVector: (word) => embeddings[word] || new Array(embeddings[Object.keys(embeddings)[0]].length).fill(0)
//   };
// }

// // Load TensorFlow model and metadata
// async function loadModelAndMetadata() {
//   const modelPath = path.join(__dirname, '..', '..', 'ml', 'saved_model', 'model.json');
//   const metadataPath = path.join(__dirname, '..', '..', 'ml', 'saved_model', 'metadata.json');

//   model = await tf.loadLayersModel(`file://${modelPath}`);
//   metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));

//   console.log('Model and metadata loaded successfully');
// }

// loadModelAndMetadata().catch(console.error);

// // Preprocess input for intent prediction
// function preprocessInput(input) {
//   const tokens = tokenizer.tokenize(input.toLowerCase());
//   const stemmed = tokens.map(token => stemmer.stem(token));
//   return stemmed.map(word => metadata.vocabulary[word] || 0);
// }

// // Predict intent using TensorFlow model
// async function predict(input) {
//   const processedInput = preprocessInput(input);
//   const maxLen = model.inputs[0].shape[1];
//   const paddedInput = tf.tensor2d([processedInput.concat(Array(maxLen - processedInput.length).fill(0))]);
//   const prediction = await model.predict(paddedInput).data();
//   const intent = metadata.intents[prediction.indexOf(Math.max(...prediction))];
//   return { intent, confidence: Math.max(...prediction) };
// }

// const ChatbotController = {
//   processMessage: async function(req, res) {
//     try {
//       const { message, conversationId } = req.body;

//       // Simple intent classification
//       let intent = 'unknown';
//       if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('call back')) {
//         intent = 'schedule_callback';
//       } else if (message.toLowerCase().includes('quote') || message.toLowerCase().includes('estimate')) {
//         intent = 'request_quote';
//       }

//       let botResponse;
//       switch (intent) {
//         case 'schedule_callback':
//           botResponse = "Certainly! I'd be happy to help you schedule a callback. Could you please provide your preferred date and time for the call?";
//           break;
//         case 'request_quote':
//           botResponse = "Of course! I can help you request a quote. Could you please provide some details about the project you need a quote for?";
//           break;
//         default:
//           botResponse = "I'm here to help you schedule a callback or request a quote. Could you please clarify which of these you'd like to do?";
//       }

//           // Perform intent classification and sentiment analysis
//           const intentClassification = await predict(message);
//           const sentiment = natural.SentimentAnalyzer.analyze(message);

//           // Extract entities (simplified version, you may want to use a more sophisticated NER)
//           const entities = new Map();
//           const words = tokenizer.tokenize(message);
//           words.forEach(word => {
//             if (word.length > 3 && word[0] === word[0].toUpperCase()) {
//               entities.set(word, 'ENTITY');
//             }
//           });

//        // Generate bot response (placeholder, replace with your actual response generation logic)
//       const botResponse = `I understood your message about ${intentClassification.intent}. How can I assist you further?`;

//        // Add user message to conversation
//        conversation.messages.push({
//         sender: 'user',
//         content: message,
//         sentiment: sentiment,
//         entities: entities,
//         intent: intentClassification.intent,
//         confidenceScore: intentClassification.confidence,
//         timestamp: new Date()
//       });

//       // Add bot response to conversation
//       conversation.messages.push({
//         sender: 'bot',
//         content: botResponse,
//         timestamp: new Date()
//       });


//       // Update conversation with new messages
//       await Chatbot.updateOne({ id: conversationId })
//       .set({
//         messages: [
//           ...conversation.messages,
//           {
//             role: 'user',
//             content: message,
//             intent: intentClassification.primaryIntent,
//             sentiment: sentimentAnalysis.score,
//             timestamp: new Date()
//           },
//           {
//             role: 'bot',
//             content: botResponse,
//             timestamp: new Date()
//           }
//         ],
//         lastMessageAt: new Date()
//       });

//       // Add bot response to conversation
//       await Chatbot.updateOne({ id: conversationId })
//         .set({
//           messages: [...conversation.messages, {
//             role: 'bot',
//             content: botResponse,
//             timestamp: new Date()
//           }]
//         });

//       // Update conversation attributes
//       conversation.overallSentiment = conversation.messages.reduce((sum, msg) => sum + (msg.sentiment || 0), 0) / conversation.messages.length;
//       conversation.dominantIntent = getMostFrequentIntent(conversation.messages);
//       conversation.lastInteraction = new Date();
//       conversation.status = determineConversationStatus(conversation);

//       await conversation.save();

//       res.json({
//         response: botResponse,
//         intent: intentClassification.intent,
//         intentConfidence: intentClassification.confidence,
//         sentiment: sentiment,
//         entities: Object.fromEntries(entities),
//         conversationId: conversation._id
//       });
//     } catch (error) {
//       console.error('Error in processMessage:', error);
//       res.status(500).json({ error: 'An error occurred while processing the message' });
//     }
//   },

//   //! ... (continued in Part 2)

//   //? ChatbotController.js - Part 2

//   //* ... (continued from Part 1)

//   // Retrieve detailed analytics about conversations
//   getDetailedAnalytics: async (req, res) => {
//     try {
//       const conversations = await Chatbot.find({});
//       const analytics = {
//         totalConversations: conversations.length,
//         averageConversationLength: AnalyticsService.getAverageConversationLength(conversations),
//         mostCommonIntent: AnalyticsService.getMostCommonIntent(conversations),
//         averageResponseTime: AnalyticsService.getAverageResponseTime(conversations),
//         conversionRate: AnalyticsService.getConversionRate(conversations),
//         popularTopics: AnalyticsService.identifyPopularTopics(conversations),
//         averageSentiment: AnalyticsService.getAverageSentiment(conversations),
//         commonEmotions: AnalyticsService.getCommonEmotions(conversations)
//       };

//       // Calculate average engagement score
//       const totalEngagementScore = conversations.reduce((sum, conv) => sum + AnalyticsService.calculateUserEngagementScore(conv), 0);
//       analytics.averageEngagementScore = totalEngagementScore / conversations.length;

//       res.json(analytics);
//     } catch (error) {
//       console.error('Error in getDetailedAnalytics:', error);
//       res.status(500).json({ error: 'Failed to retrieve detailed analytics' });
//     }
//   },

//   getProactiveEngagement: async function(req, res) {
//     try {
//       // Implement proactive engagement logic here
//       res.json({
//         shouldEngage: Math.random() > 0.7, // 30% chance of engagement
//         message: "Hello! How can I assist you today?",
//         engagementReason: "random"
//       });
//     } catch (error) {
//       console.error('Error in getProactiveEngagement:', error);
//       res.status(500).json({ error: 'An error occurred while getting proactive engagement' });
//     }
//   },

//   getModelPerformance: async function(req, res) {
//     try {
//       // Implement model performance retrieval logic here
//       res.json({
//         accuracy: 0.85,
//         f1Score: 0.82
//       });
//     } catch (error) {
//       console.error('Error in getModelPerformance:', error);
//       res.status(500).json({ error: 'An error occurred while fetching model performance' });
//     }
//   },

//   // Schedule a follow-up for a conversation
//   scheduleFollowUp: async (req, res) => {
//     try {
//       const { conversationId, scheduledTime } = req.body;

//       if (!conversationId || !scheduledTime) {
//         return res.status(400).json({ error: 'Missing required parameters' });
//       }

//       const scheduledDate = new Date(scheduledTime);
//       if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
//         return res.status(400).json({ error: 'Invalid or past scheduled time' });
//       }

//       const job = schedule.scheduleJob(scheduledDate, async function() {
//         try {
//           const conversation = await Chatbot.findById(conversationId);
//           if (!conversation || !conversation.customFields.email) {
//             console.error(`Conversation not found or no email for ID: ${conversationId}`);
//             return;
//           }

//           await EmailService.sendEmail(
//             conversation.customFields.email,
//             'Follow-up from D-Rock Construction',
//             'follow-up',
//             {
//               customerName: conversation.customFields.name || 'Valued Customer',
//               message: 'We hope you\'re doing well. We wanted to follow up on our previous conversation about your project. Is there anything else we can help you with?'
//             }
//           );
//           console.log(`Follow-up email sent for conversation ID: ${conversationId}`);
//         } catch (jobError) {
//           console.error('Error in scheduled job:', jobError);
//         }
//       });

//       res.json({ message: 'Follow-up scheduled successfully', jobId: job.name });
//     } catch (error) {
//       console.error('Error in scheduleFollowUp:', error);
//       res.status(500).json({ error: 'Failed to schedule follow-up', details: error.message });
//     }
//   },

//   // Handle FAQ queries
//   handleFAQ: async (req, res) => {
//     const faqs = {
//       "payment methods": "We accept all major credit cards, checks, and bank transfers. We also offer flexible payment plans for larger projects.",
//       "warranty": "We provide a 5-year warranty on all our exterior trim work, covering both materials and labor.",
//       "service area": "We primarily serve the Charleston County area, but we're open to discussing projects in neighboring counties as well.",
//       "timeline": "Project timelines vary based on scope, but we typically complete exterior trim work within 1-2 weeks from the start date."
//     };

//     const userQuestion = req.body.question.toLowerCase();
//     const bestMatch = Object.keys(faqs).find(key => userQuestion.includes(key));

//     if (bestMatch) {
//       res.json({
//         answer: faqs[bestMatch],
//         confidence: 0.9,
//         relatedQuestions: Object.keys(faqs).filter(key => key !== bestMatch)
//       });
//     } else {
//       res.json({
//         answer: "I'm sorry, I don't have a specific answer for that. Would you like me to connect you with one of our specialists?",
//         confidence: 0.2,
//         relatedQuestions: Object.keys(faqs)
//       });
//     }
//   },

//   // Retrieve a specific conversation
//   getConversation: async (req, res) => {
//     try {
//       const conversation = await Chatbot.findById(req.params.id);
//       if (!conversation) {
//         return res.status(404).json({ error: 'Conversation not found' });
//       }
//       res.json({
//         ...conversation.toObject(),
//         analysis: {
//           overallSentiment: conversation.overallSentiment,
//           dominantIntent: conversation.dominantIntent,
//           status: conversation.status
//         }
//       });
//     } catch (error) {
//       console.error('Error in getConversation:', error);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   }
// };

// // Helper function to get the most frequent intent from messages
// function getMostFrequentIntent(messages) {
//   const intents = messages.filter(m => m.sender === 'user').map(m => m.intent).filter(Boolean);
//   return intents.sort((a,b) =>
//     intents.filter(v => v === a).length
//     - intents.filter(v => v === b).length
//   ).pop();
// }

// // Helper function to determine the status of a conversation
// function determineConversationStatus(conversation) {
//   const lastMessage = conversation.messages[conversation.messages.length - 1];
//   if (lastMessage.sender === 'bot' && lastMessage.content.toLowerCase().includes('goodbye')) {
//     return 'completed';
//   } else if (Date.now() - conversation.lastInteraction > 24 * 60 * 60 * 1000) { // More than 24 hours old
//     return 'follow-up';
//   } else {
//     return 'active';
//   }
// }


// module.exports = ChatbotController;
