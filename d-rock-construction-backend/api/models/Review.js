// api/models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // You might want to add a reference to the job or service being reviewed
  jobRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest'
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
