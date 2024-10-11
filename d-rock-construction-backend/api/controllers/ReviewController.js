// api/controllers/ReviewController.js

const Review = require('../models/Review');

module.exports = {
  create: async (req, res) => {
    try {
      const newReview = await Review.create(req.body);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  find: async (req, res) => {
    try {
      const reviews = await Review.find().populate('user').populate('jobRequest');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findOne: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id).populate('user').populate('jobRequest');
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json(updatedReview);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const deletedReview = await Review.findByIdAndDelete(req.params.id);
      if (!deletedReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
