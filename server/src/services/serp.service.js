const axios = require('axios');
const { SERP_API_KEY } = require('../config/env');

const SERP_BASE_URL = 'https://serpapi.com/search.json';

/**
 * Generic Google search
 */
async function googleSearch(query) {
    try {
        const { data } = await axios.get(SERP_BASE_URL, {
            params: {
                q: query,
                hl: 'en',
                gl: 'in',
                google_domain: 'google.co.in',
                api_key: SERP_API_KEY
            },
            timeout: 5000
        });

        return data.organic_results?.slice(0, 5) || [];
    } catch (error) {
        console.error('SerpAPI googleSearch error:', error.message);
        return [];
    }
}

/**
 * Search best hotels for a place
 */
async function searchHotels(place) {
    return googleSearch(`best hotels in ${place}`);
}

/**
 * Search flights using Google Flights engine
 * from & to should be IATA codes (DEL, BOM, GOI etc.)
 */
async function searchFlights(from, to, date) {
    try {
        const { data } = await axios.get(SERP_BASE_URL, {
            params: {
                engine: 'google_flights',
                departure_id: from,
                arrival_id: to,
                outbound_date: date,
                currency: 'INR',
                hl: 'en',
                api_key: SERP_API_KEY
            },
            timeout: 5000
        });

        return data.best_flights || [];
    } catch (error) {
        console.error('SerpAPI flight search error:', error.message);
        return [];
    }
}

/**
 * Google Maps places (tourist attractions)
 */
async function searchPlaces(place) {
    try {
        const { data } = await axios.get(SERP_BASE_URL, {
            params: {
                engine: 'google_maps',
                q: `top tourist places in ${place}`,
                hl: 'en',
                api_key: SERP_API_KEY
            },
            timeout: 5000
        });

        return data.local_results?.slice(0, 6) || [];
    } catch (error) {
        console.error('SerpAPI maps error:', error.message);
        return [];
    }
}

module.exports = {
    googleSearch,
    searchHotels,
    searchFlights,
    searchPlaces
};
