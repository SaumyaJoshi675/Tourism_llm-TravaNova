import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/layout/Navbar';
import FloatingChatButton from './components/ui/FloatingChatButton';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts';
import Home from './pages/Home';
import ChatAssistant from './pages/ChatAssistant';
import MapExplorer from './pages/MapExplorer';
import ItineraryBuilder from './pages/ItineraryBuilder';
import EventsFestivals from './pages/EventsFestivals';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <KeyboardShortcuts />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/chat" element={<ChatAssistant />} />
                  <Route path="/map" element={<MapExplorer />} />
                  <Route path="/itinerary" element={<ItineraryBuilder />} />
                  <Route path="/events" element={<EventsFestivals />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
              <FloatingChatButton />
              <Toaster position="top-right" richColors />
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}