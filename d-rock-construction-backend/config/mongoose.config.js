// config/mongoose.config.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

console.log('MONGODB_URI:', MONGODB_URI); // Debugging line

async function dbConnect(retries = MAX_RETRIES) {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in the environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'drockconstructionDB'
        });

        console.log("Successfully connected to MongoDB!");
        console.log(`Port: ${process.env.PORT || 8000} / Dev Mode Activated\n`);

    } catch (error) {
        console.error(`Error connecting to MongoDB (attempt ${MAX_RETRIES - retries + 1} of ${MAX_RETRIES}): `, error.message);

        if (retries > 0) {
            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
            setTimeout(() => dbConnect(retries - 1), RETRY_DELAY);
        } else {
            console.error("Maximum retries reached. Could not connect to MongoDB.");
            process.exit(1); // Exit process with failure
        }
    }
}

module.exports = { dbConnect };
