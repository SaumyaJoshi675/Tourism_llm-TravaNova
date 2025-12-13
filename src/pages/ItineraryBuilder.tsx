import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  Download,
  Share2,
  Sparkles,
  MapPin,
  GripVertical,
} from 'lucide-react';
import { useGenerateItinerary } from '../hooks/useAPI';
import { toast } from 'sonner@2.0.3';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  time: string;
  activity: string;
  location: string;
}

export default function ItineraryBuilder() {
  const [days, setDays] = useState<ItineraryDay[]>([
    {
      id: '1',
      day: 1,
      title: 'Day 1: Arrival & Exploration',
      activities: [],
    },
  ]);
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3');
  const [budget, setBudget] = useState('Medium');
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const generateMutation = useGenerateItinerary();

  const addDay = () => {
    const newDay: ItineraryDay = {
      id: Date.now().toString(),
      day: days.length + 1,
      title: `Day ${days.length + 1}: Sightseeing`,
      activities: [],
    };
    setDays([...days, newDay]);
  };

  const removeDay = (id: string) => {
    setDays(days.filter((day) => day.id !== id));
  };

  const addActivity = (dayId: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      time: '10:00 AM',
      activity: 'New Activity',
      location: 'Location',
    };
    setDays(
      days.map((day) =>
        day.id === dayId ? { ...day, activities: [...day.activities, newActivity] } : day
      )
    );
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setDays(
      days.map((day) =>
        day.id === dayId
          ? { ...day, activities: day.activities.filter((a) => a.id !== activityId) }
          : day
      )
    );
  };

  const updateActivity = (dayId: string, activityId: string, field: keyof Activity, value: string) => {
    setDays(
      days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((a) =>
                a.id === activityId ? { ...a, [field]: value } : a
              ),
            }
          : day
      )
    );
  };

  const handleGenerateAI = async () => {
    if (!destination || !duration) {
      toast.error('Please enter destination and duration');
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        destination,
        duration: parseInt(duration),
        budget,
      });

      const generatedDays = result.days.map((day: any, index: number) => ({
        id: Date.now().toString() + index,
        day: day.day,
        title: day.title,
        activities: day.activities.map((activity: any, idx: number) => ({
          id: Date.now().toString() + index + idx,
          ...activity,
        })),
      }));

      setDays(generatedDays);
      setShowAIBuilder(false);
      toast.success('AI-generated itinerary created!');
    } catch (error) {
      toast.error('Failed to generate itinerary');
    }
  };

  const calculateTotalCost = () => {
    const baseCosts = { Low: 10000, Medium: 20000, High: 35000 };
    return `₹${baseCosts[budget as keyof typeof baseCosts] * parseInt(duration || '1')}`;
  };

  const handleExport = () => {
    toast.success('Itinerary exported as PDF!');
  };

  const handleShare = () => {
    toast.success('Shareable link copied to clipboard!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Build Your Itinerary</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create a perfect travel plan for your Uttarakhand adventure
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAIBuilder(!showAIBuilder)}
              variant="outline"
              icon={<Sparkles className="w-4 h-4" />}
            >
              AI Generate
            </Button>
            <Button onClick={handleExport} variant="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button onClick={handleShare} variant="secondary" icon={<Share2 className="w-4 h-4" />}>
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Itinerary Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Builder Panel */}
          <AnimatePresence>
            {showAIBuilder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <GlassCard hover={false}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                      <h3 className="text-xl">AI Itinerary Generator</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                          Destination
                        </label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g., Nainital"
                          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                          Duration (days)
                        </label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          min="1"
                          max="14"
                          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                        Budget Level
                      </label>
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map((level) => (
                          <button
                            key={level}
                            onClick={() => setBudget(level)}
                            className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                              budget === level
                                ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateAI}
                      className="w-full"
                      disabled={generateMutation.isPending}
                    >
                      {generateMutation.isPending ? 'Generating...' : 'Generate Itinerary'}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Days */}
          <AnimatePresence>
            {days.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="p-6">
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white">
                          {day.day}
                        </div>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) =>
                            setDays(
                              days.map((d) => (d.id === day.id ? { ...d, title: e.target.value } : d))
                            )
                          }
                          className="text-xl bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
                        />
                      </div>
                      <button
                        onClick={() => removeDay(day.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>

                    {/* Activities */}
                    <div className="space-y-3">
                      {day.activities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 group"
                        >
                          <div className="flex items-center">
                            <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                          </div>
                          <div className="flex-1 grid sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={activity.time}
                              onChange={(e) =>
                                updateActivity(day.id, activity.id, 'time', e.target.value)
                              }
                              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Time"
                            />
                            <input
                              type="text"
                              value={activity.activity}
                              onChange={(e) =>
                                updateActivity(day.id, activity.id, 'activity', e.target.value)
                              }
                              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Activity"
                            />
                            <input
                              type="text"
                              value={activity.location}
                              onChange={(e) =>
                                updateActivity(day.id, activity.id, 'location', e.target.value)
                              }
                              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Location"
                            />
                          </div>
                          <button
                            onClick={() => removeActivity(day.id, activity.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </motion.div>
                      ))}

                      <button
                        onClick={() => addActivity(day.id)}
                        className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        <Plus className="w-5 h-5" />
                        Add Activity
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Day Button */}
          <Button onClick={addDay} variant="outline" className="w-full" icon={<Plus className="w-5 h-5" />}>
            Add Day
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary Card */}
          <GlassCard hover={false}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl mb-4">Trip Summary</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                    <p className="font-medium">{days.length} days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Estimated Cost</p>
                    <p className="font-medium">{calculateTotalCost()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Activities</p>
                    <p className="font-medium">
                      {days.reduce((sum, day) => sum + day.activities.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Suggestions */}
          <GlassCard hover={false}>
            <div className="p-6">
              <h3 className="text-lg mb-4">Nearby Attractions</h3>
              <div className="space-y-3">
                {['Valley of Flowers', 'Kedarnath Temple', 'Auli Skiing'].map((place, idx) => (
                  <motion.button
                    key={place}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm">{place}</span>
                    <Plus className="w-4 h-4 ml-auto text-slate-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Tips */}
          <GlassCard hover={false}>
            <div className="p-6">
              <h3 className="text-lg mb-4">Travel Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  Book accommodations in advance during peak season
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  Carry warm clothing for hill stations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  Try local cuisine at authentic restaurants
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  Respect local customs and environment
                </li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
