const axios = require('axios');
const { GEMINI_API_KEY } = require('../config/env');
const {
    travelQuestionPrompt,
    itineraryGenerationPrompt,
    extractTravelDetailsPrompt,
    travelAppsPrompt
} = require('../utils/prompts');

const GEMINI_BASE_URL =
    'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Generic Gemini call
 */
async function callGemini(prompt, model = 'gemini-flash-latest', retries = 3) {
    try {
        const response = await axios.post(
            `${GEMINI_BASE_URL}/${model}:generateContent`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                params: { key: GEMINI_API_KEY },
                timeout: 60000
            }
        );

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            console.warn(`Gemini 429 Rate Limit. Retrying in ${(4 - retries) * 2}s...`);
            await new Promise(resolve => setTimeout(resolve, (4 - retries) * 2000));
            return callGemini(prompt, model, retries - 1);
        }

        console.error('Gemini API error:', error.message);
        throw new Error('Gemini service failed');
    }
}

/**
 * Ask clarifying travel questions
 */
async function askTravelQuestions(place) {
    const prompt = travelQuestionPrompt(place);
    const responseText = await callGemini(prompt, 'gemini-flash-latest');

    return JSON.parse(responseText);
}

/**
 * Generate complete itinerary
 */
async function generateItinerary(payload) {
    const prompt = itineraryGenerationPrompt(payload);
    const responseText = await callGemini(prompt, 'gemini-pro-latest');

    return JSON.parse(responseText);
}

/**
 * Extract details from user reply
 */
async function extractTravelDetails(reply) {
    const prompt = extractTravelDetailsPrompt(reply);
    const responseText = await callGemini(prompt, 'gemini-flash-latest');

    return JSON.parse(responseText);
}

/**
 * Handle conversation flow
 */
async function planTripConversation(history) {
    const prompt = travelAppsPrompt(history);
    // Using a faster model for chat interactions
    const responseText = await callGemini(prompt, 'gemini-flash-latest');

    // Clean up potential markdown formatting in JSON response
    const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanText);
}

module.exports = {
    askTravelQuestions,
    generateItinerary,
    extractTravelDetails,
    planTripConversation
};
