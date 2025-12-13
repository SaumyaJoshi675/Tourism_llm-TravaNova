# 📦 Component Documentation

## Overview
This document provides detailed information about all reusable components in the Uttarakhand Tourism LLM frontend.

---

## 🎨 UI Components

### GlassCard
**Path:** `/components/ui/GlassCard.tsx`

A reusable glassmorphic card component with backdrop blur and subtle animations.

**Props:**
- `children: ReactNode` - Content to render inside the card
- `className?: string` - Additional CSS classes
- `hover?: boolean` - Enable hover animation (default: true)
- `delay?: number` - Animation delay in seconds (default: 0)

**Usage:**
```tsx
<GlassCard hover={true} delay={0.2} className="p-6">
  <h3>Card Content</h3>
</GlassCard>
```

**Features:**
- Automatic glassmorphism effect
- Smooth entrance animation
- Optional hover lift effect
- Staggered animation delays for grids

---

### Button
**Path:** `/components/ui/Button.tsx`

An animated button component with multiple variants and sizes.

**Props:**
- `children: ReactNode` - Button text/content
- `onClick?: () => void` - Click handler
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disable state
- `type?: 'button' | 'submit' | 'reset'` - HTML button type
- `icon?: ReactNode` - Optional icon element

**Usage:**
```tsx
<Button 
  onClick={handleClick} 
  variant="primary" 
  size="lg"
  icon={<Sparkles className="w-5 h-5" />}
>
  Generate Itinerary
</Button>
```

**Variants:**
- `primary`: Gradient background (emerald to blue)
- `secondary`: Solid background
- `outline`: Border with transparent background
- `ghost`: No background, subtle hover

---

## 🗺️ Map Components

### MapView
**Path:** `/components/map/MapView.tsx`

Interactive map component displaying tourist attractions with clickable pins.

**Props:**
- `attractions: Attraction[]` - Array of attraction objects
- `selectedAttraction: Attraction | null` - Currently selected attraction
- `onAttractionSelect: (attraction: Attraction | null) => void` - Selection handler
- `onAddToItinerary: (attraction: Attraction) => void` - Add to itinerary handler

**Attraction Interface:**
```typescript
interface Attraction {
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
}
```

**Usage:**
```tsx
<MapView
  attractions={attractions}
  selectedAttraction={selected}
  onAttractionSelect={setSelected}
  onAddToItinerary={handleAdd}
/>
```

**Features:**
- Animated attraction pins
- Hover tooltips
- Detailed attraction cards
- Pin animations for selected items
- Responsive sidebar panel

**Note:** Current implementation uses CSS positioning for simplicity. In production, integrate with Mapbox or Leaflet for real map tiles.

---

## 🧭 Layout Components

### Navbar
**Path:** `/components/layout/Navbar.tsx`

Responsive navigation bar with routing and theme support.

**Features:**
- Sticky positioning
- Backdrop blur effect
- Active route highlighting
- Mobile responsive menu
- Smooth animations
- Gradient logo with rotation on hover

**Navigation Items:**
- Home
- AI Assistant
- Explore Map
- Build Itinerary
- Events & Festivals
- Dashboard
- Settings

**Usage:**
Automatically included in App.tsx layout. No props required.

---

## 🌐 Context Providers

### ThemeContext
**Path:** `/contexts/ThemeContext.tsx`

Manages application theme state with persistence.

**Hook: `useTheme()`**

**Returns:**
- `theme: 'light' | 'dark' | 'glass'` - Current theme
- `setTheme: (theme: Theme) => void` - Theme setter

**Usage:**
```tsx
const { theme, setTheme } = useTheme();

<button onClick={() => setTheme('dark')}>
  Dark Mode
</button>
```

**Themes:**
- `light`: Clean white background
- `dark`: Dark slate background
- `glass`: Glassmorphism with gradient background

---

### LanguageContext
**Path:** `/contexts/LanguageContext.tsx`

Provides internationalization support (English/Hindi).

**Hook: `useLanguage()`**

**Returns:**
- `language: 'en' | 'hi'` - Current language
- `setLanguage: (lang: Language) => void` - Language setter
- `t: (key: string) => string` - Translation function

**Usage:**
```tsx
const { language, setLanguage, t } = useLanguage();

<h1>{t('hero_title')}</h1>
```

**Translation Keys:**
- `home`, `chat`, `map`, `itinerary`, `events`, `dashboard`, `settings`
- `hero_title`, `hero_subtitle`
- `try_assistant`, `build_itinerary`
- `ai_chat`, `smart_itinerary`, `local_events`, `map_navigation`

---

## 🔧 Custom Hooks

### useAPI Hooks
**Path:** `/hooks/useAPI.ts`

React Query hooks for API interactions with automatic fallback to mock data.

#### useAttractions()
Fetches tourist attractions.

**Returns:**
- `data: Attraction[]` - Array of attractions
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state

**Usage:**
```tsx
const { data: attractions, isLoading } = useAttractions();
```

---

#### useEvents()
Fetches festivals and events.

**Returns:**
- `data: Event[]` - Array of events
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state

**Usage:**
```tsx
const { data: events, isLoading } = useEvents();
```

---

#### useRoutes()
Fetches travel routes.

**Returns:**
- `data: Route[]` - Array of routes
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state

---

#### useChatMessage()
Mutation hook for sending chat messages.

**Returns:**
- `mutateAsync: (message: string) => Promise<Response>` - Async mutation
- `isPending: boolean` - Loading state
- `error: Error | null` - Error state

**Usage:**
```tsx
const chatMutation = useChatMessage();

const handleSend = async () => {
  const response = await chatMutation.mutateAsync(userMessage);
};
```

---

#### useGenerateItinerary()
Mutation hook for AI itinerary generation.

**Returns:**
- `mutateAsync: (data: ItineraryRequest) => Promise<ItineraryResponse>` - Async mutation
- `isPending: boolean` - Loading state

**ItineraryRequest Interface:**
```typescript
interface ItineraryRequest {
  destination: string;
  duration: number;
  budget: 'Low' | 'Medium' | 'High';
}
```

**Usage:**
```tsx
const generateMutation = useGenerateItinerary();

const handleGenerate = async () => {
  const result = await generateMutation.mutateAsync({
    destination: 'Nainital',
    duration: 3,
    budget: 'Medium'
  });
};
```

---

## 📄 Page Components

### Home
**Path:** `/pages/Home.tsx`

Landing page with hero section, features, and CTAs.

**Sections:**
1. Hero with parallax background
2. Animated stats cards
3. Feature grid (4 features)
4. CTA section

---

### ChatAssistant
**Path:** `/pages/ChatAssistant.tsx`

AI chat interface with message history and suggestions.

**Features:**
- Message bubbles with animations
- Typing indicator
- Source citations
- Suggestion chips
- Quick actions sidebar
- Image/voice input buttons (UI ready)

---

### MapExplorer
**Path:** `/pages/MapExplorer.tsx`

Interactive map with attraction filtering.

**Features:**
- Category filters
- Search functionality
- MapView integration
- Add to itinerary action

---

### ItineraryBuilder
**Path:** `/pages/ItineraryBuilder.tsx`

Drag-and-drop itinerary creation tool.

**Features:**
- Day-by-day timeline
- Activity management
- AI generation panel
- Cost calculator
- Export/share buttons
- Nearby attractions sidebar

---

### EventsFestivals
**Path:** `/pages/EventsFestivals.tsx`

Events calendar with month slider.

**Features:**
- Month timeline navigation
- Category filters
- Event cards grid
- Featured event banner

---

### Dashboard
**Path:** `/pages/Dashboard.tsx`

User analytics and activity dashboard.

**Features:**
- Statistics cards
- Query activity bar chart
- Interest distribution pie chart
- Recent itineraries list
- Saved places list

---

### Settings
**Path:** `/pages/Settings.tsx`

Application settings and preferences.

**Sections:**
- Theme selector
- Language toggle
- Notification preferences
- Privacy settings

---

## 🎬 Animation Patterns

### Entrance Animations
All GlassCards use:
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay }}
```

### Hover Animations
All interactive elements use:
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Route Transitions
Page transitions use AnimatePresence with wait mode.

---

## 🎨 Styling Guidelines

### Color Usage
- **Primary Actions**: Gradient from emerald-500 to blue-600
- **Nature/Success**: Emerald/Teal
- **Adventure**: Orange/Red
- **Spiritual**: Purple/Pink
- **Information**: Blue/Cyan

### Spacing
- Cards: `p-6` padding
- Grids: `gap-6` spacing
- Sections: `mb-8` margin

### Border Radius
- Cards: `rounded-2xl`
- Buttons: `rounded-xl`
- Inputs: `rounded-xl`
- Badges: `rounded-full`

---

## 🚀 Performance Tips

1. **Lazy Loading**: Consider code-splitting pages
2. **Image Optimization**: Use Unsplash with width params
3. **Memoization**: Use React.memo for expensive components
4. **Virtual Scrolling**: For long lists in production
5. **Query Caching**: React Query handles this automatically

---

## 🔍 Accessibility

- All interactive elements have proper ARIA labels
- Color contrast ratios meet WCAG AA standards
- Keyboard navigation supported
- Screen reader friendly
- Focus indicators on all focusable elements

---

**Last Updated:** December 2025
