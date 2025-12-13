import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Tag, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEvents } from '../hooks/useAPI';
import { toast } from 'sonner@2.0.3';
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
};

export default function EventsFestivals() {
  const { data: events, isLoading } = useEvents();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Religious', 'Cultural', 'Adventure', 'Music'];

  const filteredEvents = events?.filter((event: any) => {
    const matchesMonth = selectedMonth === -1 || event.month === selectedMonth + 1;
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  const handleAddToPlan = (event: any) => {
    toast.success(`${event.name} added to your plan!`);
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
          Discover cultural celebrations and events across Uttarakhand
        </p>
      </div>

      {/* Month Timeline Slider */}
      <GlassCard hover={false} className="mb-6">
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
                className={`flex-shrink-0 px-6 py-3 rounded-xl transition-all ${
                  selectedMonth === -1
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Year
              </button>
              {months.map((month, idx) => (
                <motion.button
                  key={month}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMonth(idx)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl transition-all ${
                    selectedMonth === idx
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {month}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

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

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event: any, idx: number) => (
            <GlassCard key={event.id} delay={idx * 0.1}>
              <div className="p-6">
                {/* Category Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${
                    categoryColors[event.category] || 'from-slate-500 to-slate-600'
                  } text-white text-sm mb-4`}
                >
                  <Tag className="w-4 h-4" />
                  {event.category}
                </div>

                {/* Event Name */}
                <h3 className="text-xl mb-3">{event.name}</h3>

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
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                  {event.description}
                </p>

                {/* Add to Plan Button */}
                <Button
                  onClick={() => handleAddToPlan(event)}
                  variant="outline"
                  className="w-full"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add to Plan
                </Button>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xl text-slate-600 dark:text-slate-400">
              No events found for {selectedMonth >= 0 ? months[selectedMonth] : 'selected filters'}
            </p>
          </div>
        )}
      </div>

      {/* Featured Event Banner */}
      {filteredEvents && filteredEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <GlassCard hover={false}>
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-4">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Upcoming Highlight</span>
              </div>
              <h2 className="text-2xl md:text-3xl mb-3">
                International Yoga Festival 2025
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                Join thousands of yoga enthusiasts from around the world in Rishikesh for a week
                of learning, practice, and spiritual growth.
              </p>
              <Button size="lg">Learn More</Button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
