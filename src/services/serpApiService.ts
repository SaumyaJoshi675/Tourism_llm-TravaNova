import { getJson } from 'serpapi';

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY || '66247a14f1df39849cbccecdb7c4ee602ac6a9aff40f7352003f49fb4e7fa6c6';

export interface SerpPlace {
    title: string;
    place_id: string;
    data_id?: string;
    gps_coordinates: {
        latitude: number;
        longitude: number;
    };
    rating?: number;
    reviews?: number;
    type: string;
    address?: string;
    thumbnail?: string;
    description?: string;
}

export interface AttractionFromSerp {
    id: string;
    name: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    image: string;
    rating: number;
    bestTime: string;
    activities: string[];
    popularity?: number;
}

// Fetch tourist places for a specific location
export async function fetchTouristPlaces(
    location: string,
    category?: string
): Promise<AttractionFromSerp[]> {
    try {
        const searchQuery = category
            ? `${category} tourist places in ${location}`
            : `best tourist places in ${location}`;

        console.log('Fetching from SerpAPI:', searchQuery);

        const response = await getJson({
            engine: 'google_maps',
            q: searchQuery,
            type: 'search',
            api_key: SERPAPI_KEY,
        });

        const places: SerpPlace[] = response.local_results || [];

        console.log(`Found ${places.length} places from SerpAPI`);

        return places.map((place, index) => ({
            id: place.place_id || `serp-${Date.now()}-${index}`,
            name: place.title,
            description: place.description || `Popular ${category || 'tourist'} destination in ${location}. ${place.address || ''}`,
            category: categorizePlaceType(place.type),
            latitude: place.gps_coordinates.latitude,
            longitude: place.gps_coordinates.longitude,
            image: place.thumbnail || 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800',
            rating: place.rating || 4.0,
            bestTime: getBestTimeForLocation(location),
            activities: extractActivities(place.type),
            popularity: calculatePopularity(place.rating || 4.0, place.reviews || 0),
        }));
    } catch (error) {
        console.error('Error fetching from SerpAPI:', error);
        throw error;
    }
}

// Fetch details for a specific place
export async function fetchPlaceDetails(placeId: string): Promise<any> {
    try {
        const response = await getJson({
            engine: 'google_maps',
            type: 'place',
            place_id: placeId,
            api_key: SERPAPI_KEY,
        });

        return response;
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
}

// Fetch places for multiple Indian states
export async function fetchIndianTouristPlaces(): Promise<AttractionFromSerp[]> {
    const states = [
        'Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh',
        'Uttarakhand', 'Tamil Nadu', 'Karnataka', 'Maharashtra'
    ];

    try {
        const allPlaces = await Promise.all(
            states.map(state => fetchTouristPlaces(state))
        );

        return allPlaces.flat();
    } catch (error) {
        console.error('Error fetching Indian tourist places:', error);
        return [];
    }
}

// Helper: Categorize place type
function categorizePlaceType(type: string): string {
    const typeMap: Record<string, string> = {
        'temple': 'Temple',
        'mosque': 'Temple',
        'church': 'Temple',
        'gurdwara': 'Temple',
        'shrine': 'Temple',
        'fort': 'Heritage',
        'palace': 'Heritage',
        'museum': 'Heritage',
        'monument': 'Heritage',
        'historical': 'Heritage',
        'beach': 'Beach',
        'park': 'Nature',
        'garden': 'Nature',
        'hill station': 'Nature',
        'waterfall': 'Nature',
        'lake': 'Nature',
        'wildlife sanctuary': 'Wildlife',
        'national park': 'Wildlife',
        'zoo': 'Wildlife',
        'safari': 'Wildlife',
        'adventure': 'Adventure',
        'trekking': 'Adventure',
        'skiing': 'Adventure',
        'rafting': 'Adventure',
    };

    const lowerType = type.toLowerCase();
    for (const [key, value] of Object.entries(typeMap)) {
        if (lowerType.includes(key)) {
            return value;
        }
    }
    return 'Heritage'; // Default
}

// Helper: Get best time to visit
function getBestTimeForLocation(location: string): string {
    const locationMap: Record<string, string> = {
        'goa': 'Nov-Feb',
        'kerala': 'Sep-Mar',
        'rajasthan': 'Oct-Mar',
        'himachal': 'Mar-Jun, Dec-Jan',
        'uttarakhand': 'Apr-Jun, Sep-Nov',
        'kashmir': 'Apr-Oct',
        'ladakh': 'May-Sep',
        'andaman': 'Oct-May',
        'tamil nadu': 'Nov-Feb',
        'karnataka': 'Oct-Mar',
        'maharashtra': 'Oct-Mar',
        'delhi': 'Oct-Mar',
        'agra': 'Oct-Mar',
    };

    const lowerLocation = location.toLowerCase();
    for (const [key, value] of Object.entries(locationMap)) {
        if (lowerLocation.includes(key)) {
            return value;
        }
    }
    return 'Oct-Mar'; // Default
}

// Helper: Extract activities from place type
function extractActivities(type: string): string[] {
    const activityMap: Record<string, string[]> = {
        'temple': ['Spiritual', 'Photography', 'Culture'],
        'mosque': ['Spiritual', 'Architecture', 'Photography'],
        'church': ['Spiritual', 'Architecture', 'Photography'],
        'fort': ['History Tour', 'Photography', 'Architecture'],
        'palace': ['History Tour', 'Photography', 'Architecture'],
        'beach': ['Swimming', 'Water Sports', 'Sunset View'],
        'park': ['Nature Walk', 'Photography', 'Picnic'],
        'museum': ['History', 'Art', 'Education'],
        'adventure': ['Trekking', 'Camping', 'Photography'],
        'wildlife': ['Safari', 'Bird Watching', 'Photography'],
        'waterfall': ['Trekking', 'Photography', 'Nature Walk'],
    };

    const lowerType = type.toLowerCase();
    for (const [key, value] of Object.entries(activityMap)) {
        if (lowerType.includes(key)) {
            return value;
        }
    }
    return ['Sightseeing', 'Photography'];
}

// Helper: Calculate popularity score
function calculatePopularity(rating: number, reviews: number): number {
    // Normalize to 0-100 scale
    const ratingScore = (rating / 5) * 50;
    const reviewScore = Math.min((reviews / 1000) * 50, 50);
    return Math.round(ratingScore + reviewScore);
}
