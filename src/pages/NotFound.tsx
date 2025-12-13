import { motion } from 'motion/react';
import { Home, MapPin, MessageCircle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

export default function NotFound() {
  const navigate = useNavigate();

  const suggestions = [
    { icon: Home, label: 'Go Home', path: '/', color: 'from-blue-500 to-cyan-500' },
    { icon: MessageCircle, label: 'Chat with AI', path: '/chat', color: 'from-emerald-500 to-teal-500' },
    { icon: MapPin, label: 'Explore Map', path: '/map', color: 'from-orange-500 to-red-500' },
    { icon: Compass, label: 'Plan Trip', path: '/itinerary', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Number */}
          <motion.div
            className="text-[120px] md:text-[180px] leading-none mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            404
          </motion.div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl mb-4">
            Lost in the Mountains?
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
            This page doesn't exist, but there are many beautiful places in Uttarakhand to explore!
          </p>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {suggestions.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <button
                      onClick={() => navigate(item.path)}
                      className="w-full p-6 text-left hover:scale-105 transition-transform"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-lg">{item.label}</p>
                    </button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {/* Fun Fact */}
          <GlassCard hover={false}>
            <div className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400">💡 Fun Fact:</span>{' '}
                Uttarakhand has over 12,000 glaciers, making it one of the most glacier-rich regions in India!
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
