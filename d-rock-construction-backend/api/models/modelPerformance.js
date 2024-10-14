const mongoose = require('mongoose');

const modelPerformanceSchema = new mongoose.Schema({
  accuracy: Number,
  f1Score: Number,
  lastUpdated: { type: Date, default: Date.now }
});

const ModelPerformance = mongoose.model('ModelPerformance', modelPerformanceSchema);

module.exports = ModelPerformance;
