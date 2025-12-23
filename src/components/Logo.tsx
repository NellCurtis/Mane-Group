interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customLogo?: string; // Path to custom logo image
  serviceType?: 'driving' | 'immigration' | 'innovation' | 'languages' | 'graphicDesign' | 'default' | 'header'; // Specific service type
}

export default function Logo({ size = 'md', className = '', customLogo, serviceType }: LogoProps) {
  // Size mapping for different logo dimensions
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  // Determine the logo source based on serviceType or customLogo
  const getLogoSrc = () => {
    if (customLogo) return customLogo;
    
    switch (serviceType) {
      case 'driving':
        return '/images/Auto log.webp';
      case 'immigration':
        return '/images/immi logo.webp';
      case 'innovation':
        return '/images/inno logo.webp';
      case 'languages':
        return '/images/ling logo.webp';
      case 'graphicDesign':
        return '/images/design logo.webp';
      case 'header':
      case 'default':
        // Return the MANÉ GROUP logo image
        return '/images/Mane.webp';
    }
  };

  const logoSrc = getLogoSrc();

  // If a custom logo is specified, render an img element in circular form
  if (logoSrc) {
    return (
      <div className={`${sizeClasses[size]} ${className} transition-transform duration-300 hover:scale-110`}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white flex items-center justify-center" style={{ backgroundColor: '#0A3D91' }}>
          <img 
            src={logoSrc} 
            alt="Service Logo" 
            className="w-3/4 h-3/4 object-contain"
          />
        </div>
      </div>
    );
  }

  // Otherwise, render the default SVG logo
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