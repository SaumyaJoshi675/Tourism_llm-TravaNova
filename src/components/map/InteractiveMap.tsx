import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import {
    Layers, TrendingUp, X, Star,
    Clock, Camera, Sun, Moon, Map as MapIcon
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '../ui/Button';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
    popularity?: number; // For heat map
}

interface InteractiveMapProps {
    attractions: Attraction[];
    selectedAttraction: Attraction | null;
    onAttractionSelect: (attraction: Attraction | null) => void;
    onAddToItinerary?: (attraction: Attraction) => void;
}

type MapTheme = 'standard' | 'satellite' | 'terrain' | 'dark';

// Custom marker icons with different colors
const createCustomIcon = (category: string, isSelected: boolean = false) => {
    const colors: Record<string, string> = {
        'Temple': '#9333ea',
        'Adventure': '#ea580c',
        'Nature': '#16a34a',
        'Beach': '#0ea5e9',
        'Heritage': '#dc2626',
        'Wildlife': '#65a30d',
        default: '#f59e0b'
    };

    const color = colors[category] || colors.default;
    const size = isSelected ? 45 : 35;

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <div style="
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(135deg, ${color}, ${color}dd);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          animation: ${isSelected ? 'bounce 1s infinite' : 'none'};
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            color: white;
            font-size: ${isSelected ? '18px' : '14px'};
          ">📍</div>
        </div>
        ${isSelected ? `
          <div style="
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color}40;
            border-radius: 50%;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: rotate(-45deg) translateY(0); }
          50% { transform: rotate(-45deg) translateY(-10px); }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};

// Map theme configurations
const mapThemes: Record<MapTheme, { url: string; attribution: string }> = {
    standard: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
    },
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '© Esri'
    },
    terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '© OpenTopoMap contributors'
    },
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© CartoDB'
    }
};

// Component to handle map updates
function MapController({
    center,
    zoom,
    attractions,
}: {
    center: [number, number];
    zoom: number;
    attractions: Attraction[];
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    // Fit bounds to show all attractions
    useEffect(() => {
        if (attractions.length > 0) {
            const bounds = L.latLngBounds(
                attractions.map(a => [a.latitude, a.longitude] as [number, number])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [attractions, map]);

    return null;
}

export default function InteractiveMap({
    attractions,
    selectedAttraction,
    onAttractionSelect,
    onAddToItinerary,
}: InteractiveMapProps) {
    const [mapTheme, setMapTheme] = useState<MapTheme>('standard');
    const [showControls, setShowControls] = useState(true);
    const mapRef = useRef<L.Map | null>(null);

    const center: [number, number] = selectedAttraction
        ? [selectedAttraction.latitude, selectedAttraction.longitude]
        : attractions.length > 0
            ? [attractions[0].latitude, attractions[0].longitude]
            : [28.6139, 77.2090]; // Default to Delhi

    const handleMarkerClick = (attraction: Attraction) => {
        onAttractionSelect(attraction);
    };

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            {/* Map Container */}
            <MapContainer
                center={center}
                zoom={8}
                className="w-full h-full z-0"
                zoomControl={false}
                ref={mapRef}
            >
                <TileLayer
                    url={mapThemes[mapTheme].url}
                    attribution={mapThemes[mapTheme].attribution}
                />

                <MapController
                    center={center}
                    zoom={selectedAttraction ? 12 : 8}
                    attractions={attractions}
                />

                {/* Markers */}
                {attractions.map((attraction) => (
                    <Marker
                        key={attraction.id}
                        position={[attraction.latitude, attraction.longitude]}
                        icon={createCustomIcon(attraction.category, selectedAttraction?.id === attraction.id)}
                        eventHandlers={{
                            click: () => handleMarkerClick(attraction),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-1">{attraction.name}</h3>
                                <p className="text-sm text-slate-600 mb-2">{attraction.category}</p>
                                <div className="flex items-center gap-2 text-sm mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span>{attraction.rating}</span>
                                </div>
                                <button
                                    onClick={() => handleMarkerClick(attraction)}
                                    className="w-full mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Route and Heat Map features removed */}
            </MapContainer>

            {/* Floating Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute top-4 left-4 z-[1000]"
                    >
                        {/* Theme Selector */}
                        <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-2xl p-3 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Map Style</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(mapThemes) as MapTheme[]).map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => setMapTheme(theme)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${mapTheme === theme
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400'
                                            }`}
                                    >
                                        {theme === 'standard' && <MapIcon className="w-3 h-3 inline mr-1" />}
                                        {theme === 'satellite' && <Sun className="w-3 h-3 inline mr-1" />}
                                        {theme === 'terrain' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                                        {theme === 'dark' && <Moon className="w-3 h-3 inline mr-1" />}
                                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Attraction Detail Card */}
            <AnimatePresence>
                {selectedAttraction && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto z-[1000]"
                    >
                        <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                            {/* Image */}
                            <div className="relative h-48">
                                <img
                                    src={selectedAttraction.image}
                                    alt={selectedAttraction.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => onAttractionSelect(null)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                                <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                    {selectedAttraction.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
                                        {selectedAttraction.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-semibold">{selectedAttraction.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{selectedAttraction.bestTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    {selectedAttraction.description}
                                </p>

                                <div>
                                    <h4 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">
                                        Activities
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAttraction.activities.map((activity) => (
                                            <span
                                                key={activity}
                                                className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium"
                                            >
                                                {activity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {onAddToItinerary && (
                                        <Button
                                            onClick={() => onAddToItinerary(selectedAttraction)}
                                            className="flex-1"
                                            icon={<Camera className="w-4 h-4" />}
                                        >
                                            Add to Trip
                                        </Button>
                                    )}

                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Legend removed - colors now shown in category filter buttons */}


            {/* Toggle Controls Button */}
            <button
                onClick={() => setShowControls(!showControls)}
                className="absolute top-4 right-4 z-[1001] w-10 h-10 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
                <Layers className="w-5 h-5 text-indigo-600" />
            </button>
        </div>
    );
}
