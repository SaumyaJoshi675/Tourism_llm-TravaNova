function buildItineraryPrompt(data) {
    return `
Create a ${data.days}-day travel itinerary.

Destination: ${data.destination}
Budget: ${data.budget} INR
Source city: ${data.source}

Rules:
- Budget friendly
- Indian context
- Realistic timings

Format:
Day 1:
Day 2:
Include transport, food, and tips.
`;
}

module.exports = { buildItineraryPrompt };
