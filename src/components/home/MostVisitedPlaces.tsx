import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, X, Plus, Navigation, Sparkles, Camera } from 'lucide-react';
import { mostVisitedPlaces, MostVisitedPlace } from '../../data/mostVisitedPlaces';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MostVisitedPlaces() {
  const [selectedPlace, setSelectedPlace] = useState<MostVisitedPlace | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400">Most Popular</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Most Visited Places Across India
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Discover the breathtaking destinations that captivate thousands of travelers
        </p>
      </motion.div>

      {/* Places Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {mostVisitedPlaces.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setHoveredCard(place.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="cursor-pointer h-full"
              onClick={() => setSelectedPlace(place)}
            >
              <GlassCard hover={false} className="h-full overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-xs">
                    {place.category}
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === place.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-blue-600/90 flex items-center justify-center"
                  >
                    <div className="text-white text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">View Details</p>
                    </div>
                  </motion.div>
                </div>

                <div className="p-4">
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wider">
                    {place.state}
                  </div>
                  <h3 className="text-xl mb-2">{place.name}</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">
                    {place.tagline}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{place.bestSeason}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full group/btn"
                      onClick={() => navigate('/map')}
                    >
                      <Navigation className="w-4 h-4 mr-2 group-hover/btn:rotate-45 transition-transform" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Mini Map */}
      <MiniMap
        places={mostVisitedPlaces}
        hoveredId={hoveredCard}
        onPlaceHover={setHoveredCard}
        onPlaceClick={setSelectedPlace}
      />

      {/* Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </section>
  );
}

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon issues in React
// We are using custom DivIcons mainly, but good to have standard fix if we fallback
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle bounds fitting
function MapBounds({ places }: { places: MostVisitedPlace[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const bounds = L.latLngBounds(places.map(p => [p.latitude, p.longitude]));
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 6,
    });
  }, [places, map]);

  return null;
}

// Mini Map Component
function MiniMap({
  places,
  hoveredId,
  onPlaceHover,
  onPlaceClick
}: {
  places: MostVisitedPlace[];
  hoveredId: string | null;
  onPlaceHover: (id: string | null) => void;
  onPlaceClick: (place: MostVisitedPlace) => void;
}) {

  // Custom marker icon creation function
  const createCustomIcon = (isHovered: boolean, placeName: string) => {
    // We use a divIcon to render our custom HTML/CSS
    // This mimics the exact style of the previous static map markers
    const colorClass = isHovered
      ? 'bg-gradient-to-br from-emerald-400 to-blue-500 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-125'
      : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]';

    const pulseHtml = isHovered
      ? `<div class="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>`
      : '';

    const labelHtml = isHovered
      ? `<div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 whitespace-nowrap z-50">
           <div class="px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg shadow-xl relative">
             ${placeName}
             <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-1px] border-4 border-transparent border-b-slate-900"></div>
           </div>
         </div>`
      : '';

    return L.divIcon({
      className: 'custom-map-marker', // Minimal leaflet class interactions
      html: `
        <div class="relative w-full h-full flex items-center justify-center transition-all duration-300 ${colorClass} rounded-full">
          ${pulseHtml}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-5 h-5 relative z-10"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${labelHtml}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20], // Center it
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12"
    >
      <GlassCard>
        <div className="p-6">
          <h3 className="text-2xl mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Interactive Location Map
          </h3>

          <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 z-0">
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India
              zoom={5}
              scrollWheelZoom={false} // Keep it embedded feel
              className="w-full h-full"
              attributionControl={false}
            >
              {/* Dark Matter Tiles for the requested aesthetic */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />

              {/* Overlay Layer: Labels, Borders, and Place Names */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              />

              {/* Theme Overlay to blend with app aesthetics */}
              <div className="leaflet-bottom leaflet-left" style={{ pointerEvents: 'none', width: '100%', height: '100%', zIndex: 400 }}>
                <div className="w-full h-full bg-emerald-900/10 mix-blend-overlay"></div>
              </div>

              <MapBounds places={places} />

              {places.map((place) => {
                const isHovered = hoveredId === place.id;

                return (
                  <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                    icon={createCustomIcon(isHovered, place.name)}
                    eventHandlers={{
                      click: () => onPlaceClick(place),
                      mouseover: () => onPlaceHover(place.id),
                      mouseout: () => onPlaceHover(null),
                    }}
                  >
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500" />
              <span>Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
              <span>Highlighted</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Place Detail Modal
function PlaceDetailModal({
  place,
  onClose
}: {
  place: MostVisitedPlace | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);

  useEffect(() => {
    if (place) {
      setSelectedGalleryImage(0);
    }
  }, [place]);

  if (!place) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={place.gallery[selectedGalleryImage]}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-emerald-300 font-medium mb-1 uppercase tracking-wider text-sm">{place.state}</div>
              <h2 className="text-3xl md:text-4xl text-white mb-2">{place.name}</h2>
              <p className="text-emerald-300 text-lg">{place.tagline}</p>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
            {place.gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedGalleryImage(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${selectedGalleryImage === index
                  ? 'ring-2 ring-emerald-500 scale-105'
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <img src={img} alt={`${place.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quick Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Best Season</p>
                  <p className="font-medium">{place.bestSeason}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
                  <p className="font-medium">{place.category}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl mb-3">About</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {place.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-xl mb-3">Highlights</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {place.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div>
              <h3 className="text-xl mb-3">Popular Activities</h3>
              <div className="flex flex-wrap gap-2">
                {place.popularActivities.map((activity, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full text-sm"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Travel Tip */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1 text-amber-900 dark:text-amber-200">Travel Tip</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300">{place.travelTip}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => {
                  navigate('/itinerary');
                  onClose();
                }}
                className="flex-1"
                icon={<Plus className="w-4 h-4" />}
              >
                Add to Itinerary
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate('/map');
                  onClose();
                }}
                className="flex-1"
                icon={<Navigation className="w-4 h-4" />}
              >
                Explore Nearby
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate('/chat');
                  onClose();
                }}
                className="flex-1"
                icon={<Camera className="w-4 h-4" />}
              >
                Ask AI Guide
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
