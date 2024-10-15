const Review = require('../models/Review');
const fs = require('fs-extra');
const { promisify } = require('util');
const ffprobe = promisify(require('ffprobe'));
const ffprobeStatic = require('ffprobe-static');

const ReviewController = {
  async create(req, res) {
    try {
      const { title, description, category } = req.body;
      let mediaUrl = null;
      let mediaType = null;

      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';

        if (mediaType === 'video') {
          const videoInfo = await ffprobe(req.file.path, { path: ffprobeStatic.path });
          const duration = videoInfo.streams[0].duration;

          if (duration > 20) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Videos cannot be longer than 20 seconds' });
          }
        }
      }

      const review = new Review({
        title,
        description,
        category,
        user: req.user ? req.user._id : null,
        mediaUrl,
        mediaType
      });

      await review.save();
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async findAll(req, res) {
    try {
      console.log('Fetching all reviews');
      const reviews = await Review.find().populate('user', 'username');
      console.log(`Found ${reviews.length} reviews`);
      res.json(reviews);
    } catch (error) {
      console.error('Error in findAll:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const review = await Review.findById(req.params.id).populate('user', 'username');
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { title, description, category } = req.body;
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only update your own reviews' });
      }
      review.title = title;
      review.description = description;
      review.category = category;
      await review.save();
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only delete your own reviews' });
      }
      await review.remove();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = ReviewController;
