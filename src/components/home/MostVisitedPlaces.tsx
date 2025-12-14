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
          Most Visited Places in India
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

                {/* Content */}
                <div className="p-4">
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

          <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            {/* Map Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1717051041791-47c372799618?w=1920)',
                filter: 'brightness(0.6) saturate(1.1)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />
            </div>

            {/* Grid Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
              <defs>
                <pattern id="mini-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mini-grid)" />
            </svg>

            {/* Place Markers */}
            {places.map((place, index) => {
              const pos = getPosition(place.latitude, place.longitude);
              const isHovered = hoveredId === place.id;

              return (
                <motion.div
                  key={place.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="z-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      scale: isHovered ? 1.4 : 1,
                    }}
                    onClick={() => onPlaceClick(place)}
                    onMouseEnter={() => onPlaceHover(place.id)}
                    onMouseLeave={() => onPlaceHover(null)}
                    className="relative"
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl ${isHovered
                        ? 'bg-gradient-to-br from-emerald-400 to-blue-500'
                        : 'bg-gradient-to-br from-orange-500 to-red-500'
                        }`}
                      animate={{
                        boxShadow: isHovered
                          ? '0 0 30px rgba(16, 185, 129, 0.6)'
                          : '0 0 15px rgba(249, 115, 22, 0.4)',
                      }}
                    >
                      <MapPin className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Ping Effect */}
                    {isHovered && (
                      <motion.div
                        animate={{
                          scale: [1, 2.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-emerald-400"
                      />
                    )}

                    {/* Label */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap"
                        >
                          <div className="px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg shadow-xl">
                            {place.name}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-4px]">
                              <div className="border-4 border-transparent border-b-slate-900" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              );
            })}
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
