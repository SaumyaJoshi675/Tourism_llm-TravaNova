import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function KeyboardShortcuts() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      const isInputFocused = 
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';
      
      if (isInputFocused) return;

      // Cmd/Ctrl + K for search/chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/chat');
      }

      // Cmd/Ctrl + M for map
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        navigate('/map');
      }

      // Cmd/Ctrl + I for itinerary
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        navigate('/itinerary');
      }

      // Cmd/Ctrl + H for home
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      }

      // Cmd/Ctrl + T for theme toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        const themes = ['light', 'dark', 'glass'] as const;
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, theme, setTheme]);

  return null; // This component doesn't render anything
}
