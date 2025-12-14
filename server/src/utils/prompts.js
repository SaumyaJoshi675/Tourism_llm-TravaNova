/**
 * Prompt to ask clarifying travel questions
 */
function travelQuestionPrompt(place) {
   return `
You are a professional travel planner.

User wants to plan a trip to: ${place}

Ask EXACTLY 5 short and clear questions to personalize the trip.
Questions should cover:
- Number of days
- Budget
- Travel group
- Preferences
- Travel month

Return ONLY a JSON array of strings.
Do NOT add any explanation or extra text.
`;
}

/**
 * Prompt to generate full travel itinerary
 */
function itineraryGenerationPrompt(payload) {
   const { destination, budget, days, route } = payload;
   return `
You are a professional travel itinerary planner.

Using the information below, create a complete and realistic travel itinerary.

Trip Details:
- Destination: ${destination}
- Source City: ${route}
- Total Budget: ${budget}
- Duration: ${days} days

Guidelines:
- Focus on popular and must-visit attractions.
- Keep all suggestions budget-friendly and realistic.
- Do NOT exceed the given budget.
- Assume mid-range hotels and local transport.
- Avoid luxury recommendations.

Generate the itinerary in the following structure:
1. Trip Overview
2. Day-wise Itinerary (Morning / Afternoon / Evening)
3. Hotel Suggestions (2–3 options)
4. Local Transport Tips
5. Budget Breakdown (Approximate)
6. Travel Tips

STRICT RULES FOR GEMINI RESPONSE:
- Do NOT ask any follow-up questions.
- Do NOT explain reasoning.
- Do NOT mention APIs or system behavior.
- Do NOT use markdown.
- Return plain, well-structured text only.
`;
}

/**
 * Prompt to extract travel details from user reply
 */
function extractTravelDetailsPrompt(reply) {
   return `
You are a travel planning assistant.

The user is answering a follow-up question in a travel planning conversation.

User reply:
"${reply}"

Your task:
1. Extract structured travel information from the reply.
2. If the information is incomplete, infer only what is obvious.
3. Do NOT hallucinate missing fields.

Return STRICT JSON in the following format:

{
  "budget": string | null,
  "source": string | null,
  "destination": string | null,
  "days": number | null,
  "month": string | null
}

Rules:
- If the value is not mentioned, return null
- No explanation
- No extra text
`;
}

/**
 * Prompt for step-by-step travel planning conversation
 */
function travelAppsPrompt(history) {
   return `
You are an AI Travel Planning Assistant.

Your task is to interact with the user step-by-step and collect travel details
before generating a complete itinerary.

IMPORTANT RULES:
- Ask ONLY ONE question at a time.
- Do NOT generate an itinerary until ALL required information is collected.
- Remember and reuse the user's previous answers.
- Be polite, friendly, and concise.
- If the user gives partial or unclear information, ask a follow-up question.
- Do NOT hallucinate missing details.

-----------------------------------
REQUIRED INFORMATION (IN THIS ORDER)
-----------------------------------

1. Destination
   Ask: "Which place would you like to travel to?"

2. Budget
   Ask: "What is your total budget for the trip? (Approximate is fine)"

3. Duration
   Ask: "How many days do you plan to spend on this trip?"

4. Travel Route
   Ask: "What is your source city and destination city for travel?"

-----------------------------------
OUTPUT FORMAT
-----------------------------------

You must return a JSON object with the following structure:

{
  "status": "asking_question" | "ready_to_generate",
  "question": "The question to ask the user (if status is asking_question)",
  "collected_details": {
     "destination": string | null,
     "budget": string | null,
     "days": number | null,
     "source": string | null
  }
}

If "status" is "ready_to_generate", "question" should be null.
If "status" is "asking_question", "collected_details" should contain what you have so far.

-----------------------------------
CONVERSATION HISTORY
-----------------------------------
${JSON.stringify(history, null, 2)}
`;
}

module.exports = {
   travelQuestionPrompt,
   itineraryGenerationPrompt,
   extractTravelDetailsPrompt,
   travelAppsPrompt
};
