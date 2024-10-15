// config/mongoose.config.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

console.log('MONGODB_URI:', MONGODB_URI ? 'Set (value hidden for security)' : 'Not set'); // Safer debugging line

async function dbConnect(retries = MAX_RETRIES) {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in the environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'drockconstructionDB',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });

        console.log("Successfully connected to MongoDB!");
        console.log(`Port: ${process.env.PORT || 8000} / Dev Mode Activated\n`);

    } catch (error) {
        console.error(`Error connecting to MongoDB (attempt ${MAX_RETRIES - retries + 1} of ${MAX_RETRIES}): `, error.message);
        console.error('Full error object:', error); // Log the full error object for more details

        if (retries > 0) {
            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
            setTimeout(() => dbConnect(retries - 1), RETRY_DELAY);
        } else {
            console.error("Maximum retries reached. Could not connect to MongoDB.");
            // Instead of exiting, we'll throw an error to be handled by the calling code
            throw new Error("Failed to connect to MongoDB after maximum retries");
        }
    }
}

module.exports = { dbConnect };
