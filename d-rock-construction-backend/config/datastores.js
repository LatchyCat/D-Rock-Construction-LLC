const dotenv = require('dotenv');
dotenv.config();

module.exports.datastores = {
  default: {
    adapter: 'sails-mongo',
    url: process.env.MONGODB_URI,
    ssl: true,
    database: 'drockconstructionDB'
  }
};
