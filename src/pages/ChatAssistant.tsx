import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Image as ImageIcon, Mic, MapPin, Sparkles, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LLMService } from '../lib/webllm';
import { findRelevantContext } from '../data/knowledgeBase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ name: string; url: string }>;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am your AI Travel Assistant for India. I can run locally in your browser to help you plan your trips to Uttarakhand, Kerala, Rajasthan, and beyond! How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Unused state variables removed for cleanliness
  const [modelLoading, setModelLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'searching' | 'generating'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage(); // Keep if actually used for locale, but remove if genuinely unused. 
  // Actually language is used in lines 222-225 for locale string. Keep it.

  // Remove unused loadProgress/loadText

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize model on load
    const initModel = async () => {
      try {
        const llm = LLMService.getInstance();
        if (llm.isReady()) {
          console.log("AI Model already ready, skipping load.");
          return;
        }

        setModelLoading(true);
        await llm.initialize((progress) => {
          // Log to console instead of UI
          console.log(`[AI Model Loading]: ${Math.round(progress.progress * 100)}% - ${progress.text}`);
        });
        setModelLoading(false);
        toast.success("AI Model ready!");
      } catch (error) {
        console.error("Failed to load model:", error);
        setModelLoading(false);
        toast.error("Failed to initialize AI.");
      }
    };

    initModel();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || modelLoading) return;

    const userQuery = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStatus('searching');

    try {
      // 1. Research phase (Dynamic Web Scraping)
      let context = '';
      let sources = [];

      try {
        // Updated to use PORT 5000
        const researchResponse = await fetch('http://localhost:5000/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userQuery })
        });

        if (researchResponse.ok) {
          const data = await researchResponse.json();
          context = data.context;
          sources = data.sources;
        } else {
          throw new Error("Research server offline");
        }
      } catch (err) {
        console.log("Research failed, using fallback:", err);
        context = findRelevantContext(userQuery);
        sources = [{ name: 'Offline Knowledge Base', url: '#' }];
      }

      setStatus('generating');

      // 2. Prepare for Streaming Response
      const llm = LLMService.getInstance();
      const truncatedContext = context.length > 2000 ? context.substring(0, 2000) : context;

      // Build Conversation History (Last 4 messages) to maintain context
      const history = messages.slice(-4).map(m =>
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
      ).join('\n\n');

      const fullContext = `
      PREVIOUS CONVERSATION HISTORY:
      ${history}

      CURRENT WEB SEARCH RESULTS:
      ${truncatedContext}

      USER'S NEW QUERY:
      ${userQuery}
      `;

      const assistantMsgId = (Date.now() + 1).toString();

      // creates a placeholder message to stream into
      const assistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '', // Start empty
        sources: sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStatus('idle'); // We hide "Thinking" now because we are showing the text stream

      let fullText = "";

      try {
        // Stream the response
        for await (const chunk of llm.chatStream(userQuery, fullContext)) {
          fullText += chunk;
          // Update the message in place
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
          ));
        }
      } catch (streamError) {
        console.error("Streaming failed:", streamError);
        // If streaming completely fails, just append an error note
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMsgId ? { ...msg, content: fullText + "\n[Connection interrupted]" } : msg
        ));
      }

      // Removed old non-streaming redundant block
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to get response. ' + (error.message || ''));
    } finally {
      setIsTyping(false);
      setStatus('idle');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const quickActions = [
    { label: 'Plan Rajasthan Trip', icon: MapPin, query: 'Help me plan a 3-day trip to Jaipur, Rajasthan' },
    { label: 'Beaches in Goa', icon: Sparkles, query: 'What are the best beaches in North Goa for nightlife?' },
    { label: 'Kerala Backwaters', icon: Sparkles, query: 'Tell me about houseboats in Alleppey' },
    { label: 'Spiritual Varanasi', icon: MapPin, query: 'Guide me for a spiritual visit to Varanasi' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-6 flex gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <GlassCard hover={false} className="flex-1 flex flex-col border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-700">
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">TravaNova AI</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${modelLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {modelLoading ? 'Initializing Neural Engine...' : 'Online & Ready'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] lg:max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`relative rounded-2xl px-6 py-5 shadow-sm ${message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                        }`}
                    >
                      {message.role === 'user' ? (
                        <p className="text-black whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-slate">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ node, ...props }) => <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
                              p: ({ node, ...props }) => <p {...props} className="whitespace-pre-wrap leading-relaxed mb-2" />,
                              ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                              ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                              li: ({ node, ...props }) => <li {...props} className="mb-0.5" />,
                              h1: ({ node, ...props }) => <h1 {...props} className="text-lg font-bold mb-2 mt-4" />,
                              h2: ({ node, ...props }) => <h2 {...props} className="text-base font-bold mb-2 mt-3" />,
                              h3: ({ node, ...props }) => <h3 {...props} className="text-sm font-bold mb-1 mt-2" />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {message.sources && message.sources.length > 0 && (
                        <div className={`mt-4 pt-3 border-t ${message.role === 'user' ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'}`}>
                          <div className="flex items-center gap-2 mb-2 opacity-80">
                            <Sparkles className="w-3 h-3" />
                            <span className="text-xs font-medium uppercase tracking-wider">Sources</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-1 rounded-md ${message.role === 'user'
                                  ? 'bg-white/10 hover:bg-white/20'
                                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                  } transition-colors cursor-default truncate max-w-[200px]`}
                              >
                                {source.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={`text-[10px] mt-2 font-medium opacity-60 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl w-fit"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-2">
                  {status === 'searching' ? 'Browsing Internet...' : 'Drafting Answer...'}
                </span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 m-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-2">
              <div className="flex sm:gap-2">
                <button className="p-3 rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 transition-all hover:scale-105 active:scale-95 hover:shadow-sm">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 transition-all hover:scale-105 active:scale-95 hover:shadow-sm">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] border border-transparent focus-within:border-indigo-500/30 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-sm">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={modelLoading ? "Initializing neural engine (check shell)..." : "Ask anything about India..."}
                  disabled={modelLoading}
                  className="w-full px-6 py-4 bg-transparent border-none focus:outline-none placeholder:text-slate-400 text-slate-700 dark:text-slate-200 disabled:opacity-50"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || modelLoading}
                className={`rounded-full w-14 h-14 p-0 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 ${!input.trim() ? 'opacity-50' : 'hover:scale-105 active:scale-95'
                  }`}
                icon={modelLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 translate-x-0.5" />}
              >
                {/* Empty child to fix TS error */}
                <span className="sr-only">Send</span>
              </Button>
            </div>
            {modelLoading && (
              <p className="text-xs text-center mt-3 text-slate-400">
                First load may take a moment. Check terminal/console for details.
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Sidebar with Quick Actions */}
      <div className="hidden lg:flex flex-col w-80 gap-6">
        <GlassCard hover={false} className="border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-700">
          <div className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestionClick(action.query)}
                    disabled={modelLoading}
                    className="w-full group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all text-left disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-700 flex-1">
          <div className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Trending Now</h3>
            <div className="space-y-4">
              {['Jaipur', 'Rishikesh', 'Goa', 'Kerala'].map((place, i) => (
                <div key={place} className="flex items-center gap-4 group cursor-pointer">
                  <span className="text-lg font-bold text-slate-300 dark:text-slate-600 font-mono">0{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{place}</p>
                    <p className="text-xs text-slate-500">High search volume</p>
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
