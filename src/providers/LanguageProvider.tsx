import React, { useState, useEffect, ReactNode } from 'react';
import { Language } from '../types/eniac';
import { LanguageContext } from '../hooks/useLanguage';
import { translations } from '../translations';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('eniac-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('eniac-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};