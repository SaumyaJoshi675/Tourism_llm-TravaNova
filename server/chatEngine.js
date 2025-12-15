const axios = require("axios");
const { buildItineraryPrompt } = require("./itineraryPrompt");
const { OLLAMA_URL, MODEL } = require("./config");

// In-memory storage (fastest)
const sessions = {};
const cache = {};

const QUESTIONS = [
    { key: "destination", question: "Where do you want to travel?" },
    { key: "budget", question: "What is your approximate budget (INR)?" },
    { key: "days", question: "How many days is your trip?" },
    { key: "source", question: "From which city will you start?" }
];

const COMMON_QA = {
    "best time": "The best time depends on weather and crowd levels. October to March suits most Indian destinations.",
    "is it safe": "Most tourist destinations in India are safe if you follow basic precautions.",
    "what to pack": "Pack light clothes, essentials, chargers, ID proof, and weather-specific items.",
    "budget travel": "Use public transport, budget stays, local food, and advance bookings."
};

async function callLLM(prompt) {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt,
            stream: true // Enable streaming
        }, {
            responseType: 'stream' // Important for axios to handle stream
        });

        return response.data; // This is a ReadableStream
    } catch (e) {
        console.error("LLM Call Failed:", e.message);
        return null;
    }
}

async function handleMessage(sessionId, message) {
    const msg = message.toLowerCase().trim();

    // 1️⃣ Cached response (If it's a string, wrap in fake stream? For now just return string)
    if (cache[msg]) return cache[msg];

    // 2️⃣ Instant rule-based replies
    for (const key in COMMON_QA) {
        if (msg.includes(key)) {
            cache[msg] = COMMON_QA[key];
            return COMMON_QA[key];
        }
    }

    // 3️⃣ New session
    if (!sessions[sessionId]) {
        sessions[sessionId] = { step: 0, data: {} };
        return "Hello! I can plan your trip. Where do you want to go?";
    }

    const session = sessions[sessionId];

    // 4️⃣ Collect inputs (NO AI)
    if (session.step < QUESTIONS.length) {
        const { key } = QUESTIONS[session.step];
        session.data[key] = message;
        session.step++;

        if (session.step < QUESTIONS.length) {
            return QUESTIONS[session.step].question;
        }
    }

    // 5️⃣ Generate itinerary (STREAMING AI CALL)
    const prompt = buildItineraryPrompt(session.data);
    const infoStream = await callLLM(prompt); // Returns a stream

    delete sessions[sessionId];

    return infoStream; // Return the stream directly
}

module.exports = { handleMessage };
