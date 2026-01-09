import React, { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: 'high' | 'low' | 'auto';
  placeholder?: string;
}

/**
 * Responsive Image Component
 * Provides optimized image loading with fallbacks and proper sizing
 */
export default function ResponsiveImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = 'auto',
  placeholder = '/images/placeholder.jpg'
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(placeholder);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Generate WebP equivalent path
  const webPSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // Determine fetchPriority based on priority prop
  const fetchPriority = priority === 'high' ? 'high' : priority === 'low' ? 'low' : undefined;

  return (
    <picture>
      {/* WebP format for better compression */}
      <source srcSet={webPSrc} type="image/webp" />
      
      {/* Original format as fallback */}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority === 'low' ? 'lazy' : 'eager'}
        decoding="async"
        fetchPriority={fetchPriority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : '1200px 600px',
        }}
      />
    </picture>
  );
}