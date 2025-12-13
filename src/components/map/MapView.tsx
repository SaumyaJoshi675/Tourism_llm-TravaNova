import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Star, Clock, Camera } from 'lucide-react';
import Button from '../ui/Button';

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

interface MapViewProps {
  attractions: Attraction[];
  selectedAttraction: Attraction | null;
  onAttractionSelect: (attraction: Attraction | null) => void;
  onAddToItinerary: (attraction: Attraction) => void;
}

export default function MapView({
  attractions,
  selectedAttraction,
  onAttractionSelect,
  onAddToItinerary,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Simple map visualization using absolute positioning
  // In production, this would use Mapbox or Leaflet
  const mapBounds = {
    minLat: 29.0,
    maxLat: 31.5,
    minLng: 77.5,
    maxLng: 81.0,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
      {/* Map Background */}
      <div
        ref={mapRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1717051041791-47c372799618?w=1920)',
          filter: 'brightness(0.7) saturate(1.2)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />
      </div>

      {/* Map Overlay Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Attraction Pins */}
      {attractions.map((attraction) => {
        const pos = getPosition(attraction.latitude, attraction.longitude);
        const isSelected = selectedAttraction?.id === attraction.id;
        const isHovered = hoveredPin === attraction.id;

        return (
          <motion.div
            key={attraction.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -100%)',
            }}
            className="z-10"
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAttractionSelect(attraction)}
              onMouseEnter={() => setHoveredPin(attraction.id)}
              onMouseLeave={() => setHoveredPin(null)}
              className="relative"
            >
              {/* Pin */}
              <motion.div
                animate={{
                  y: isSelected ? [0, -10, 0] : 0,
                }}
                transition={{
                  duration: 1,
                  repeat: isSelected ? Infinity : 0,
                }}
                className={`relative ${
                  isSelected
                    ? 'w-12 h-12'
                    : 'w-10 h-10'
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-full ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-400 to-blue-500'
                      : 'bg-gradient-to-br from-red-500 to-orange-500'
                  } shadow-2xl flex items-center justify-center`}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                {/* Ping Animation */}
                {isSelected && (
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-emerald-400"
                  />
                )}
              </motion.div>

              {/* Hover Label */}
              <AnimatePresence>
                {(isHovered || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap"
                  >
                    <div className="px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg shadow-xl">
                      {attraction.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        );
      })}

      {/* Selected Attraction Detail Card */}
      <AnimatePresence>
        {selectedAttraction && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto"
          >
            <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl overflow-hidden">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={selectedAttraction.image}
                  alt={selectedAttraction.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onAttractionSelect(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-slate-900/80 rounded-full flex items-center justify-center hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 rounded-full text-white text-sm">
                  {selectedAttraction.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl mb-2">{selectedAttraction.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{selectedAttraction.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedAttraction.bestTime}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedAttraction.description}
                </p>

                <div>
                  <h4 className="text-sm mb-2 text-slate-600 dark:text-slate-400">Activities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAttraction.activities.map((activity) => (
                      <span
                        key={activity}
                        className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => onAddToItinerary(selectedAttraction)}
                  className="w-full"
                  icon={<Camera className="w-4 h-4" />}
                >
                  Add to Itinerary
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-xl p-4 shadow-xl">
        <h4 className="text-sm mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
            <span>Attractions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
