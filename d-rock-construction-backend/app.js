require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { dbConnect } = require('./config/mongoose.config');
const createCoolDesign = require('./emojis/emojisFunc');
const routes = require('./config/routes');

console.log('Environment variables loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');
console.log('Current working directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 8000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://d-rock-construction-llc.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start server
async function startServer() {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is successfully launched and operational on port: ${PORT}\n`);
      try {
        createCoolDesign();
        createCoolDesign();
        createCoolDesign();
      } catch (error) {
        console.error('Error in createCoolDesign:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
