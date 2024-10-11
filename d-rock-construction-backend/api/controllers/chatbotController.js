const Chatbot = require('../models/chatbot');
const natural = require('natural');

const BOT_NAME = "D-Rock Bot";

// Implement sentiment analysis
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

// Enhanced response generation with more personalization and dynamic content
const generateResponse = (stage, userInput, customFields, sentiment) => {
  const baseResponses = {
    greeting: `Hey ${customFields.name || 'there'}, I'm ${BOT_NAME} from D-Rock Construction LLC. We're experts in custom exterior trim. How can I brighten your day with our services?`,
    services: "We offer top-notch exterior trim solutions tailored just for you. Interested in our free quotes or want to hear about our latest projects?",
    qualifying: "I'd love to hear more about your vision! Is this for a new build, a renovation, or perhaps a unique project you have in mind?",
    collect_info: "Fantastic! To provide you with the best service, could I get your name, email, and best contact number? This helps us tailor our follow-up perfectly for you.",
    next_steps: "Great! Let's find the perfect time for your free estimate. Would you prefer a morning appointment, afternoon, or early evening? We're flexible!",
    wrap_up: `Thank you for choosing D-Rock Construction, ${customFields.name || 'valued customer'}! We're excited to bring your vision to life. Expect to hear from us very soon!`,
    support_greeting: `Welcome back, ${customFields.name || 'valued customer'}! This is ${BOT_NAME} from D-Rock Construction LLC. How can I make your day better regarding your project?`,
    project_status: "I'd be happy to check on that for you! Could you provide your project name or reference number? I'll fetch the latest updates right away.",
    pricing_inquiry: "Pricing can vary based on the unique aspects of each project. To ensure you get the most accurate quote, may I confirm your contact details for a specialist to reach out?",
    follow_up: "We want to keep you in the loop in the way that suits you best. Would you prefer updates via email, phone call, or perhaps text message?",
    support_wrap_up: "It's been a pleasure assisting you today! D-Rock Construction values your business, and we'll be in touch very soon with the information you need.",
    unknown: "I apologize, I didn't quite catch that. Could you please rephrase? I'm here to help with anything related to our exterior trim services or your ongoing projects."
  };

  // Add some variety based on sentiment
  if (sentiment > 0) {
    return `${baseResponses[stage]} I'm glad we're having such a positive conversation!`;
  } else if (sentiment < 0) {
    return `${baseResponses[stage]} I hope I can turn your experience around and make it a great one.`;
  } else {
    return baseResponses[stage];
  }
};

// Enhanced stage determination with NLP and intent recognition
const determineNextStage = (currentStage, userInput, customFields) => {
  const lowerInput = userInput.toLowerCase();
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(lowerInput);

  const intents = {
    quote: ['quote', 'price', 'cost', 'estimate'],
    service: ['service', 'offer', 'provide', 'work'],
    project: ['project', 'job', 'task', 'build', 'renovate'],
    contact: ['contact', 'call', 'email', 'phone'],
    schedule: ['schedule', 'appointment', 'meet', 'visit']
  };

  const matchIntent = (tokens, intents) => {
    return Object.keys(intents).find(intent =>
      intents[intent].some(keyword => tokens.includes(keyword))
    );
  };

  const intent = matchIntent(tokens, intents);

  switch (currentStage) {
    case 'greeting':
      if (intent === 'quote' || intent === 'service') return 'services';
      if (intent === 'project') return 'qualifying';
      return 'services';
    case 'services':
      if (intent === 'quote') return 'collect_info';
      return 'qualifying';
    case 'qualifying':
      if (intent === 'contact' || tokens.includes('yes')) return 'collect_info';
      return 'services';
    case 'collect_info':
      if (customFields.name && customFields.contact) return 'next_steps';
      return 'collect_info';
    case 'next_steps':
      if (intent === 'schedule' || tokens.includes('yes')) return 'wrap_up';
      return 'next_steps';
    case 'support_greeting':
      if (intent === 'project') return 'project_status';
      if (intent === 'quote') return 'pricing_inquiry';
      return 'follow_up';
    case 'project_status':
    case 'pricing_inquiry':
      return 'follow_up';
    case 'follow_up':
      return 'support_wrap_up';
    default:
      return 'unknown';
  }
};

exports.handleMessage = async (req, res) => {
  try {
    const { conversationType, message, customFields } = req.body;

    let conversation = await Chatbot.findOne({ _id: req.body.conversationId });

    if (!conversation) {
      conversation = new Chatbot({
        conversationType,
        messages: [],
        customFields: {}
      });
    }


    // Perform sentiment analysis
    const sentiment = analyzer.getSentiment(message.split(' '));

    conversation.messages.push({
      sender: 'user',
      content: message,
      sentiment: sentiment
    });

    if (customFields) {
      Object.assign(conversation.customFields, customFields);
    }

    const currentStage = conversation.messages.length <= 1
      ? (conversationType === 'prospecting' ? 'greeting' : 'support_greeting')
      : conversation.messages[conversation.messages.length - 2].stage;

    const nextStage = determineNextStage(currentStage, message, conversation.customFields);

    const botResponse = await generateResponse(nextStage, message, conversation.customFields, sentiment);

    conversation.messages.push({
      sender: 'bot',
      content: botResponse,
      stage: nextStage
    });

    await conversation.save();

    // Simulate typing delay based on response length
    const typingDelay = Math.min(botResponse.length * 30, 3000);

    setTimeout(() => {
      res.json({
        message: botResponse,
        conversationId: conversation._id,
        stage: nextStage,
        sentiment: sentiment
      });
    }, typingDelay);

  } catch (error) {
    console.error("Error in handleMessage:", error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
};

// New feature: Proactive engagement based on user behavior
exports.proactiveEngagement = async (req, res) => {
  try {
    const { userId, pageVisited, timeSpent } = req.body;

    if (timeSpent > 30 && !req.session.proactiveEngagement) {
      const engagementMessage = "I noticed you've been browsing our services. Can I help you find anything specific or answer any questions about our exterior trim work?";
      req.session.proactiveEngagement = true;
      res.json({ message: engagementMessage });
    } else {
      res.json({ message: null });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during proactive engagement' });
  }
};

// New feature: FAQ handling
exports.handleFAQ = async (req, res) => {
  const faqs = {
    "payment methods": "We accept all major credit cards, checks, and bank transfers. We also offer flexible payment plans for larger projects.",
    "warranty": "We provide a 5-year warranty on all our exterior trim work, covering both materials and labor.",
    "service area": "We primarily serve the Charleston County area, but we're open to discussing projects in neighboring counties as well.",
    "timeline": "Project timelines vary based on scope, but we typically complete exterior trim work within 1-2 weeks from the start date."
  };

  const userQuestion = req.body.question.toLowerCase();
  const bestMatch = Object.keys(faqs).find(key => userQuestion.includes(key));

  if (bestMatch) {
    res.json({ answer: faqs[bestMatch] });
  } else {
    res.json({ answer: "I'm sorry, I don't have a specific answer for that. Would you like me to connect you with one of our specialists?" });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await Chatbot.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};
