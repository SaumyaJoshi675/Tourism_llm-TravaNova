# 🔍 SerpAPI Integration Guide for Dynamic Tourist Places

## Overview
This guide shows how to integrate **SerpAPI** to dynamically fetch tourist places data instead of using static data.

## What is SerpAPI?
SerpAPI is a real-time API to access Google search results, including Google Maps, Places, and Travel data.

## Benefits of Using SerpAPI
- ✅ **Real-time data** - Always up-to-date information
- ✅ **Rich details** - Photos, ratings, reviews, opening hours
- ✅ **Comprehensive** - Covers all tourist places worldwide
- ✅ **Accurate coordinates** - Precise GPS locations
- ✅ **User reviews** - Real traveler feedback

## Setup Instructions

### Step 1: Get SerpAPI Key
1. Go to [https://serpapi.com/](https://serpapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 100 searches/month

### Step 2: Install SerpAPI Package

```bash
npm install serpapi
```

### Step 3: Create SerpAPI Service

Create `src/services/serpApiService.ts`:

```typescript
import { getJson } from 'serpapi';

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY || 'your-api-key-here';

export interface SerpPlace {
  title: string;
  place_id: string;
  data_id: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviews: number;
  type: string;
  address: string;
  thumbnail: string;
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
      : `tourist places in ${location}`;

    const response = await getJson({
      engine: 'google_maps',
      q: searchQuery,
      type: 'search',
      api_key: SERPAPI_KEY,
    });

    const places: SerpPlace[] = response.local_results || [];

    return places.map((place, index) => ({
      id: place.place_id || `serp-${index}`,
      name: place.title,
      description: place.description || `Popular ${category || 'tourist'} destination in ${location}`,
      category: categorizePlaceType(place.type),
      latitude: place.gps_coordinates.latitude,
      longitude: place.gps_coordinates.longitude,
      image: place.thumbnail || 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800',
      rating: place.rating || 4.0,
      bestTime: getBestTimeForLocation(location),
      activities: extractActivities(place.type),
      popularity: calculatePopularity(place.rating, place.reviews),
    }));
  } catch (error) {
    console.error('Error fetching from SerpAPI:', error);
    return [];
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

// Helper: Categorize place type
function categorizePlaceType(type: string): string {
  const typeMap: Record<string, string> = {
    'temple': 'Temple',
    'mosque': 'Temple',
    'church': 'Temple',
    'fort': 'Heritage',
    'palace': 'Heritage',
    'museum': 'Heritage',
    'monument': 'Heritage',
    'beach': 'Beach',
    'park': 'Nature',
    'garden': 'Nature',
    'hill station': 'Nature',
    'waterfall': 'Nature',
    'wildlife sanctuary': 'Wildlife',
    'national park': 'Wildlife',
    'zoo': 'Wildlife',
    'adventure': 'Adventure',
    'trekking': 'Adventure',
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
    'fort': ['History Tour', 'Photography', 'Architecture'],
    'beach': ['Swimming', 'Water Sports', 'Sunset View'],
    'park': ['Nature Walk', 'Photography', 'Picnic'],
    'museum': ['History', 'Art', 'Education'],
    'adventure': ['Trekking', 'Camping', 'Photography'],
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
```

### Step 4: Create Environment Variable

Create `.env` file in project root:

```env
VITE_SERPAPI_KEY=your_serpapi_key_here
```

### Step 5: Update MapExplorer to Use SerpAPI

Update `src/pages/MapExplorer.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { fetchTouristPlaces } from '../services/serpApiService';
import { sampleAttractions, Attraction } from '../data/attractionsData';

export default function MapExplorer() {
  const [attractions, setAttractions] = useState<Attraction[]>(sampleAttractions);
  const [loading, setLoading] = useState(false);
  const [useSerpAPI, setUseSerpAPI] = useState(false);

  // Fetch from SerpAPI
  const loadFromSerpAPI = async (location: string) => {
    setLoading(true);
    try {
      const places = await fetchTouristPlaces(location);
      setAttractions(places);
    } catch (error) {
      console.error('Failed to load from SerpAPI:', error);
      // Fallback to sample data
      setAttractions(sampleAttractions);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between static and dynamic data
  const toggleDataSource = () => {
    if (!useSerpAPI) {
      loadFromSerpAPI('India');
    } else {
      setAttractions(sampleAttractions);
    }
    setUseSerpAPI(!useSerpAPI);
  };

  // ... rest of component
}
```

## Usage Examples

### Example 1: Fetch Places by Location

```typescript
// Fetch all tourist places in Goa
const goaPlaces = await fetchTouristPlaces('Goa');

// Fetch temples in Varanasi
const varanasiTemples = await fetchTouristPlaces('Varanasi', 'temple');

// Fetch beaches in Kerala
const keralaBeaches = await fetchTouristPlaces('Kerala', 'beach');
```

### Example 2: Fetch Place Details

```typescript
// Get detailed information about a specific place
const placeDetails = await fetchPlaceDetails('ChIJ...');
console.log(placeDetails.photos);
console.log(placeDetails.reviews);
console.log(placeDetails.opening_hours);
```

### Example 3: Search Multiple Locations

```typescript
const locations = ['Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh'];

const allPlaces = await Promise.all(
  locations.map(loc => fetchTouristPlaces(loc))
);

const flattenedPlaces = allPlaces.flat();
```

## API Response Structure

### Google Maps Search Response
```json
{
  "local_results": [
    {
      "title": "Taj Mahal",
      "place_id": "ChIJbf8C1yFxdDkR3n12P4DkKt0",
      "data_id": "0x3...",
      "gps_coordinates": {
        "latitude": 27.1751,
        "longitude": 78.0421
      },
      "rating": 4.6,
      "reviews": 150000,
      "type": "Historical landmark",
      "address": "Agra, Uttar Pradesh",
      "thumbnail": "https://...",
      "description": "Iconic white marble mausoleum..."
    }
  ]
}
```

## Cost Estimation

### SerpAPI Pricing
- **Free Tier**: 100 searches/month
- **Starter**: $50/month - 5,000 searches
- **Professional**: $250/month - 30,000 searches

### Optimization Tips
1. **Cache results** - Store fetched data in localStorage
2. **Batch requests** - Fetch multiple locations at once
3. **Use fallback** - Keep static data as backup
4. **Rate limiting** - Implement request throttling

## Alternative: Hybrid Approach

Combine static data with dynamic fetching:

```typescript
export default function MapExplorer() {
  // Start with static data (fast)
  const [attractions, setAttractions] = useState(sampleAttractions);

  useEffect(() => {
    // Enhance with real-time data (background)
    const enhanceData = async () => {
      const realtimeData = await fetchTouristPlaces('India');
      // Merge with static data
      const merged = [...sampleAttractions, ...realtimeData];
      setAttractions(merged);
    };

    enhanceData();
  }, []);
}
```

## Advantages vs Static Data

| Feature | Static Data | SerpAPI |
|---------|-------------|---------|
| Speed | ⚡ Instant | 🐌 2-3 seconds |
| Cost | ✅ Free | 💰 Paid |
| Freshness | ❌ Manual updates | ✅ Real-time |
| Coverage | ⚠️ Limited | ✅ Comprehensive |
| Offline | ✅ Works | ❌ Needs internet |
| Accuracy | ⚠️ Manual | ✅ Google verified |

## Recommendation

**For your tourism website:**

1. **Start with static data** (86 places we just added) ✅
2. **Add SerpAPI later** for specific features:
   - Search functionality
   - "Nearby places" feature
   - Real-time reviews
   - Updated photos

3. **Hybrid approach** (Best):
   - Use static data for initial load (fast)
   - Fetch from SerpAPI for search/filters
   - Cache SerpAPI results

## Current Status

✅ **You now have 86 static destinations** covering:
- 20 Heritage sites
- 15 Temples
- 12 Adventure destinations
- 15 Nature spots
- 12 Beaches
- 12 Wildlife sanctuaries

This is **sufficient for a production tourism website**! You can add SerpAPI later when you need:
- More places
- Real-time data
- User-generated content
- Advanced search

---

**Next Steps:**
1. Test the map with 86 destinations ✅
2. Add SerpAPI if needed for dynamic data
3. Implement caching for better performance
