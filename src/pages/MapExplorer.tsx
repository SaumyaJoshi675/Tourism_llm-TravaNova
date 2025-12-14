import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, Sparkles, RefreshCw, Database, Compass } from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '../components/ui/GlassCard';
import InteractiveMap from '../components/map/InteractiveMap';
import { sampleAttractions, Attraction } from '../data/attractionsData';
import { fetchIndianTouristPlaces } from '../services/serpApiService';

export default function MapExplorer() {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [attractions, setAttractions] = useState<Attraction[]>(sampleAttractions);
  const [usingSerpAPI, setUsingSerpAPI] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Heritage', 'Temple', 'Adventure', 'Nature', 'Beach', 'Wildlife'];

  const filteredAttractions = attractions.filter((attraction) => {
    const matchesCategory = selectedCategory === 'All' || attraction.category === selectedCategory;
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToItinerary = (attraction: Attraction) => {
    toast.success(`${attraction.name} added to your itinerary!`, {
      description: 'View your complete itinerary in the Planner section',
      icon: <Sparkles className="w-4 h-4" />,
    });
  };

  const toggleDataSource = async () => {
    if (!usingSerpAPI) {
      // Switch to SerpAPI
      setLoading(true);
      toast.loading('Fetching real-time data from Google Maps...', { id: 'serp-loading' });

      try {
        const serpPlaces = await fetchIndianTouristPlaces();
        if (serpPlaces.length > 0) {
          setAttractions(serpPlaces);
          setUsingSerpAPI(true);
          toast.success(`Loaded ${serpPlaces.length} places from SerpAPI!`, {
            id: 'serp-loading',
            description: 'Real-time data from Google Maps'
          });
        } else {
          toast.error('No places found. Using static data.', { id: 'serp-loading' });
        }
      } catch (error) {
        console.error('SerpAPI error:', error);
        toast.error('Failed to fetch from SerpAPI. Using static data.', {
          id: 'serp-loading',
          description: 'Check your API key and internet connection'
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Switch back to static data
      setAttractions(sampleAttractions);
      setUsingSerpAPI(false);
      toast.success('Switched to static data (86 curated places)');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-w-[1920px] mx-auto px-4 py-4">
      <div className="h-full flex flex-col gap-3">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 items-center justify-between"
        >
          {/* Left: Live Data Badge (only when active) */}
          <div className="flex gap-2">
            {usingSerpAPI && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 animate-pulse" />
                  <div>
                    <p className="text-xs opacity-90">Data Source</p>
                    <p className="text-sm font-bold">Live • Google Maps</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
            {/* SerpAPI Toggle Button - Icon Only */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDataSource}
              disabled={loading}
              title={loading ? 'Loading...' : usingSerpAPI ? 'Switch to Static Data' : 'Use Live Data from Google Maps'}
              className={`p-3 rounded-xl font-medium transition-all shadow-lg ${usingSerpAPI
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-emerald-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-xl border border-slate-200 dark:border-slate-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : usingSerpAPI ? (
                <Database className="w-5 h-5" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
            </motion.button>

            {/* Search */}
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard hover={false} className="border-0 shadow-md">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Filter by category
                </span>
                {selectedCategory !== 'All' && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({filteredAttractions.length} results)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryColors: Record<string, string> = {
                    'Heritage': '#dc2626',
                    'Temple': '#9333ea',
                    'Adventure': '#ea580c',
                    'Nature': '#16a34a',
                    'Beach': '#0ea5e9',
                    'Wildlife': '#65a30d',
                  };

                  const count = category === 'All'
                    ? attractions.length
                    : attractions.filter(a => a.category === category).length;

                  return (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md ${selectedCategory === category
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      {category !== 'All' && (
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${selectedCategory === category ? 'bg-white' : ''
                            }`}
                          style={{
                            backgroundColor: selectedCategory === category ? 'white' : categoryColors[category]
                          }}
                        />
                      )}
                      <span>{category}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === category
                          ? 'bg-white/20'
                          : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Map with Loading State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-h-0 relative"
        >
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl"
              >
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-3" />
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Loading places...</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Fetching from Google Maps</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <InteractiveMap
            attractions={filteredAttractions}
            selectedAttraction={selectedAttraction}
            onAttractionSelect={setSelectedAttraction}
            onAddToItinerary={handleAddToItinerary}
          />
        </motion.div>
      </div>
    </div>
  );
}
