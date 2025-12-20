import { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FloatingActionButtonProps {
  isVisible?: boolean;
}

export default function FloatingActionButton({ isVisible = true }: FloatingActionButtonProps) {
  const [isVisibleState, setIsVisibleState] = useState(isVisible);
  const [isMinimized, setIsMinimized] = useState(false);

  // Hide FAB when user scrolls to bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Hide when near bottom of page
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsVisibleState(false);
      } else {
        setIsVisibleState(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  if (!isVisibleState) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isMinimized ? 'scale-75' : 'scale-100'}`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#D6001C] text-white p-3 rounded-full shadow-lg hover:bg-[#b30015] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:ring-offset-2"
          aria-label="Expand registration button"
        >
          <FileText className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-[#0A3D91] dark:bg-[#0A3D91]">
            <span className="text-white font-medium">Quick Registration</span>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Minimize"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
              Ready to get started? Register for our services in just a few clicks!
            </p>
            <Link
              to="/register"
              className="block w-full bg-[#D6001C] hover:bg-[#b30015] text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-300 hover:shadow-md"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}