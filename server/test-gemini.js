const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-flash-latest';
console.log('Listing Gemini Models...');
console.log('Key:', GEMINI_API_KEY ? 'Found' : 'Missing');

async function listModels() {
    try {
        const url = `${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`;
        console.log('URL:', url);

        const response = await axios.get(url, { timeout: 10000 });

        console.log('Success!');
        const models = response.data.models || [];
        console.log('Available Models:');
        models.forEach(m => {
            if (m.name.includes('gemini')) {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            }
        });
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
        console.error('Error Message:', error.message);
    }
}

listModels();
