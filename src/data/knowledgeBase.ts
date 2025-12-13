export interface TourismData {
    id: string;
    name: string;
    location: string;
    description: string;
    category: string;
    activities: string[];
    bestTime: string;
    keywords: string[]; // For basic semantic matching
}

export const indianTourismDB: TourismData[] = [
    {
        id: 'uttarakhand-1',
        name: 'Rishikesh',
        location: 'Uttarakhand',
        description: 'Known as the Yoga Capital of the World, Rishikesh offers a blend of spirituality and adventure. Famous for the Beatles Ashram, Ganga Aarti, and white-water rafting.',
        category: 'Spiritual & Adventure',
        activities: ['River Rafting', 'Yoga & Meditation', 'Bungee Jumping', 'Ganga Aarti'],
        bestTime: 'September to June',
        keywords: ['yoga', 'ganga', 'rafting', 'adventure', 'spiritual']
    },
    {
        id: 'kerala-1',
        name: 'Alleppey (Alappuzha)',
        location: 'Kerala',
        description: 'Famous for its backwaters, houseboats, and intricate network of canals. Known as the Venice of the East.',
        category: 'Nature & Relaxation',
        activities: ['Houseboat Stay', 'Canoeing', 'Ayurvedic Spa', 'Village Walk'],
        bestTime: 'November to February',
        keywords: ['backwater', 'houseboat', 'kerala', 'south india', 'nature']
    },
    {
        id: 'rajasthan-1',
        name: 'Jaipur',
        location: 'Rajasthan',
        description: 'The Pink City, known for its historic forts, palaces, and vibrant culture. Home to the Hawa Mahal, Amber Fort, and City Palace.',
        category: 'Heritage & Culture',
        activities: ['Fort Tours', 'Shopping', 'Hot Air Ballooning', 'Cultural Shows'],
        bestTime: 'October to March',
        keywords: ['pink city', 'fort', 'palace', 'history', 'royal']
    },
    {
        id: 'goa-1',
        name: 'North Goa',
        location: 'Goa',
        description: 'Famous for its lively beaches, nightlife, flea markets, and Portuguese architecture.',
        category: 'Beach & Nightlife',
        activities: ['Water Sports', 'Beach Parties', 'Market Shopping', 'Heritage Walk'],
        bestTime: 'November to March',
        keywords: ['beach', 'party', 'nightlife', 'sea', 'sun']
    },
    {
        id: 'himachal-1',
        name: 'Manali',
        location: 'Himachal Pradesh',
        description: 'A high-altitude resort town known for its backpacking culture, snowy peaks, and serving as a gateway to Solang Valley and Rohtang Pass.',
        category: 'Hill Station & Adventure',
        activities: ['Paragliding', 'Skiing', 'Trekking', 'Cafe Hopping'],
        bestTime: 'October to June',
        keywords: ['snow', 'mountains', 'himalayas', 'trekking', 'adventure']
    },
    {
        id: 'uttar-pradesh-1',
        name: 'Varanasi',
        location: 'Uttar Pradesh',
        description: 'One of the world\'s oldest living cities, sacred to Hindus. Famous for its ghats along the Ganges and the evening Aarti.',
        category: 'Spiritual',
        activities: ['Ghat Walk', 'Boat Ride', 'Temple Visit', 'Ganga Aarti'],
        bestTime: 'October to March',
        keywords: ['spiritual', 'holy', 'ganges', 'temple', 'ancient']
    },
    {
        id: 'ladakh-1',
        name: 'Leh Ladakh',
        location: 'Ladakh',
        description: 'Known for its stunning lunar landscapes, high mountain passes, and Buddhist monasteries.',
        category: 'Adventure',
        activities: ['Motorbiking', 'Monastery Visits', 'Camping', 'Trekking'],
        bestTime: 'May to September',
        keywords: ['mountains', 'bike trip', 'monastery', 'adventure', 'cold desert']
    }
];

// Simple keyword-based retrieval function
export function findRelevantContext(query: string): string {
    const lowercaseQuery = query.toLowerCase();

    // Find matching destinations based on keywords or content
    const matches = indianTourismDB.filter(item => {
        return (
            item.name.toLowerCase().includes(lowercaseQuery) ||
            item.location.toLowerCase().includes(lowercaseQuery) ||
            item.keywords.some(k => lowercaseQuery.includes(k)) ||
            item.description.toLowerCase().includes(lowercaseQuery)
        );
    });

    if (matches.length === 0) {
        // If no direct matches, return general top destinations to keep conversation going
        return "I don't have specific details on that exact query in my immediate database, but here is information about some popular places in India: " +
            indianTourismDB.slice(0, 3).map(i => `${i.name} (${i.location})`).join(', ');
    }

    // Format the context for the LLM
    return matches.map(item => `
    Destination: ${item.name}
    Location: ${item.location}
    Category: ${item.category}
    Description: ${item.description}
    Activities: ${item.activities.join(', ')}
    Best Time to Visit: ${item.bestTime}
  `).join('\n---\n');
}
