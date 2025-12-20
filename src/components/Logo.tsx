interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  // Size mapping for different logo dimensions
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} transition-transform duration-300 hover:scale-110 hover:rotate-6`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A3D91" />
            <stop offset="100%" stopColor="#D6001C" />
          </linearGradient>
        </defs>
        
        {/* Main circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#logoGradient)" 
          stroke="white" 
          strokeWidth="2"
        />
        
        {/* Letter M shape */}
        <path 
          d="M30 30 L30 70 L40 70 L50 50 L60 70 L70 70 L70 30 L60 30 L60 55 L50 35 L40 55 L40 30 Z" 
          fill="white"
        />
      </svg>
    </div>
  );
}