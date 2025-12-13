import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Image as ImageIcon, Mic, MapPin, Sparkles } from 'lucide-react';
import { useChatMessage } from '../hooks/useAPI';
import { toast } from 'sonner@2.0.3';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ name: string; url: string }>;
  suggestions?: string[];
  timestamp: Date;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI-powered Uttarakhand tourism assistant. I can help you discover amazing places, plan itineraries, and answer questions about travel in Uttarakhand. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const chatMutation = useChatMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatMutation.mutateAsync(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        sources: response.sources,
        suggestions: response.suggestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const quickActions = [
    { label: 'Plan 3-day trip', icon: MapPin, query: 'Help me plan a 3-day trip to Uttarakhand' },
    { label: 'Best time to visit', icon: Sparkles, query: 'What is the best time to visit Uttarakhand?' },
    { label: 'Adventure activities', icon: Sparkles, query: 'What adventure activities are available?' },
    { label: 'Spiritual places', icon: MapPin, query: 'Recommend spiritual places to visit' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-6 flex gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <GlassCard hover={false} className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl">Uttarakhand AI Assistant</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Powered by fine-tuned LLM + RAG
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-5 py-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200/20 dark:border-slate-700/20">
                          <p className="text-sm opacity-80 mb-2">Sources:</p>
                          <div className="space-y-1">
                            {message.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                className="text-sm underline block hover:opacity-80"
                              >
                                {source.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      {message.timestamp.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
              >
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex gap-3">
              <button className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Mic className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'hi' ? 'अपना संदेश लिखें...' : 'Type your message...'}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                icon={chatMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              >
                Send
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Sidebar with Quick Actions */}
      <div className="hidden lg:block w-80 space-y-4">
        <GlassCard hover={false}>
          <div className="p-6">
            <h3 className="text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestionClick(action.query)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="p-6">
            <h3 className="text-lg mb-4">Popular Destinations</h3>
            <div className="space-y-3">
              {['Nainital', 'Rishikesh', 'Jim Corbett', 'Auli'].map((place) => (
                <div key={place} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-600/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm">{place}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Popular destination</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
