import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Scroll to element with smooth animation
 * @param elementId - ID of the element to scroll to
 */
const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Header Component
 * Main navigation component for the application
 * 
 * Features:
 * - Responsive navigation menu (desktop and mobile)
 * - Language toggle functionality
 * - Dark mode toggle
 * - Logo with secret admin access (5 clicks)
 * - Sticky positioning at top of viewport
 * - Brand-consistent styling
 * - Accessibility improvements (keyboard navigation, ARIA labels)
 * - Micro-interactions with hover animations
 * - Smooth scrolling for anchor links
 */
export default function Header() {
  // State for mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State for logo click counter (secret admin access)
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Access language context for translations and language switching
  const { language, setLanguage, translations } = useLanguage();
  // Navigation hook for programmatic navigation
  const navigate = useNavigate();
  // Refs for focus management
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);



  /**
   * Effect to reset logo click counter after 2 seconds
   * Prevents accidental admin access
   */
  useEffect(() => {
    const timer = setTimeout(() => setLogoClickCount(0), 2000);
    return () => clearTimeout(timer);
  }, [logoClickCount]);

  /**
   * Effect to manage focus when mobile menu opens/closes
   */
  useEffect(() => {
    if (isMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (!isMenuOpen && menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  }, [isMenuOpen]);

  /**
   * Handle logo clicks for secret admin access
   * 5 consecutive clicks within 2 seconds navigates to admin page
   */
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount === 5) {
      navigate('/admin');
      setLogoClickCount(0);
    }
  };

  /**
   * Toggle between English and French languages
   * Updates language in context and persists to localStorage
   */
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };



  /**
   * Handle escape key press to close mobile menu
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  /**
   * Handle keyboard navigation in mobile menu
   */
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey && document.activeElement === closeButtonRef.current) {
      e.preventDefault();
      const focusableElements = navLinksRef.current?.querySelectorAll(
        'a, button'
      ) as NodeListOf<HTMLElement>;
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    }
  };

  return (
    // Header with sticky positioning and shadow
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header content with logo and navigation */}
        <div className="flex justify-between items-center h-20">
          {/* Logo area with secret admin access */}
          <div 
            className="flex items-center space-x-3 cursor-pointer transform transition-transform duration-300 hover:scale-105" 
            onClick={handleLogoClick}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            tabIndex={0}
            role="button"
            aria-label="Company logo - click 5 times to access admin"
          >
            <Logo size="md" />
            <Link 
              to="/" 
              className="flex items-center"
              aria-label="Go to homepage"
            >
              <div className="text-2xl font-bold transition-colors duration-300 hover:text-[#D6001C]" style={{ color: '#0A3D91' }}>
                {translations.footerCompanyName || "MANÉ GROUP"}
              </div>
            </Link>
          </div>

          {/* Desktop navigation - hidden on mobile */}
          <nav 
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link 
              to="/" 
              className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded px-2 py-1"
              aria-label="Go to homepage"
            >
              {translations.home}
            </Link>
            <button
              onClick={() => scrollToElement('services')}
              className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded px-2 py-1"
              aria-label="View our services"
            >
              {translations.services}
            </button>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded px-2 py-1"
              aria-label="Learn about us"
            >
              {translations.aboutUs}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded px-2 py-1"
              aria-label="Contact us"
            >
              {translations.contact}
            </Link>
            {/* Language toggle button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded px-2 py-1"
              aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
            >
              <Globe className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              <span>{language === 'en' ? 'FR' : 'EN'}</span>
            </button>

          </nav>

          {/* Mobile menu toggle button */}
          <button
            ref={menuButtonRef}
            className="md:hidden transition-transform duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 transition-colors duration-300" style={{ color: '#0A3D91' }} />
            ) : (
              <Menu className="h-6 w-6 transition-colors duration-300" style={{ color: '#0A3D91' }} />
            )}
          </button>
        </div>

        {/* Mobile navigation menu - shown when isMenuOpen is true */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t"
            onKeyDown={handleMenuKeyDown}
          >
            <div 
              ref={navLinksRef}
              className="flex flex-col space-y-4"
            >
              <button
                ref={closeButtonRef}
                onClick={() => setIsMenuOpen(false)}
                className="self-end mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded transition-transform duration-300 hover:scale-110"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" style={{ color: '#0A3D91' }} />
              </button>
              <Link
                to="/"
                className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded py-2 px-4"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Go to homepage"
              >
                {translations.home}
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setTimeout(() => scrollToElement('services'), 100);
                }}
                className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded py-2 px-4 text-left"
                aria-label="View our services"
              >
                {translations.services}
              </button>
              <Link
                to="/about"
                className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded py-2 px-4"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Learn about us"
              >
                {translations.aboutUs}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded py-2 px-4"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Contact us"
              >
                {translations.contact}
              </Link>
              {/* Mobile language toggle */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-[#0A3D91] transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D91] rounded py-2 px-4"
                aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
              >
                <Globe className="h-5 w-5" />
                <span>{language === 'en' ? 'Français' : 'English'}</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}