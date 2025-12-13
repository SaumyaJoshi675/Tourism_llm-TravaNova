import { motion } from 'motion/react';
import { 
  Sun, 
  Cloud, 
  Users, 
  Calendar, 
  Shield, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info
} from 'lucide-react';
import { getCurrentTravelInsights, travelTips } from '../../data/travelInsights';
import GlassCard from '../ui/GlassCard';
import { useState } from 'react';

const iconMap: Record<string, any> = {
  sun: Sun,
  cloud: Cloud,
  users: Users,
  calendar: Calendar,
  shield: Shield,
  wallet: Wallet,
};

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export default function SmartTravelInsights() {
  const insights = getCurrentTravelInsights();
  const [selectedTip, setSelectedTip] = useState(0);

  // Auto-rotate travel tips
  useState(() => {
    const interval = setInterval(() => {
      setSelectedTip((prev) => (prev + 1) % travelTips.length);
    }, 5000);
    return () => clearInterval(interval);
  });

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm text-purple-600 dark:text-purple-400">AI-Powered Analytics</span>
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Smart Travel Insights
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Real-time data to help you plan the perfect Uttarakhand adventure
        </p>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.icon];
          const TrendIcon = insight.trend ? trendIconMap[insight.trend] : null;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="h-full"
              >
                <GlassCard hover={false} className="h-full relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${insight.color} opacity-10 blur-3xl rounded-full`} />
                  
                  <div className="relative p-6">
                    {/* Icon and Trend */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      
                      {TrendIcon && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                            insight.trend === 'up'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : insight.trend === 'down'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <TrendIcon className="w-3 h-3" />
                          <span className="text-xs font-medium capitalize">{insight.trend}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {insight.title}
                    </h3>

                    {/* Value */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="text-3xl mb-3 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                    >
                      {insight.value}
                    </motion.div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Travel Tip Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Pro Travel Tip</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Essential advice for Uttarakhand travelers
                </p>
              </div>
            </div>

            {/* Tip Display */}
            <div className="relative min-h-[60px] flex items-center">
              <motion.p
                key={selectedTip}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                💡 {travelTips[selectedTip]}
              </motion.p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {travelTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTip(index)}
                  className="relative"
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedTip === index
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 w-8'
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <GlassCard>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="text-3xl mb-2"
                >
                  🌡️
                </motion.div>
                <p className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                  15-25°C
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Temperature</p>
              </div>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-3xl mb-2"
                >
                  ☀️
                </motion.div>
                <p className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  8-10 hrs
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Daylight Hours</p>
              </div>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-3xl mb-2"
                >
                  🎒
                </motion.div>
                <p className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                  50+
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Treks</p>
              </div>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-3xl mb-2"
                >
                  🎉
                </motion.div>
                <p className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  12+
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Events</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
