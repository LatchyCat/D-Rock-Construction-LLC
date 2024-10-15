const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  mediaUrl: { type: String },
  mediaType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
