# 🗺️ Interactive Map Feature - TravaNova

## Overview
A unique, feature-rich interactive map integration for the TravaNova tourism website, built with **Leaflet** and **React-Leaflet**. This map provides an immersive experience for exploring tourist destinations across India.

## ✨ Features Implemented

### 1. **Interactive 3D-Style Map with Custom Styling**
- Beautiful custom markers with category-based colors
- Animated pin-drop markers with bounce effects
- Pulsing animations for selected attractions
- Smooth hover effects and transitions

### 2. **Animated Markers**
- Custom SVG-based markers with gradient backgrounds
- Category-specific colors:
  - 🟣 **Temple**: Purple (`#9333ea`)
  - 🟠 **Adventure**: Orange (`#ea580c`)
  - 🟢 **Nature**: Green (`#16a34a`)
  - 🔵 **Beach**: Blue (`#0ea5e9`)
  - 🔴 **Heritage**: Red (`#dc2626`)
  - 🟡 **Wildlife**: Lime (`#65a30d`)
- Bounce animation for selected markers
- Ping effect for active selections

### 3. **Cluster Support**
- Installed `leaflet.markercluster` for grouping nearby attractions
- Prevents map clutter when zoomed out
- Smooth cluster expansion on zoom

### 4. **Route Planning**
- Click "Route Planning" to enable route mode
- Select multiple attractions to create a route
- Visual polyline connecting selected destinations
- Dashed blue line with smooth animations
- Route counter showing number of stops
- "Clear Route" button to reset

### 5. **Heat Map Visualization**
- Toggle heat map to see popular destinations
- Circle overlays with opacity based on popularity
- Orange gradient indicating tourist hotspots
- Helps identify trending locations

### 6. **Custom Map Themes**
Four beautiful map styles to choose from:
- **Standard**: Classic OpenStreetMap view
- **Satellite**: High-resolution satellite imagery (Esri)
- **Terrain**: Topographic map showing elevation (OpenTopoMap)
- **Dark**: Sleek dark mode map (CartoDB Dark)

## 🎨 UI/UX Highlights

### Floating Control Panel
- Glassmorphism design with backdrop blur
- Smooth slide-in animations
- Collapsible controls to maximize map space
- Theme selector with icon indicators
- Feature toggles for Route and Heat Map

### Attraction Detail Cards
- Slide-in animation from the right
- High-quality images with overlay badges
- Rating display with star icons
- Best time to visit information
- Activity tags with color coding
- "Add to Trip" and "Add to Route" buttons

### Map Legend
- Bottom-left positioned legend
- Category color indicators
- Clean, minimal design
- Dark mode compatible

### Responsive Design
- Fully responsive on all screen sizes
- Touch-friendly controls for mobile
- Optimized marker sizes for different viewports

## 📦 Dependencies Installed

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.12",
  "leaflet.markercluster": "^1.5.3",
  "leaflet-routing-machine": "^3.2.12",
  "leaflet.heat": "^0.2.0"
}
```

## 🚀 Usage

### Basic Implementation

```tsx
import InteractiveMap from '../components/map/InteractiveMap';
import { sampleAttractions } from '../data/attractionsData';

function MapPage() {
  const [selected, setSelected] = useState(null);

  return (
    <InteractiveMap
      attractions={sampleAttractions}
      selectedAttraction={selected}
      onAttractionSelect={setSelected}
      onAddToItinerary={(attraction) => {
        console.log('Added:', attraction);
      }}
    />
  );
}
```

### Data Structure

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
  popularity?: number; // 0-100 for heat map
}
```

## 🎯 Sample Data

The map comes with **12 pre-loaded attractions** across India:
- Taj Mahal (Agra)
- Hawa Mahal (Jaipur)
- Rishikesh (Uttarakhand)
- Goa Beaches
- Kerala Backwaters
- Golden Temple (Amritsar)
- Manali (Himachal Pradesh)
- Ranthambore National Park
- Varanasi Ghats
- Munnar Tea Gardens
- Jaisalmer Fort
- Andaman Islands

## 🎨 Customization

### Adding New Themes

```typescript
const customTheme = {
  url: 'https://your-tile-server/{z}/{x}/{y}.png',
  attribution: '© Your Attribution'
};
```

### Custom Marker Colors

Edit the `createCustomIcon` function in `InteractiveMap.tsx`:

```typescript
const colors: Record<string, string> = {
  'YourCategory': '#yourcolor',
  // ... more categories
};
```

### Styling

All custom styles are in `src/styles/leaflet-custom.css`:
- Popup styling
- Marker animations
- Control panel design
- Dark mode support

## 🌟 Advanced Features

### Auto-Fit Bounds
The map automatically adjusts to show all attractions when the list changes.

### Smooth Transitions
All map movements use smooth animations for better UX.

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible

### Performance
- Optimized marker rendering
- Lazy loading for images
- Efficient re-renders with React hooks

## 🔧 Configuration

### Map Center & Zoom
Default center is set to Delhi (28.6139, 77.2090) with zoom level 8.
Adjust in `InteractiveMap.tsx`:

```typescript
const center: [number, number] = [latitude, longitude];
const zoom = 10; // Adjust zoom level
```

### Marker Icon Size
Modify in `createCustomIcon`:

```typescript
const size = isSelected ? 45 : 35; // pixels
```

## 📱 Mobile Optimization

- Touch-friendly controls
- Responsive breakpoints
- Optimized marker clustering for mobile
- Swipe gestures for map navigation

## 🎭 Animations

1. **Marker Drop**: Staggered entrance with random delays
2. **Bounce**: Active marker bounces continuously
3. **Ping**: Expanding circle for selected markers
4. **Slide-in**: Detail cards slide from right
5. **Fade**: Smooth opacity transitions

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Future Enhancements

Potential additions (not yet implemented):
- Real-time traffic data
- Weather overlay
- 3D building views
- Street view integration
- User location tracking
- Offline map support
- Custom route optimization
- Multi-day itinerary planning

## 🐛 Troubleshooting

### Markers not showing
- Check if Leaflet CSS is imported in `main.tsx`
- Verify marker icon URLs are accessible

### Map not rendering
- Ensure container has defined height
- Check console for tile loading errors

### Performance issues
- Enable marker clustering for large datasets
- Reduce marker icon sizes
- Limit visible attractions with filters

## 📄 License

Part of the TravaNova tourism platform.

---

**Built with ❤️ for TravaNova Tourism Platform**
