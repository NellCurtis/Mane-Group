import { useState, useEffect } from 'react';
import { Trophy, Gift, Sparkles } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface CelebrationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CelebrationModal({ isVisible, onClose }: CelebrationModalProps) {
  const [showModal, setShowModal] = useState(isVisible);

  // Handle visibility changes
  useEffect(() => {
    setShowModal(isVisible);
    
    if (isVisible) {
      // Trigger confetti when modal appears
      triggerConfetti();
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-gradient-to-br from-[#0A3D91] to-[#D6001C] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-500 scale-95 animate-scale-in"
        style={{
          animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}
      >
        <style>
          {`
            @keyframes scaleIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `}
        </style>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Sparkles className="h-16 w-16 text-yellow-300 animate-float" />
            <Gift className="h-12 w-12 text-white absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Special Surprise!
        </h2>
        
        <div className="bg-white/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-yellow-300 mr-2" />
            <span className="text-white font-semibold">Congratulations!</span>
          </div>
          <p className="text-white/90">
            You've discovered a special feature! Enjoy this little celebration just for you.
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="px-6 py-3 bg-white text-[#0A3D91] font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0A3D91]"
        >
          Continue Exploring
        </button>
      </div>
    </div>
  );
}