import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Interface for ImageSlider component props
 * Defines the configurable properties for the image slider
 */
interface ImageSliderProps {
  /** Array of image URLs to display in the slider */
  images: string[];
  /** Whether to automatically cycle through images */
  autoPlay?: boolean;
  /** Interval in milliseconds between automatic slides */
  interval?: number;
  /** Whether to show navigation controls */
  showControls?: boolean;
  /** Height of the slider container */
  height?: string;
}

/**
 * Image Slider Component
 * A responsive image carousel with autoplay and navigation controls
 * 
 * Features:
 * - Smooth fade transitions between images
 * - Autoplay functionality with customizable interval
 * - Manual navigation controls
 * - Dot indicators for current slide
 * - Responsive design
 * - Accessible navigation
 * - Lazy loading for better performance
 */
export default function ImageSlider({
  images,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  height = 'h-96'
}: ImageSliderProps) {
  // State to track the currently displayed image index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Refs for image elements to implement lazy loading
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  /**
   * Effect for handling autoplay functionality
   * Sets up an interval timer to automatically advance slides
   */
  useEffect(() => {
    // Exit early if autoplay is disabled
    if (!autoPlay) return;

    // Set up interval timer for automatic slide advancement
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    // Cleanup function to clear the interval timer
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  /**
   * Effect for implementing lazy loading
   * Loads images only when they're about to be displayed
   */
  useEffect(() => {
    // Preload the current image and the next image
    const preloadIndices = [
      currentIndex,
      (currentIndex + 1) % images.length
    ];

    preloadIndices.forEach(index => {
      if (imageRefs.current[index]) {
        const img = imageRefs.current[index];
        if (img && !img.src) {
          img.src = images[index];
        }
      }
    });
  }, [currentIndex, images]);

  /**
   * Navigate to the previous slide
   * Wraps around to the last slide if currently on the first slide
   */
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  /**
   * Navigate to the next slide
   * Wraps around to the first slide if currently on the last slide
   */
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  /**
   * Navigate to a specific slide by index
   * @param index - The index of the slide to navigate to
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    // Main container with relative positioning for absolute child elements
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Image container with specified height */}
      <div className={`relative ${height} w-full`}>
        {/* Map through images and render each as a slide */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              ref={el => imageRefs.current[index] = el}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === currentIndex ? "eager" : "lazy"}
              fetchPriority={index === currentIndex ? "high" : "auto"}
              decoding="async"
              onError={(e) => {
                // Handle broken images gracefully
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg'; // Fallback image
                target.alt = 'Image not available';
              }}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation controls - only shown when enabled and multiple images exist */}
      {showControls && images.length > 1 && (
        <>
          {/* Previous slide button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-[#0A3D91]" />
          </button>

          {/* Next slide button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-[#0A3D91]" />
          </button>

          {/* Slide indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}