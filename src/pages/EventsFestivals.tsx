import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Tag, Plus, ChevronLeft, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { useEvents } from '../hooks/useAPI';
import { toast } from 'sonner';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categoryColors: Record<string, string> = {
  Religious: 'from-purple-500 to-pink-500',
  Cultural: 'from-blue-500 to-cyan-500',
  Adventure: 'from-orange-500 to-red-500',
  Music: 'from-emerald-500 to-teal-500',
  Nature: 'from-green-500 to-emerald-500',
};

export default function EventsFestivals() {
  const { data: events, isLoading } = useEvents();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique states from events, sorted alphabetically
  const states = useMemo(() => {
    const uniqueStates = Array.from(new Set(events?.map((e: any) => e.state || 'Uttarakhand') || []));
    return ['All', ...uniqueStates.sort()];
  }, [events]);

  const categories = ['All', 'Religious', 'Cultural', 'Adventure', 'Music', 'Nature'];

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return events?.filter((event: any) => {
      const matchesMonth = selectedMonth === -1 || event.month === selectedMonth + 1;
      const matchesState = selectedState === 'All' || (event.state || 'Uttarakhand') === selectedState;
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesMonth && matchesState && matchesCategory;
    });
  }, [events, selectedMonth, selectedState, selectedCategory]);

  // Heatmap Logic: Calculate event count for each month based on current State/Category filters
  const getEventCountForMonth = (monthIdx: number) => {
    return events?.filter((event: any) => {
      const matchesState = selectedState === 'All' || (event.state || 'Uttarakhand') === selectedState;
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesState && matchesCategory && event.month === monthIdx + 1;
    }).length || 0;
  };

  // Dynamic Banner Logic: Find the most significant upcoming event
  const upcomingHighlight = useMemo(() => {
    if (!events) return null;

    // Filter pertinent events (respecting State filter only, ignoring Month to find upcoming)
    const candidates = events.filter((e: any) =>
      selectedState === 'All' || (e.state || 'Uttarakhand') === selectedState
    );

    // Sort by Date (nearest future) and Significance
    // For this demo, we'll prioritize Significance then Date
    return candidates.sort((a: any, b: any) => {
      const sigOrder: Record<string, number> = { International: 3, National: 2, State: 1, Local: 0 };
      const sigA = sigOrder[a.significanceLevel] || 0;
      const sigB = sigOrder[b.significanceLevel] || 0;
      return sigB - sigA; // Descending significance
    })[0];
  }, [events, selectedState]);


  const handleAddToPlan = (event: any) => {
    toast.success(`${event.name} has been added to your itinerary!`);
  };

  const nextMonth = () => {
    setSelectedMonth((prev) => (prev + 1) % 12);
  };

  const prevMonth = () => {
    setSelectedMonth((prev) => (prev - 1 + 12) % 12);
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
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Events & Festivals</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Discover cultural celebrations and events across {selectedState === 'All' ? 'India' : selectedState}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* State Filter (Dropdown) */}
        <div className="lg:col-span-1">
          <GlassCard hover={false} className="h-full">
            <div className="p-6 h-full flex flex-col justify-center">
              <label className="text-sm text-slate-500 mb-2 block">Select Region</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {states.map((state: any) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Month Timeline Slider with Heatmap */}
        <div className="lg:col-span-3">
          <GlassCard hover={false} className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Select Month</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedMonth(-1)}
                    className={`flex-shrink-0 px-6 py-3 rounded-xl transition-all ${selectedMonth === -1
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    All Year
                  </button>
                  {months.map((month, idx) => {
                    const count = getEventCountForMonth(idx);
                    const intensity = count > 2 ? 'bg-red-500' : count > 0 ? 'bg-emerald-500' : '';

                    return (
                      <motion.button
                        key={month}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMonth(idx)}
                        className={`relative flex-shrink-0 px-6 py-3 rounded-xl transition-all ${selectedMonth === idx
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                        {month}
                        {/* Heatmap Indicator */}
                        {intensity && (
                          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${intensity}`} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Category Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="p-6">
          <h3 className="text-lg mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedCategory === category
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

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event: any, idx: number) => (
            <GlassCard key={event.id} delay={idx * 0.1}>
              <div className="p-6">
                {/* Header: Category Badge + Region Type */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[event.category] || 'from-slate-500 to-slate-600'
                      } text-white text-sm`}
                  >
                    <Tag className="w-3 h-3" />
                    {event.category}
                  </div>
                  {event.regionType && (
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {event.regionType}
                    </span>
                  )}
                </div>

                {/* Event Name */}
                <h3 className="text-xl mb-3 font-semibold">{event.name}</h3>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                {/* Footer: Significance + CTA */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {event.significanceLevel === 'International' && (
                    <div className="flex items-center gap-1 text-xs text-amber-500 mb-3 font-medium">
                      <Sparkles className="w-3 h-3" /> International Event
                    </div>
                  )}
                  <Button
                    onClick={() => handleAddToPlan(event)}
                    variant="outline"
                    className="w-full"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add to Plan
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xl text-slate-600 dark:text-slate-400">
              No events found for {selectedMonth >= 0 ? months[selectedMonth] : 'selected filters'} in {selectedState}.
            </p>
            <p className="text-sm text-slate-500 mt-2">Try selecting a different month or state.</p>
          </div>
        )}
      </div>

      {/* Dynamic Featured Event Banner */}
      {upcomingHighlight && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <GlassCard hover={false}>
            <div className="p-8 text-center relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-full bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl -z-10" />

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-4 shadow-lg shadow-orange-500/20">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Upcoming Highlight</span>
              </div>
              <h2 className="text-2xl md:text-4xl mb-3 font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                {upcomingHighlight.name}
              </h2>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingHighlight.location}, {upcomingHighlight.state}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(upcomingHighlight.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
                {upcomingHighlight.description}
              </p>
              <Button size="lg" className="min-w-[200px]" onClick={() => handleAddToPlan(upcomingHighlight)}>Add to Plan</Button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
