import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  TrendingUp,
  MapPin,
  ArrowRight,
  Star
} from 'lucide-react';
import { moods, moodBasedDestinations, Mood, MoodDestination } from '../../data/moodBasedTrips';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MoodBasedTrips() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMoodClick = (moodId: string) => {
    setSelectedMood(selectedMood === moodId ? null : moodId);
  };

  const selectedDestinations = selectedMood 
    ? moodBasedDestinations[selectedMood] 
    : null;

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span className="text-sm text-pink-600 dark:text-pink-400">Personalized AI Suggestions</span>
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          A Trip Based on Your Mood
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Tell us how you feel, and we'll curate the perfect Uttarakhand experience for you
        </p>
      </motion.div>

      {/* Mood Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
        {moods.map((mood, index) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(mood.id)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`w-full relative group ${
                selectedMood === mood.id ? 'z-10' : ''
              }`}
            >
              <GlassCard 
                hover={false}
                className={`transition-all duration-300 ${
                  selectedMood === mood.id
                    ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                    : ''
                }`}
                style={{
                  borderColor: selectedMood === mood.id 
                    ? `rgb(${mood.color === 'bg-blue-500' ? '59, 130, 246' : 
                         mood.color === 'bg-orange-500' ? '249, 115, 22' :
                         mood.color === 'bg-purple-500' ? '168, 85, 247' :
                         mood.color === 'bg-pink-500' ? '236, 72, 153' :
                         mood.color === 'bg-green-500' ? '34, 197, 94' :
                         mood.color === 'bg-yellow-500' ? '234, 179, 8' :
                         '99, 102, 241'})`
                    : undefined
                }}
              >
                <div className="p-4 text-center">
                  {/* Emoji */}
                  <motion.div
                    animate={{
                      scale: selectedMood === mood.id || hoveredMood === mood.id ? 1.2 : 1,
                      rotate: selectedMood === mood.id ? [0, -10, 10, -10, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl mb-3"
                  >
                    {mood.emoji}
                  </motion.div>

                  {/* Name */}
                  <h3 className="text-sm mb-2 leading-tight">{mood.name}</h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    {mood.description}
                  </p>

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedMood === mood.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`mt-3 w-6 h-6 mx-auto rounded-full bg-gradient-to-br ${mood.gradient} flex items-center justify-center`}
                      >
                        <Star className="w-3 h-3 text-white fill-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>

              {/* Gradient Glow Effect */}
              {(selectedMood === mood.id || hoveredMood === mood.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.gradient} blur-xl -z-10`}
                />
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Selected Mood Destinations */}
      <AnimatePresence mode="wait">
        {selectedMood && selectedDestinations && (
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mood Header */}
            <div className="mb-8">
              <GlassCard>
                <div className="p-6 text-center">
                  <div className="text-5xl mb-3">
                    {moods.find(m => m.id === selectedMood)?.emoji}
                  </div>
                  <h3 className="text-2xl mb-2">
                    {moods.find(m => m.id === selectedMood)?.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Here are our AI-curated recommendations for your mood
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Destination Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDestinations.map((destination, index) => (
                <DestinationCard
                  key={index}
                  destination={destination}
                  mood={moods.find(m => m.id === selectedMood)!}
                  index={index}
                  onPlanTrip={() => navigate('/itinerary')}
                />
              ))}
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <Button
                size="lg"
                onClick={() => navigate('/chat')}
                icon={<Sparkles className="w-5 h-5" />}
              >
                Get More AI Recommendations
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!selectedMood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-7xl mb-6"
          >
            🎭
          </motion.div>
          <h3 className="text-2xl mb-3 text-slate-700 dark:text-slate-300">
            Select Your Mood
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Choose how you're feeling above, and we'll show you the perfect destinations that match your vibe
          </p>
        </motion.div>
      )}
    </section>
  );
}

// Destination Card Component
function DestinationCard({
  destination,
  mood,
  index,
  onPlanTrip,
}: {
  destination: MoodDestination;
  mood: Mood;
  index: number;
  onPlanTrip: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const difficultyColors = {
    Easy: 'from-green-500 to-emerald-500',
    Moderate: 'from-yellow-500 to-orange-500',
    Challenging: 'from-red-500 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -8 }}
        className="h-full"
      >
        <GlassCard hover={false} className="h-full overflow-hidden group">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${mood.gradient} text-white text-xs shadow-lg flex items-center gap-1.5`}>
                <span>{mood.emoji}</span>
                <span className="font-medium">{mood.name}</span>
              </div>
              
              <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${difficultyColors[destination.difficulty]} text-white text-xs shadow-lg font-medium`}>
                {destination.difficulty}
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl text-white mb-1">{destination.name}</h3>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Clock className="w-4 h-4" />
                <span>{destination.duration}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Reason */}
            <div>
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Why this matches your mood</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {destination.reason}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-medium">Highlights</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pl-6">
                {destination.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={onPlanTrip}
                className="flex-1 text-sm"
                size="sm"
              >
                Plan This Trip
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/map')}
                className="flex-1 text-sm"
                size="sm"
                icon={<MapPin className="w-3.5 h-3.5" />}
              >
                View Map
              </Button>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} pointer-events-none`}
              />
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
