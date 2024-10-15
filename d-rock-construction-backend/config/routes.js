const express = require('express');
const router = express.Router();
const apiRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// API routes
apiRouter.post('/chat/process-message', ChatbotController.processMessage);
apiRouter.post('/chat/handle-option', ChatbotController.handleOption);
apiRouter.post('/submit-form', ChatbotController.submitForm);
apiRouter.post('/submit-quote', ChatbotController.submitQuote);
apiRouter.post('/submit-callback', ChatbotController.submitCallback);
apiRouter.get('/chat/proactive-engagement', ChatbotController.getProactiveEngagement);
apiRouter.get('/chat/model-performance', ChatbotController.getModelPerformance);

// Auth routes
apiRouter.post('/auth/register', AuthController.register);
apiRouter.post('/auth/login', AuthController.login);
apiRouter.post('/auth/logout', AuthController.logout);
apiRouter.get('/auth/check', AuthController.check);

// JobRequest routes
apiRouter.post('/job-requests', isAuthenticated, JobRequestController.create);
apiRouter.get('/job-requests', JobRequestController.find);
apiRouter.get('/job-requests/:id', JobRequestController.findOne);
apiRouter.put('/job-requests/:id', isAuthenticated, JobRequestController.update);
apiRouter.delete('/job-requests/:id', isAuthenticated, JobRequestController.destroy);

// Multer configuration
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 1 // Allow only 1 file per request
  }
});

// Custom error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size is too large. Max size is 10MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Only 1 file is allowed.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Review routes with improved error handling
apiRouter.post('/reviews', upload.single('media'), handleMulterError, ReviewController.create);
apiRouter.get('/reviews', ReviewController.findAll);
apiRouter.get('/reviews/:id', ReviewController.findOne);
apiRouter.put('/reviews/:id', isAuthenticated, ReviewController.update);
apiRouter.delete('/reviews/:id', isAuthenticated, ReviewController.delete);

// User routes
apiRouter.get('/users', UserController.find);
apiRouter.get('/users/:id', UserController.findOne);
apiRouter.put('/users/:id', isAuthenticated, UserController.update);
apiRouter.delete('/users/:id', isAuthenticated, UserController.destroy);

// Use apiRouter with /api prefix
router.use('/api', apiRouter);

// Apply error handler to all routes
router.use(handleErrors);

module.exports = router;
