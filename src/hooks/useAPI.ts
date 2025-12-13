import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000';

// Mock data for development
const mockAttractions = [
  {
    id: '1',
    name: 'Nainital',
    description: 'A beautiful hill station famous for its pristine lake surrounded by mountains.',
    category: 'Nature',
    latitude: 29.3803,
    longitude: 79.4636,
    image: 'https://images.unsplash.com/photo-1610715936287-6c2ad208cdbf?w=800',
    rating: 4.5,
    bestTime: 'March to June',
    activities: ['Boating', 'Trekking', 'Photography'],
  },
  {
    id: '2',
    name: 'Rishikesh',
    description: 'The Yoga Capital of the World, known for spiritual experiences and adventure sports.',
    category: 'Spiritual',
    latitude: 30.0869,
    longitude: 78.2676,
    image: 'https://images.unsplash.com/photo-1678788166239-b28733f56956?w=800',
    rating: 4.8,
    bestTime: 'September to November',
    activities: ['Yoga', 'Rafting', 'Bungee Jumping'],
  },
  {
    id: '3',
    name: 'Jim Corbett National Park',
    description: 'India\'s oldest national park, home to Bengal tigers and diverse wildlife.',
    category: 'Wildlife',
    latitude: 29.5312,
    longitude: 78.7764,
    image: 'https://images.unsplash.com/photo-1611409518513-f062779abeeb?w=800',
    rating: 4.6,
    bestTime: 'November to February',
    activities: ['Safari', 'Bird Watching', 'Nature Walks'],
  },
  {
    id: '4',
    name: 'Valley of Flowers',
    description: 'A UNESCO World Heritage Site with endemic alpine flowers and stunning landscapes.',
    category: 'Nature',
    latitude: 30.7268,
    longitude: 79.5967,
    image: 'https://images.unsplash.com/photo-1530488283937-97dd1667472f?w=800',
    rating: 4.9,
    bestTime: 'July to September',
    activities: ['Trekking', 'Photography', 'Camping'],
  },
  {
    id: '5',
    name: 'Auli',
    description: 'Premier ski destination with panoramic views of Himalayan peaks.',
    category: 'Adventure',
    latitude: 30.5358,
    longitude: 79.5967,
    image: 'https://images.unsplash.com/photo-1641584495098-49cfceabd8e8?w=800',
    rating: 4.7,
    bestTime: 'December to March',
    activities: ['Skiing', 'Cable Car', 'Trekking'],
  },
  {
    id: '6',
    name: 'Mussoorie',
    description: 'Queen of Hills with colonial charm and breathtaking mountain views.',
    category: 'Nature',
    latitude: 30.4598,
    longitude: 78.0644,
    image: 'https://images.unsplash.com/photo-1717051041791-47c372799618?w=800',
    rating: 4.4,
    bestTime: 'April to June',
    activities: ['Cable Car', 'Shopping', 'Sightseeing'],
  },
];

const mockEvents = [
  {
    id: '1',
    name: 'Kumbh Mela',
    date: '2025-01-15',
    location: 'Haridwar',
    description: 'The largest peaceful gathering of pilgrims on earth.',
    category: 'Religious',
    month: 1,
  },
  {
    id: '2',
    name: 'International Yoga Festival',
    date: '2025-03-01',
    location: 'Rishikesh',
    description: 'Week-long celebration of yoga with renowned teachers.',
    category: 'Cultural',
    month: 3,
  },
  {
    id: '3',
    name: 'Nanda Devi Raj Jat',
    date: '2025-08-15',
    location: 'Chamoli',
    description: 'Traditional pilgrimage to honor Goddess Nanda Devi.',
    category: 'Religious',
    month: 8,
  },
  {
    id: '4',
    name: 'Uttarakhand Adventure Festival',
    date: '2025-10-10',
    location: 'Rishikesh',
    description: 'Celebrating adventure sports and outdoor activities.',
    category: 'Adventure',
    month: 10,
  },
];

const mockRoutes = [
  {
    id: '1',
    name: 'Spiritual Journey',
    places: ['Haridwar', 'Rishikesh', 'Devprayag'],
    duration: '3 days',
    distance: '120 km',
  },
  {
    id: '2',
    name: 'Wildlife & Nature',
    places: ['Jim Corbett', 'Nainital', 'Ranikhet'],
    duration: '5 days',
    distance: '250 km',
  },
  {
    id: '3',
    name: 'Adventure Trail',
    places: ['Rishikesh', 'Auli', 'Valley of Flowers'],
    duration: '7 days',
    distance: '400 km',
  },
];

// API Functions
async function fetchAttractions() {
  try {
    const response = await fetch(`${API_BASE_URL}/attractions`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.log('Using mock data for attractions');
    return mockAttractions;
  }
}

async function fetchEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.log('Using mock data for events');
    return mockEvents;
  }
}

async function fetchRoutes() {
  try {
    const response = await fetch(`${API_BASE_URL}/routes`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.log('Using mock data for routes');
    return mockRoutes;
  }
}

async function sendChatMessage(message: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  } catch (error) {
    console.log('Using mock response for chat');
    // Mock AI response
    return {
      response: `I'd be happy to help you explore ${message.includes('Nainital') ? 'Nainital' : 'Uttarakhand'}! This beautiful destination offers stunning natural beauty, spiritual experiences, and adventure activities. Would you like me to suggest a detailed itinerary?`,
      sources: [
        { name: 'Uttarakhand Tourism Board', url: '#' },
        { name: 'Travel Guide 2025', url: '#' },
      ],
      suggestions: ['Plan 3-day itinerary', 'Best time to visit', 'Local cuisine'],
    };
  }
}

async function generateItinerary(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to generate itinerary');
    return response.json();
  } catch (error) {
    console.log('Using mock itinerary');
    return {
      days: [
        {
          day: 1,
          title: 'Arrival & Local Exploration',
          activities: [
            { time: '10:00 AM', activity: 'Check-in at hotel', location: data.destination },
            { time: '2:00 PM', activity: 'Local market visit', location: data.destination },
            { time: '6:00 PM', activity: 'Evening at lakeside', location: data.destination },
          ],
        },
        {
          day: 2,
          title: 'Adventure & Sightseeing',
          activities: [
            { time: '8:00 AM', activity: 'Sunrise trek', location: 'Nearby hills' },
            { time: '12:00 PM', activity: 'Local cuisine lunch', location: 'Popular restaurant' },
            { time: '4:00 PM', activity: 'Visit main attractions', location: data.destination },
          ],
        },
      ],
      totalCost: '₹15,000 - ₹25,000',
      tips: ['Book accommodation in advance', 'Carry warm clothing', 'Try local cuisine'],
    };
  }
}

// Custom Hooks
export function useAttractions() {
  return useQuery({
    queryKey: ['attractions'],
    queryFn: fetchAttractions,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
  });
}

export function useChatMessage() {
  return useMutation({
    mutationFn: sendChatMessage,
  });
}

export function useGenerateItinerary() {
  return useMutation({
    mutationFn: generateItinerary,
  });
}