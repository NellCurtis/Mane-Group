import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../lib/translations/index';
/**
 * Type definition for supported languages
 * Currently supporting English and French
 */
type Language = 'en' | 'fr';

/**
 * Type definition for translation keys
 * Maps to the structure of the translations object
 * Includes both string and array valued keys
 */
type TranslationKeys = keyof typeof translations.en;

/**
 * Type definition for translation values
 * Handles all possible translation value types
 */
type TranslationValues = string | string[] | { question: string; answer: string; }[] | string[][];

/**
 * Interface for the Language Context
 * Defines the shape of the context value
 */
interface LanguageContextType {
  /** Current selected language */
  language: Language;
  /** Function to change the current language */
  setLanguage: (lang: Language) => void;
  /** Translations object for the current language */
  translations: typeof translations.en;
  /** Function to get a translation by key */
  t: (key: TranslationKeys) => TranslationValues;
}

/** * Creating the Language Context
 * Provides language management and translation functionality
 * Default value throws error if used outside provider
 */
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {
    throw new Error('setLanguage must be used within LanguageProvider');
  },
  translations: translations.en,
  t: () => {
    throw new Error('t must be used within LanguageProvider');
  }
});

/**
 * Props interface for LanguageProvider
 * Accepts children components
 */
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Language Provider Component
 * Wraps the application to provide language context
 * Manages language state and persistence in localStorage
 * 
 * Features:
 * - Language persistence across sessions
 * - Automatic translation updates
 * - Context provider pattern
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize language state from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'fr') ? savedLanguage : 'en';
  });

  /**
   * Effect to save language preference to localStorage
   * Persists user language choice across sessions
   */
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  /**
   * Translation function
   * Returns translated text for given key in current language
   * Falls back to English if translation not found
   * @param key - Translation key to look up
   * @returns Translated text string or array
   */
  const t = (key: TranslationKeys): TranslationValues => {
    const translation = translations[language][key] || translations.en[key] || key;
    return translation;
  };

  // Context value object with current state and functions
  const contextValue = {
    language,
    setLanguage,
    translations: translations[language],
    t
  };

  return (
    // Provide language context to child components
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to consume Language Context
 * Provides easy access to language state and translation functions
 * Must be used within LanguageProvider
 * 
 * @returns LanguageContextType - Current language context
 * @throws Error if used outside LanguageProvider
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}