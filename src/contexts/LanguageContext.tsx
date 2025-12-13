import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    chat: 'AI Assistant',
    map: 'Explore Map',
    itinerary: 'Build Itinerary',
    events: 'Events & Festivals',
    dashboard: 'Dashboard',
    settings: 'Settings',
    hero_title: 'Your AI-powered Travel Companion',
    hero_subtitle: 'Discover the beauty of Uttarakhand with intelligent recommendations',
    try_assistant: 'Try Tourism Assistant',
    build_itinerary: 'Build My Itinerary',
    ai_chat: 'AI Chat',
    smart_itinerary: 'Smart Itinerary',
    local_events: 'Local Events',
    map_navigation: 'Map Navigation',
  },
  hi: {
    home: 'होम',
    chat: 'AI सहायक',
    map: 'मानचित्र देखें',
    itinerary: 'यात्रा योजना बनाएं',
    events: 'कार्यक्रम और त्योहार',
    dashboard: 'डैशबोर्ड',
    settings: 'सेटिंग्स',
    hero_title: 'आपका AI-संचालित यात्रा साथी',
    hero_subtitle: 'बुद्धिमान सिफारिशों के साथ उत्तराखंड की सुंदरता का अन्वेषण करें',
    try_assistant: 'पर्यटन सहायक आज़माएं',
    build_itinerary: 'मेरी यात्रा योजना बनाएं',
    ai_chat: 'AI चैट',
    smart_itinerary: 'स्मार्ट यात्रा योजना',
    local_events: 'स्थानीय कार्यक्रम',
    map_navigation: 'मानचित्र नेविगेशन',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
