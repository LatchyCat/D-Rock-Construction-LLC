const mongoose = require('mongoose');
const createCoolDesign = require('../emojis/emojisFunc');

module.exports.bootstrap = async function(done) {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  async function dbConnect(retries = MAX_RETRIES) {
    try {
      await mongoose.connect(sails.config.datastores.default.url, {
        dbName: 'drockconstructionDB'
      });

      console.log("Successfully connected to MongoDB!\n");
      console.log(`Port: ${sails.config.port} / Dev Mode Activated\n`);
      createCoolDesign(); createCoolDesign(); createCoolDesign();

      done();
    } catch (error) {
      console.error(`Error connecting to MongoDB (attempt ${MAX_RETRIES - retries + 1} of ${MAX_RETRIES}): `, error.message);

      if (retries > 0) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        setTimeout(() => dbConnect(retries - 1), RETRY_DELAY);
      } else {
        console.error("Maximum retries reached. Could not connect to MongoDB.");
        done(new Error("Failed to connect to MongoDB"));
      }
    }
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Unexpected error during bootstrap:', error);
    done(error);
  }
};
