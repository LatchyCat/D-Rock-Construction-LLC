// File: config/routes.js

const express = require('express');
const router = express.Router();

const AuthController = require('../api/controllers/AuthController');
const JobRequestController = require('../api/controllers/JobRequestController');
const ReviewController = require('../api/controllers/ReviewController');
const UserController = require('../api/controllers/UserController');
const HomeController = require('../api/controllers/HomeController');
const isAuthenticated = require('../api/policies/isAuthenticated');
const chatbotController = require('../api/controllers/chatbotController');

// Home route
router.get('/', HomeController.getHomeData);

// Chatbot routes
router.post('/api/chatbot/message', chatbotController.handleMessage);
router.get('/api/chatbot/conversation/:id', chatbotController.getConversation);
router.post('/api/chatbot/proactive', chatbotController.proactiveEngagement);
router.post('/api/chatbot/faq', chatbotController.handleFAQ);

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

module.exports = router;
