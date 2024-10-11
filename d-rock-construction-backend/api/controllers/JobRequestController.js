// api/controllers/JobRequestController.js

const JobRequest = require('../models/JobRequest');

module.exports = {
  create: async (req, res) => {
    try {
      const newJobRequest = await JobRequest.create(req.body);
      res.status(201).json(newJobRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  find: async (req, res) => {
    try {
      const jobRequests = await JobRequest.find();
      res.json(jobRequests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findOne: async (req, res) => {
    try {
      const jobRequest = await JobRequest.findById(req.params.id);
      if (!jobRequest) {
        return res.status(404).json({ message: 'Job request not found' });
      }
      res.json(jobRequest);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedJobRequest = await JobRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedJobRequest) {
        return res.status(404).json({ message: 'Job request not found' });
      }
      res.json(updatedJobRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const deletedJobRequest = await JobRequest.findByIdAndDelete(req.params.id);
      if (!deletedJobRequest) {
        return res.status(404).json({ message: 'Job request not found' });
      }
      res.json({ message: 'Job request deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
