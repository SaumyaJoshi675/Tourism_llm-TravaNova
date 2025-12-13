import { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, Search } from 'lucide-react';
import { useAttractions } from '../hooks/useAPI';
import { toast } from 'sonner@2.0.3';
import GlassCard from '../components/ui/GlassCard';
import MapView from '../components/map/MapView';

export default function MapExplorer() {
  const { data: attractions, isLoading } = useAttractions();
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Nature', 'Spiritual', 'Wildlife', 'Adventure', 'City'];

  const filteredAttractions = attractions?.filter((attraction: any) => {
    const matchesCategory = selectedCategory === 'All' || attraction.category === selectedCategory;
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToItinerary = (attraction: any) => {
    toast.success(`${attraction.name} added to your itinerary!`);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] max-w-[1920px] mx-auto px-4 py-6">
      <div className="h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Explore Uttarakhand</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Discover {filteredAttractions?.length || 0} amazing destinations
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filters */}
        <GlassCard hover={false}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Filter by category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Map */}
        <div className="flex-1 min-h-0">
          <GlassCard hover={false} className="h-full">
            <div className="h-full p-4">
              <MapView
                attractions={filteredAttractions || []}
                selectedAttraction={selectedAttraction}
                onAttractionSelect={setSelectedAttraction}
                onAddToItinerary={handleAddToItinerary}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
