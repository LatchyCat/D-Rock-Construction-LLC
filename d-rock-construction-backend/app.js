// app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnect } = require('./config/mongoose.config');
const createCoolDesign = require('./emojis/emojisFunc');
const routes = require('./config/routes');

console.log('Environment variables loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');
console.log('Current working directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/', routes);

// Start server
async function startServer() {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is successfully launched and operational on port: ${PORT}\n`);
      createCoolDesign();
      createCoolDesign();
      createCoolDesign();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
