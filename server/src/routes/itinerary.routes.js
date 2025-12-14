const express = require('express');
const router = express.Router();

const { isTravelQuery } = require('../utils/intent');
const serpService = require('../services/serp.service');
const geminiService = require('../services/gemini.service');
const pdfService = require('../services/pdf.service');

/**
 * POST /api/itinerary
 */
router.post('/', async (req, res) => {
    try {
        const { query, history } = req.body;
        console.log('Received Query:', query);
        // console.log('History Length:', history?.length); // Optional logging

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // FILTER USER MESSAGES ONLY
        // History contains [{role, content}, ...]. The *current* query is usually the last item.
        const userMessages = (history || []).filter(msg => msg.role === 'user');
        // If history is empty (first msg), count is 1.
        const userTurnCount = userMessages.length || 1;

        console.log('User Turn Count:', userTurnCount);

        // DETERMINISTIC FLOW STATE MACHINE
        // 1. Destination -> 2. Budget -> 3. Days -> 4. Route -> 5. Generate

        if (userTurnCount === 1) {
            return res.json({
                type: 'question',
                message: "Which place do you want to travel to?"
            });
        }

        if (userTurnCount === 2) {
            return res.json({
                type: 'question',
                message: "What is your total budget for the trip? (Approximate is fine)"
            });
        }

        if (userTurnCount === 3) {
            return res.json({
                type: 'question',
                message: "How many days do you plan to spend on this trip?"
            });
        }

        if (userTurnCount === 4) {
            return res.json({
                type: 'question',
                message: "What is your source city and destination city for travel?"
            });
        }

        if (userTurnCount >= 5) {
            // WE HAVE ALL INFO
            // Msg 2: Destination
            // Msg 3: Budget
            // Msg 4: Days
            // Msg 5: Route

            const destination = userMessages[1].content;
            const budget = userMessages[2].content;
            const days = userMessages[3].content;
            const route = userMessages[4].content;

            const payload = {
                destination,
                budget,
                days,
                route
            };

            console.log('Generating Itinerary with:', payload);

            // CALL GEMINI ONCE (Deterministic Generation)
            const itinerary = await geminiService.generateItinerary(payload);
            const pdfPath = pdfService.generateItineraryPDF(itinerary);

            return res.json({
                type: 'itinerary',
                itinerary,
                pdf: pdfPath
            });
        }

        return res.json({ message: "Itinerary generated. Start a new chat to plan another trip!" });
    } catch (error) {
        console.error('Itinerary route error:', error);
        return res.status(500).json({
            message: 'Failed to generate itinerary'
        });
    }
});

module.exports = router;
