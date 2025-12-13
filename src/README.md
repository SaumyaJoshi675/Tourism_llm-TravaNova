# 🏔️ Uttarakhand Tourism LLM - Frontend

A stunning, production-ready frontend for an AI-powered tourism assistant for Uttarakhand, designed for national hackathon presentation.

## ✨ Features

### 🎯 Core Functionality
- **AI Chat Assistant**: ChatGPT-like interface with real-time responses, typing indicators, and source citations
- **Interactive Map Explorer**: Pinned attractions with detailed information, filtering by category
- **Smart Itinerary Builder**: Drag-and-drop timeline with AI-powered generation
- **Events & Festivals**: Filterable calendar of cultural events and celebrations
- **User Dashboard**: Analytics, saved places, and travel history
- **Settings Panel**: Theme switching (Light/Dark/Glass), language toggle (English/Hindi)

### 🎨 Design Features
- **Glassmorphism UI**: Beautiful frosted glass effects with backdrop blur
- **Smooth Animations**: Motion effects using Framer Motion
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark Mode**: Full dark mode support with smooth transitions
- **Micro-interactions**: Hover effects, scale animations, and transitions

### 🛠️ Technical Stack
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS v4** for styling
- **Motion (Framer Motion)** for animations
- **React Query** for API state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

This connects to your FastAPI backend. If the backend is unavailable, the app uses mock data automatically.

## 🗂️ Project Structure

```
/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx          # Navigation bar with routing
│   ├── map/
│   │   └── MapView.tsx         # Interactive map component
│   └── ui/
│       ├── GlassCard.tsx       # Reusable glassmorphic card
│       └── Button.tsx          # Animated button component
├── contexts/
│   ├── ThemeContext.tsx        # Theme management (light/dark/glass)
│   └── LanguageContext.tsx     # i18n support (English/Hindi)
├── hooks/
│   └── useAPI.ts               # API hooks with React Query
├── pages/
│   ├── Home.tsx                # Landing page with hero section
│   ├── ChatAssistant.tsx       # AI chat interface
│   ├── MapExplorer.tsx         # Interactive map page
│   ├── ItineraryBuilder.tsx    # Itinerary creation tool
│   ├── EventsFestivals.tsx     # Events listing
│   ├── Dashboard.tsx           # User analytics dashboard
│   └── Settings.tsx            # User settings page
├── styles/
│   └── globals.css             # Global styles and animations
└── App.tsx                     # Main app with routing
```

## 🎯 API Integration

The frontend expects the following API endpoints from your FastAPI backend:

### Chat Endpoint
```
POST /chat
Body: { "query": "string" }
Response: {
  "response": "string",
  "sources": [{ "name": "string", "url": "string" }],
  "suggestions": ["string"]
}
```

### Attractions Endpoint
```
GET /attractions
Response: [{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "latitude": number,
  "longitude": number,
  "image": "string",
  "rating": number,
  "bestTime": "string",
  "activities": ["string"]
}]
```

### Events Endpoint
```
GET /events
Response: [{
  "id": "string",
  "name": "string",
  "date": "string",
  "location": "string",
  "description": "string",
  "category": "string",
  "month": number
}]
```

### Routes Endpoint
```
GET /routes
Response: [{
  "id": "string",
  "name": "string",
  "places": ["string"],
  "duration": "string",
  "distance": "string"
}]
```

### Itinerary Generation Endpoint
```
POST /plan
Body: {
  "destination": "string",
  "duration": number,
  "budget": "string"
}
Response: {
  "days": [{
    "day": number,
    "title": "string",
    "activities": [{
      "time": "string",
      "activity": "string",
      "location": "string"
    }]
  }],
  "totalCost": "string",
  "tips": ["string"]
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald to Blue gradient (#10b981 → #3b82f6)
- **Nature**: Emerald/Teal tones
- **Adventure**: Orange/Red tones
- **Spiritual**: Purple/Pink tones
- **Wildlife**: Amber tones

### Typography
- Clean, modern sans-serif fonts
- Responsive sizing with Tailwind utilities
- Font weights: 400 (normal), 500 (medium)

### Animations
- Page transitions with Motion
- Hover scale effects (1.05)
- Tap scale effects (0.95)
- Smooth color transitions (200ms)
- Custom floating animations for hero elements

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL`

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 🎭 Features Showcase

### 1. Landing Page
- Stunning hero with parallax background
- Animated statistics cards
- Feature highlights with gradient icons
- Smooth scroll indicators

### 2. AI Chat
- Real-time message streaming
- Typing indicators
- Source citations
- Quick action buttons
- Image and voice input support (UI ready)

### 3. Map Explorer
- Custom map visualization
- Animated attraction pins
- Detailed attraction cards
- Category filtering
- Add to itinerary functionality

### 4. Itinerary Builder
- Drag-and-drop activities
- AI-powered generation
- Day-by-day timeline
- Cost calculator
- Export to PDF (ready)
- Share link generation (ready)

### 5. Events & Festivals
- Month-based filtering
- Category badges
- Timeline slider
- Responsive card grid

### 6. Dashboard
- Query activity charts
- Interest distribution pie chart
- Recent itineraries
- Saved places

### 7. Settings
- Theme switcher (Light/Dark/Glass)
- Language toggle (English/Hindi)
- Notification preferences
- Privacy settings

## 🏆 Hackathon Presentation Tips

### Demo Flow
1. Start with stunning landing page
2. Show AI chat with intelligent responses
3. Demonstrate map exploration
4. Build an itinerary live
5. Show events calendar
6. Display dashboard analytics
7. Switch themes for wow effect

### Key Talking Points
- **Fine-tuned LLM** integration with RAG pipeline
- **Real-time** AI responses with source citations
- **Intelligent** itinerary generation
- **Beautiful UI** with glassmorphism and animations
- **Responsive** design for all devices
- **Accessible** with i18n support

## 🔮 Future Enhancements

- [ ] Real Mapbox/Leaflet integration
- [ ] Multi-language support (expand beyond Hindi)
- [ ] Voice input integration
- [ ] Image upload for multimodal queries
- [ ] PDF export for itineraries
- [ ] Social sharing integration
- [ ] Offline mode with PWA
- [ ] Real-time collaboration on itineraries

## 📄 License

MIT License - Built for educational and hackathon purposes.

## 🤝 Contributing

This is a prototype built for a hackathon. Feel free to fork and enhance!

---

**Built with ❤️ for Uttarakhand Tourism**
