import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Route, Calendar, Map, Sparkles, TrendingUp, Shield, ArrowRight, ChevronDown } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import MostVisitedPlaces from '../components/home/MostVisitedPlaces';
import FeaturedDestination from '../components/home/FeaturedDestination';
import SmartTravelInsights from '../components/home/SmartTravelInsights';
import MoodBasedTrips from '../components/home/MoodBasedTrips';
import { heroStates } from '../data/heroStates';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: MessageSquare,
      title: t('ai_chat'),
      description: 'Chat with our AI assistant powered by fine-tuned LLM for personalized recommendations',
      color: 'from-blue-500 to-cyan-500',
      path: '/chat',
    },
    {
      icon: Route,
      title: t('smart_itinerary'),
      description: 'Generate intelligent itineraries using RAG-powered recommendations',
      color: 'from-emerald-500 to-teal-500',
      path: '/itinerary',
    },
    {
      icon: Calendar,
      title: t('local_events'),
      description: 'Discover festivals, events, and cultural celebrations happening across Uttarakhand',
      color: 'from-purple-500 to-pink-500',
      path: '/events',
    },
    {
      icon: Map,
      title: t('map_navigation'),
      description: 'Interactive maps with pinned attractions and real-time navigation',
      color: 'from-orange-500 to-red-500',
      path: '/map',
    },
  ];


  const stats = [
    { label: 'Destinations', value: '100+', icon: Map },
    { label: 'AI Accuracy', value: '95%', icon: TrendingUp },
    { label: 'Happy Travelers', value: '10K+', icon: Sparkles },
    { label: 'Data Security', value: '100%', icon: Shield },
  ];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroStates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroStates[currentHeroIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Cross-fade */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentHero.id}
              src={currentHero.image}
              alt={currentHero.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Animated Background Gradient - Adjusted opacity for image visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-emerald-900/40 to-teal-900/40 opacity-80 z-0" />

        {/* Animated Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl mb-2 text-white drop-shadow-lg font-bold tracking-tight">
              Discover
            </h1>

            <div className="h-20 md:h-24 relative w-full flex justify-center items-center overflow-hidden mb-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentHero.id}
                  className="absolute w-full text-center text-6xl md:text-6xl font-medium text-white drop-shadow-md"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {currentHero.name}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Description hidden to reduce clutter as requested */}
            {/* <div className="h-24 md:h-20 mb-10 relative max-w-3xl mx-auto"> ... </div> */}
            <div className="mb-12" />

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/chat')}
                className="bg-white text-emerald-950 hover:bg-emerald-50 shadow-xl rounded-full border-2 border-white"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/map')}
                className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 rounded-full shadow-lg"
              >
                <Map className="w-5 h-5 mr-2" />
                Explore Map
              </Button>
            </div>
          </motion.div>

          {/* State Navigation Controls */}
          <motion.div
            className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-3 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {heroStates.map((state, idx) => (
              <button
                key={state.id}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentHeroIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
                  }`}
                aria-label={`View ${state.name}`}
              />
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </div>
      </section >

      {/* Features Section */}
      < section className="py-20 px-4 max-w-7xl mx-auto" >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Intelligent Features
          </h2>

        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(feature.path)}
                className="cursor-pointer"
              >
                <GlassCard delay={index * 0.1}>
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section >

      {/* Most Visited Places Section */}
      <MostVisitedPlaces />

      {/* Featured Destination Section */}
      <FeaturedDestination />

      {/* Smart Travel Insights Section */}
      <SmartTravelInsights />

      {/* Mood Based Trips Section */}
      < MoodBasedTrips />

      {/* Stats Section */}
      < section className="py-16 px-4" >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <div className="p-6 text-center">
                      <Icon className="w-10 h-10 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-20 px-4" >
        <div className="max-w-4xl mx-auto">
          <GlassCard hover={false}>
            <div className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl mb-4">
                Ready to explore Uttarakhand?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Start your journey with AI-powered recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/chat')} size="lg">
                  Start Chatting
                </Button>
                <Button onClick={() => navigate('/map')} variant="secondary" size="lg">
                  Explore Map
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section >
    </div >
  );
}