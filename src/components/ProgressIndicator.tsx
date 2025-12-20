import { useState, useEffect } from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepLabels = [] 
}: ProgressIndicatorProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar when currentStep changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress((currentStep / totalSteps) * 100);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep, totalSteps]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(animatedProgress)}% Complete</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0A3D91] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      {stepLabels.length > 0 && (
        <div className="flex justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
          
          {stepLabels.map((label, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-[#0A3D91] text-white ring-4 ring-[#0A3D91]/30' 
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs text-center px-2 ${
                  isActive 
                    ? 'text-[#0A3D91] dark:text-white font-semibold' 
                    : isCompleted 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}