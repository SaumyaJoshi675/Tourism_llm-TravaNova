import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Route, MessageSquare, MapPin, TrendingUp, Clock, BookmarkCheck } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const queryData = [
  { name: 'Mon', queries: 12 },
  { name: 'Tue', queries: 19 },
  { name: 'Wed', queries: 15 },
  { name: 'Thu', queries: 25 },
  { name: 'Fri', queries: 22 },
  { name: 'Sat', queries: 30 },
  { name: 'Sun', queries: 28 },
];

const categoryData = [
  { name: 'Nature', value: 35 },
  { name: 'Adventure', value: 25 },
  { name: 'Spiritual', value: 20 },
  { name: 'Wildlife', value: 20 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function Dashboard() {
  const stats = [
    { label: 'Total Queries', value: '127', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { label: 'Saved Itineraries', value: '8', icon: Route, color: 'from-emerald-500 to-teal-500' },
    { label: 'Places Explored', value: '24', icon: MapPin, color: 'from-purple-500 to-pink-500' },
    { label: 'API Usage', value: '89%', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ];

  const recentItineraries = [
    { id: 1, name: 'Nainital Weekend Getaway', days: 3, created: '2 days ago' },
    { id: 2, name: 'Spiritual Journey', days: 5, created: '5 days ago' },
    { id: 3, name: 'Adventure in Auli', days: 4, created: '1 week ago' },
  ];

  const savedPlaces = [
    { name: 'Valley of Flowers', category: 'Nature', image: 'https://images.unsplash.com/photo-1530488283937-97dd1667472f?w=400' },
    { name: 'Rishikesh', category: 'Spiritual', image: 'https://images.unsplash.com/photo-1678788166239-b28733f56956?w=400' },
    { name: 'Jim Corbett', category: 'Wildlife', image: 'https://images.unsplash.com/photo-1611409518513-f062779abeeb?w=400' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your travel planning activity and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} delay={idx * 0.1}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-3xl mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <GlassCard hover={false}>
            <div className="p-6">
              <h3 className="text-xl mb-6">Query Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={queryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="queries" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Category Distribution */}
        <GlassCard hover={false}>
          <div className="p-6">
            <h3 className="text-xl mb-6">Interests</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Itineraries */}
        <GlassCard hover={false}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Recent Itineraries</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentItineraries.map((itinerary, idx) => (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white">
                    <Route className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">{itinerary.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {itinerary.days} days
                      </span>
                      <span>{itinerary.created}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Saved Places */}
        <GlassCard hover={false}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Saved Places</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {savedPlaces.map((place, idx) => (
                <motion.div
                  key={place.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="mb-1">{place.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{place.category}</p>
                  </div>
                  <BookmarkCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
