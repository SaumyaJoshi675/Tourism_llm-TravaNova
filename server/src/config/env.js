const path = require('path');
const dotenv = require('dotenv');

// Load .env from project root
dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

module.exports = {
    PORT: process.env.PORT || 5000,
    SERP_API_KEY: process.env.SERP_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};
