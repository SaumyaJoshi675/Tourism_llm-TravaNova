import { motion } from 'motion/react';
import { Mountain, Sparkles, Compass, Music, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import GlassCard from '../ui/GlassCard';

export default function FeaturedDestination() {
    const navigate = useNavigate();

    const highlights = [
        {
            icon: Mountain,
            title: "Himalayan Majesty",
            text: "Home to Nanda Devi and Valley of Flowers",
            color: "from-indigo-500 to-blue-500"
        },
        {
            icon: Sparkles,
            title: "Spiritual Capital",
            text: "The sacred land of Char Dham and Rishikesh",
            color: "from-orange-500 to-amber-500"
        },
        {
            icon: Compass,
            title: "Adventure Hub",
            text: "White water rafting, trekking, and skiing",
            color: "from-emerald-500 to-green-500"
        },
        {
            icon: Music,
            title: "Rich Culture",
            text: "Vibrant festivals, folk music, and Pahadi cuisine",
            color: "from-pink-500 to-rose-500"
        }
    ];

    return (
        <section className="relative py-24 px-4 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Featured Destination</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                            Experience <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                                Uttarakhand
                            </span>
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl">
                            Discover the Land of Gods, where majestic peaks meet spiritual tranquility.
                            Our AI-powered platform offers deeply curated insights specifically for
                            this divine region, helping you uncover hidden gems and plan the perfect journey.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="rounded-full shadow-lg shadow-blue-500/20"
                                onClick={() => navigate('/chat')} // Directing to chat as "deep insights"
                            >
                                Start Exploring
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="rounded-full"
                                onClick={() => navigate('/itinerary')}
                            >
                                Generate Itinerary
                            </Button>
                        </div>
                    </motion.div>

                    {/* Highlights Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {highlights.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                            >
                                <GlassCard className="h-full hover:border-blue-500/30 transition-colors group">
                                    <div className="p-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            {item.text}
                                        </p>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
