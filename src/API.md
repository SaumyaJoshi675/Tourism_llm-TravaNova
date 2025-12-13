# 🔌 API Documentation

Complete reference for backend API integration with the Uttarakhand Tourism LLM Frontend.

---

## 📡 Base Configuration

```typescript
// Default API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

Set in `.env`:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## 🔗 Endpoints

### 1. Chat Message

**Send a message to the AI assistant**

```
POST /chat
```

**Request Body:**
```json
{
  "query": "Tell me about Nainital",
  "language": "en",  // optional: "en" | "hi"
  "context": {}      // optional: additional context
}
```

**Response:**
```json
{
  "response": "Nainital is a beautiful hill station...",
  "sources": [
    {
      "name": "Uttarakhand Tourism Board",
      "url": "https://tourism.uk.gov.in/nainital"
    },
    {
      "name": "Travel Guide 2025",
      "url": "https://example.com/guide"
    }
  ],
  "suggestions": [
    "Plan 3-day itinerary",
    "Best time to visit",
    "Local cuisine"
  ],
  "metadata": {
    "tokens_used": 250,
    "processing_time": 1.2,
    "model": "mistral-7b-tourism"
  }
}
```

**Frontend Integration:**
```typescript
const chatMutation = useChatMessage();
const response = await chatMutation.mutateAsync(userMessage);
```

---

### 2. Get Attractions

**Fetch list of tourist attractions**

```
GET /attractions
```

**Query Parameters:**
```
?category=Nature        // optional: filter by category
&search=Nainital       // optional: search term
&limit=50              // optional: limit results
&offset=0              // optional: pagination
```

**Response:**
```json
[
  {
    "id": "attr_001",
    "name": "Nainital",
    "description": "A beautiful hill station famous for its pristine lake...",
    "category": "Nature",
    "latitude": 29.3803,
    "longitude": 79.4636,
    "image": "https://example.com/nainital.jpg",
    "rating": 4.5,
    "bestTime": "March to June",
    "activities": ["Boating", "Trekking", "Photography"],
    "accessibility": "Easy",
    "entryFee": "Free",
    "openingHours": "24/7",
    "nearbyAttractions": ["Naini Lake", "Snow View Point"]
  }
]
```

**Frontend Integration:**
```typescript
const { data: attractions, isLoading } = useAttractions();
```

---

### 3. Get Events

**Fetch festivals and events**

```
GET /events
```

**Query Parameters:**
```
?month=3               // optional: filter by month (1-12)
&category=Religious    // optional: filter by category
&year=2025            // optional: filter by year
```

**Response:**
```json
[
  {
    "id": "evt_001",
    "name": "Kumbh Mela",
    "date": "2025-01-15",
    "endDate": "2025-02-15",  // optional
    "location": "Haridwar",
    "description": "The largest peaceful gathering...",
    "category": "Religious",
    "month": 1,
    "imageUrl": "https://example.com/kumbh.jpg",
    "ticketPrice": "Free",
    "website": "https://kumbhmela.gov.in",
    "contactInfo": "+91-XXXXXXXXXX"
  }
]
```

**Frontend Integration:**
```typescript
const { data: events, isLoading } = useEvents();
```

---

### 4. Get Routes

**Fetch travel routes and itineraries**

```
GET /routes
```

**Query Parameters:**
```
?type=Adventure        // optional: filter by type
&duration=3           // optional: filter by days
```

**Response:**
```json
[
  {
    "id": "route_001",
    "name": "Spiritual Journey",
    "places": ["Haridwar", "Rishikesh", "Devprayag"],
    "duration": "3 days",
    "distance": "120 km",
    "difficulty": "Easy",
    "highlights": [
      "Ganga Aarti",
      "Yoga sessions",
      "River rafting"
    ],
    "estimatedCost": {
      "low": 5000,
      "medium": 10000,
      "high": 20000
    }
  }
]
```

**Frontend Integration:**
```typescript
const { data: routes, isLoading } = useRoutes();
```

---

### 5. Generate Itinerary

**AI-powered itinerary generation**

```
POST /plan
```

**Request Body:**
```json
{
  "destination": "Nainital",
  "duration": 3,
  "budget": "Medium",  // "Low" | "Medium" | "High"
  "interests": ["Nature", "Adventure"],  // optional
  "travelMode": "Self-drive",           // optional
  "accommodation": "Hotel",             // optional
  "startDate": "2025-03-15"            // optional
}
```

**Response:**
```json
{
  "itinerary_id": "itin_001",
  "days": [
    {
      "day": 1,
      "date": "2025-03-15",
      "title": "Arrival & Local Exploration",
      "activities": [
        {
          "time": "10:00 AM",
          "activity": "Check-in at hotel",
          "location": "The Naini Retreat",
          "duration": "1 hour",
          "cost": 5000,
          "tips": "Book in advance for better rates"
        },
        {
          "time": "2:00 PM",
          "activity": "Naini Lake boating",
          "location": "Naini Lake",
          "duration": "2 hours",
          "cost": 500,
          "tips": "Best time is afternoon"
        }
      ],
      "meals": [
        {
          "type": "Lunch",
          "suggestion": "Sher-e-Punjab",
          "cost": 800
        },
        {
          "type": "Dinner",
          "suggestion": "Embassy Restaurant",
          "cost": 1200
        }
      ]
    }
  ],
  "totalCost": {
    "accommodation": 15000,
    "food": 6000,
    "activities": 3000,
    "transport": 2000,
    "total": 26000
  },
  "tips": [
    "Book accommodation in advance",
    "Carry warm clothing",
    "Try local cuisine"
  ],
  "weather": {
    "expected": "Pleasant",
    "temperature": "15-25°C",
    "rainfall": "Low"
  }
}
```

**Frontend Integration:**
```typescript
const generateMutation = useGenerateItinerary();
const result = await generateMutation.mutateAsync({
  destination: 'Nainital',
  duration: 3,
  budget: 'Medium'
});
```

---

### 6. Get Attraction Images

**Fetch images for a specific attraction**

```
GET /images/:attractionId
```

**Response:**
```json
{
  "attraction_id": "attr_001",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "caption": "Naini Lake panoramic view",
      "credit": "Photo by John Doe",
      "isPrimary": true
    },
    {
      "url": "https://example.com/image2.jpg",
      "caption": "Sunset at Naini Lake",
      "isPrimary": false
    }
  ]
}
```

---

## 🔒 Authentication (Optional)

If your backend requires authentication:

```typescript
// Add to fetch headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

**Login Endpoint:**
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "expires_in": 3600,
  "user": {
    "id": "user_001",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

## 📊 Rate Limiting

**Recommended limits:**
```
- Chat: 30 requests/minute
- Attractions: 100 requests/minute
- Events: 100 requests/minute
- Itinerary: 10 requests/minute
```

**Response Headers:**
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1640000000
```

---

## ❌ Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Duration must be between 1 and 14 days",
    "details": {
      "field": "duration",
      "value": 20,
      "constraint": "max:14"
    }
  },
  "status": 400,
  "timestamp": "2025-03-15T10:30:00Z"
}
```

**Error Codes:**
```
400 - Bad Request (invalid input)
401 - Unauthorized (auth required)
403 - Forbidden (insufficient permissions)
404 - Not Found (resource doesn't exist)
429 - Too Many Requests (rate limit exceeded)
500 - Internal Server Error
503 - Service Unavailable
```

**Frontend Handling:**
```typescript
try {
  const response = await chatMutation.mutateAsync(message);
} catch (error) {
  if (error.status === 429) {
    toast.error('Rate limit exceeded. Please wait.');
  } else {
    toast.error('Something went wrong. Please try again.');
  }
}
```

---

## 🔄 Caching Strategy

**React Query Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 10 * 60 * 1000,  // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**Cache Keys:**
```typescript
['attractions']              // All attractions
['attractions', { category }] // Filtered attractions
['events']                   // All events
['events', { month }]        // Filtered events
['routes']                   // All routes
```

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "Tell me about Nainital"}'

# Attractions
curl http://localhost:8000/attractions

# Events
curl http://localhost:8000/events?month=3

# Generate Itinerary
curl -X POST http://localhost:8000/plan \
  -H "Content-Type: application/json" \
  -d '{"destination": "Nainital", "duration": 3, "budget": "Medium"}'
```

### Using Frontend Dev Tools

```javascript
// Open browser console
fetch('http://localhost:8000/attractions')
  .then(r => r.json())
  .then(console.log);
```

---

## 🚀 Production Considerations

### CORS Configuration

Backend should allow:
```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.com",
        "http://localhost:3000"  # for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### SSL/TLS

Always use HTTPS in production:
```env
VITE_API_BASE_URL=https://api.your-domain.com
```

### Monitoring

Log these metrics:
- Request latency
- Error rates
- Cache hit rates
- Token usage (for LLM)

---

## 📝 Mock Data Reference

When backend is unavailable, frontend uses mock data:

```typescript
// Location: /hooks/useAPI.ts

mockAttractions = [6 items]
mockEvents = [4 items]
mockRoutes = [3 items]
mockChatResponse = { dynamic }
mockItinerary = { 2-day plan }
```

**Mock data advantages:**
- Demo works offline
- Development without backend
- Consistent test data
- Fast prototyping

---

## 🔧 Customization

### Adding New Endpoint

```typescript
// 1. Define API function
async function fetchNewData() {
  const response = await fetch(`${API_BASE_URL}/new-endpoint`);
  return response.json();
}

// 2. Create hook
export function useNewData() {
  return useQuery({
    queryKey: ['newData'],
    queryFn: fetchNewData,
  });
}

// 3. Use in component
const { data, isLoading } = useNewData();
```

### Modifying Mock Data

```typescript
// Edit /hooks/useAPI.ts
const mockNewData = [
  {
    id: '1',
    name: 'Example',
    // ... your fields
  }
];
```

---

## 📚 API Best Practices

1. **Always handle errors gracefully**
2. **Use loading states for UX**
3. **Implement retry logic for failed requests**
4. **Cache responses when possible**
5. **Validate data before sending**
6. **Use TypeScript interfaces**
7. **Log errors for debugging**

---

## 🆘 Troubleshooting

### API not responding

```typescript
// Check in browser console
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);

// Test connectivity
fetch(API_BASE_URL + '/health')
  .then(r => console.log('Backend is up'))
  .catch(e => console.log('Backend is down', e));
```

### CORS errors

- Ensure backend allows frontend origin
- Check browser console for specific error
- Verify API_BASE_URL is correct

### Data not updating

```typescript
// Invalidate React Query cache
queryClient.invalidateQueries(['attractions']);

// Force refetch
refetch();
```

---

## 📈 Performance Tips

1. **Implement pagination** for large datasets
2. **Use debounce** for search inputs
3. **Cache aggressively** for static data
4. **Lazy load** images
5. **Bundle split** by route

---

**This API documentation is designed to be:**
- 📖 Comprehensive and clear
- 🔄 Easy to implement
- 🧪 Ready for testing
- 🚀 Production-grade
- 🎯 Developer-friendly

For backend implementation, share this document with your backend team!
