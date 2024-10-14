const express = require('express');
const router = express.Router();

const AuthController = require('../api/controllers/AuthController');
const JobRequestController = require('../api/controllers/JobRequestController');
const ReviewController = require('../api/controllers/ReviewController');
const UserController = require('../api/controllers/UserController');
const HomeController = require('../api/controllers/HomeController');
const ChatbotController = require('../api/controllers/chatbotController');
const isAuthenticated = require('../api/policies/isAuthenticated');

// Error handler middleware
const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: 'An error occurred', details: err.message });
  }
};

// Home route
router.get('/', HomeController.getHomeData);

// Chatbot routes
router.post('/api/chat', ChatbotController.processMessage);
router.post('/api/submit-form', ChatbotController.submitForm);

router.post('/api/submit-quote', ChatbotController.submitQuote);
router.post('/api/submit-callback', ChatbotController.submitCallback);

// Add these routes if you need this functionality
router.get('/api/chat/proactive-engagement', ChatbotController.getProactiveEngagement);
router.get('/api/chat/model-performance', ChatbotController.getModelPerformance);


// Auth routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/check', AuthController.check);

// JobRequest routes
router.post('/job-requests', isAuthenticated, JobRequestController.create);
router.get('/job-requests', JobRequestController.find);
router.get('/job-requests/:id', JobRequestController.findOne);
router.put('/job-requests/:id', isAuthenticated, JobRequestController.update);
router.delete('/job-requests/:id', isAuthenticated, JobRequestController.destroy);

// Review routes
router.post('/reviews', isAuthenticated, ReviewController.create);
router.get('/reviews', ReviewController.find);
router.get('/reviews/:id', ReviewController.findOne);
router.put('/reviews/:id', isAuthenticated, ReviewController.update);
router.delete('/reviews/:id', isAuthenticated, ReviewController.destroy);

// User routes
router.get('/users', UserController.find);
router.get('/users/:id', UserController.findOne);
router.put('/users/:id', isAuthenticated, UserController.update);
router.delete('/users/:id', isAuthenticated, UserController.destroy);

// Apply error handler to all routes
router.use(handleErrors);

module.exports = router;
