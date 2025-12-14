import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MapPin, Sparkles, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Namaste! 🙏 I am your AI Travel Assistant. I can help you plan trips across India — itineraries, hotels, budgets, and more. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'searching' | 'generating'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ✅ BACKEND-ONLY CHAT HANDLER
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    // Create new user message object
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    // Optimistically update UI
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    setInput('');
    setIsTyping(true);
    setStatus('searching');

    try {
      // Prepare history for backend (excluding the current user message which is sent as query)
      // Actually backend expects history INCLUDING the new message ideally, or handled there.
      // Based on my backend logic: `history || [{ role: 'user', content: query }]`
      // I'll send full history including the new message efficiently.
      const history = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Use configured API URL or fall back to default
      const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          history: history
        }),
      });

      const data = await response.json();
      setStatus('generating');

      let assistantText = '';

      if (data.type === 'question') {
        assistantText = data.message;
      } else if (data.type === 'itinerary') {
        // If itinerary is an object, format it nicely or just dump it for now
        // The prompt says "Return the itinerary in a structured... format"
        // If data.itinerary is valid JSON, we might want to just show "I've generated your itinerary..."
        // and maybe render it specially. For now, let's just stringify or show a success message.
        // The existing code: `assistantText = JSON.stringify(data.itinerary, null, 2);`
        assistantText = JSON.stringify(data.itinerary, null, 2);
      } else if (data.message) {
        assistantText = data.message;
      } else {
        assistantText = 'I am not sure how to respond to that.';
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantText,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      toast.error('Failed to connect to travel assistant');
    } finally {
      setIsTyping(false);
      setStatus('idle');
    }
  };

  const quickActions = [
    { label: 'Plan Rajasthan Trip', icon: MapPin, query: 'Rajasthan trip' },
    { label: 'Goa Beaches', icon: Sparkles, query: 'Goa' },
    { label: 'Kerala Backwaters', icon: Sparkles, query: 'Kerala trip' },
    { label: 'Spiritual Varanasi', icon: MapPin, query: 'Varanasi trip' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 flex flex-col">
        <GlassCard className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="p-6 border-b flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">TravaNova AI</h2>
              <p className="text-sm text-slate-500">Online & Ready</p>
            </div>
          </div>

          {/* CHAT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-5 py-4 max-w-[80%] ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border'
                      }`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="text-sm text-slate-500">
                {status === 'searching' ? 'Thinking…' : 'Preparing response…'}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your trip…"
              className="flex-1 px-4 py-3 rounded-full border focus:outline-none text-gray-900"
            />
            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* SIDEBAR */}
      <div className="hidden lg:flex flex-col w-80 gap-4">
        <GlassCard>
          <h3 className="text-sm font-bold mb-3">Quick Actions</h3>
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={() => setInput(a.query)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100"
            >
              <a.icon className="w-4 h-4" />
              <span>{a.label}</span>
            </button>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}
