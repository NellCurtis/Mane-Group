import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, FileText, Users, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

/**
 * Function to get banner images for the immigration service
 * @param _language - Current language (not used but kept for consistency)
 * @returns Array of image URLs for the banner slider
 */
const getBannerImages = (_language: string) => [
  'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184286/pexels-photo-3184286.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=1920'
];

/**
 * Function to get feature items with icons for the immigration service
 * @param translations - Translation object containing all translated texts
 * @returns Array of feature objects with icons, titles and descriptions
 */
const getFeatures = (translations: any) => [
  { icon: FileText, title: translations.immigrationFeatures[0], description: translations.immigrationFeatureDescriptions[0] },
  { icon: Users, title: translations.immigrationFeatures[1], description: translations.immigrationFeatureDescriptions[1] },
  { icon: Globe, title: translations.immigrationFeatures[2], description: translations.immigrationFeatureDescriptions[2] },
  { icon: Shield, title: translations.immigrationFeatures[3], description: translations.immigrationFeatureDescriptions[3] }
];

/**
 * Skeleton loader component for content placeholders
 */
const ContentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-4/6 mb-4"></div>
    <div className="h-64 bg-gray-300 rounded w-full mb-6"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
  </div>
);

/**
 * Immigration Service Page Component
 * This component displays detailed information about immigration services
 * Features:
 * - Dynamic content loading from database
 * - Responsive design with image sliders
 * - Multi-language support
 * - Consistent branding with company colors
 * - Loading states with skeleton loaders
 */
export default function Immigration() {
  // Access translations and current language from context
  const { translations, language } = useLanguage();
  
  // State for managing dynamic content and loading status
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // Get banner images based on current language
  const bannerImages = getBannerImages(language);
  
  // Get feature items with translations
  const features = getFeatures(translations);

  /**
   * Effect hook to fetch content when component mounts
   * Loads dynamic content from Supabase database
   */
  useEffect(() => {
    fetchContent();
  }, []);

  /**
   * Function to fetch content from Supabase database
   * Retrieves all content items for the immigration section
   */
  const fetchContent = async () => {
    try {
      setLoading(true);
      // Query content table for immigration section
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section', 'immigration');

      if (error) throw error;

      // Convert array to object for easier access
      const contentObj: any = {};
      data?.forEach(item => {
        // Select appropriate language text
        contentObj[item.key] = language === 'en' ? item.englishText : item.frenchText;
      });

      setContent(contentObj);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function to get content by key with fallback to translations
   * @param key - Content key to retrieve
   * @returns Content text in current language or fallback translation
   */
  const getContent = (key: string) => {
    if (loading || !content[key]) {
      return translations[key as keyof typeof translations] || '';
    }
    return content[key];
  };

  return (
    // Main container with minimum height to fill viewport
    <div className="min-h-screen">
      {/* Hero section with image slider and gradient overlay */}
      <section className="relative overflow-hidden">
        {/* Image slider component showing multiple banner images */}
        <ImageSlider images={bannerImages} height="h-[600px]" />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D91]/90 via-[#0055A4]/80 to-[#D6001C]/70 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10">
            <div className="max-w-4xl">
              {/* Animated logo and title */}
              <div className="flex items-center space-x-4 mb-6 animate-fade-in">
                <Logo size="lg" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{getContent('immigrationTitle')}</h1>
              </div>
              
              {/* Subtitle with delayed animation */}
              <p className="text-xl md:text-3xl max-w-3xl font-light mb-8 animate-fade-in-delay">
                {getContent('immigrationSubtitle')}
              </p>
              
              {/* Call-to-action buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
                {/* Registration link with encoded service parameter */}
                <Link
                  to={`/register?service=${encodeURIComponent('MANÉ Immigration')}`}
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                  style={{ backgroundColor: '#D6001C' }}
                >
                  {translations.applyNow}
                  <FileText className="ml-2 h-5 w-5" />
                </Link>
                
                {/* Learn more link to scroll to services section */}
                <a
                  href="#services"
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl border-2 border-white text-white"
                >
                  {translations.learnMore}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom gradient fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </section>

      {/* Main content section with descriptive text and images */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Section heading with company brand color */}
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#0A3D91' }}>
              {getContent('immigrationMainHeading')}
            </h2>
            
            {/* Rich text content with images interspersed */}
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              {/* Show skeleton loader while content is loading */}
              {loading ? (
                <ContentSkeleton />
              ) : (
                <>
                  {/* First paragraph of descriptive content */}
                  <p className="text-xl leading-relaxed">
                    {getContent('immigrationMainDescription1')}
                  </p>
                  
                  {/* Full-width image for visual appeal */}
                  <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                      alt="Immigration Services" 
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Second paragraph of descriptive content */}
                  <p className="leading-relaxed">
                    {getContent('immigrationMainDescription2')}
                  </p>
                  
                  {/* Two-column approach section with branded cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold mb-3" style={{ color: '#0A3D91' }}>{getContent('immigrationApproachHeading')}</h3>
                      <p>{getContent('immigrationApproachDescription1')}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold mb-3" style={{ color: '#0A3D91' }}>{getContent('immigrationClientCentric')}</h3>
                      <p>{getContent('immigrationApproachDescription2')}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full-width banner image for visual separation */}
      <div className="my-8 rounded-lg overflow-hidden shadow-lg mx-auto max-w-7xl">
        <img 
          src="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1920" 
          alt="Immigration Process" 
          className="w-full h-96 object-cover"
          loading="lazy"
        />
      </div>

      {/* Features section with icon cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#0A3D91' }}>
            {getContent('immigrationFeaturesHeading')}
          </h2>
          
          {/* Responsive grid of feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              // Dynamically assign icon component
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Icon container with brand colors */}
                  <div className="w-16 h-16 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: '#0A3D91' }}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Feature title and description */}
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process section with step-by-step explanation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#0A3D91' }}>
            {getContent('immigrationProcessHeading')}
          </h2>
          
          <div className="max-w-4xl mx-auto">
            {/* Vertical timeline of process steps */}
            <div className="space-y-12">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Step number badge */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#0A3D91' }}>
                    {index + 1}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#0A3D91' }}>
                      {getContent(`immigrationProcessSteps.${index}`) || translations.immigrationProcessSteps[index]}
                    </h3>
                    <p className="text-gray-700 text-lg">
                      {getContent(`immigrationProcessDescriptions.${index}`) || translations.immigrationProcessDescriptions[index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section with two-column advantages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image gallery for visual appeal */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src="https://images.pexels.com/photos/3184289/pexels-photo-3184289.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Immigration Success"
                  className="rounded-lg shadow-xl w-full h-full object-cover"
                  loading="lazy"
                />
                <img
                  src="https://images.pexels.com/photos/3184290/pexels-photo-3184290.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Family Reunion"
                  className="rounded-lg shadow-xl w-full h-full object-cover mt-6 md:mt-0"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Advantages content with two columns */}
            <div>
              {/* Section heading */}
              <h2 className="text-4xl font-bold mb-8" style={{ color: '#0A3D91' }}>
                {getContent('immigrationWhyChooseHeading')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Technical excellence column */}
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>{getContent('immigrationTechnicalExcellenceHeading')}</h3>
                  <div className="space-y-4">
                    {[
                      'immigrationAdvantages.0',
                      'immigrationAdvantages.1',
                      'immigrationAdvantages.2',
                      'immigrationAdvantages.3',
                      'immigrationAdvantages.4'
                    ].map((key, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#D6001C' }} />
                        <p className="text-lg text-gray-700">
                          {getContent(key) || translations.immigrationAdvantages[index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Commitment to success column */}
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>{getContent('immigrationCommitmentToSuccessHeading')}</h3>
                  <div className="space-y-4">
                    {[
                      'immigrationCommitmentToSuccess.0',
                      'immigrationCommitmentToSuccess.1',
                      'immigrationCommitmentToSuccess.2',
                      'immigrationCommitmentToSuccess.3',
                      'immigrationCommitmentToSuccess.4'
                    ].map((key, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#D6001C' }} />
                        <p className="text-lg text-gray-700">
                          {getContent(key) || translations.immigrationAdvantages[index + 5] || ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Statistics showcase with gradient background */}
              <div className="mt-12 bg-gradient-to-r from-[#0A3D91] to-[#0A3D91]/80 rounded-xl p-8 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">{getContent('immigrationResultsHeading')}</h3>
                <p className="text-xl mb-6 max-w-3xl mx-auto">
                  {getContent('immigrationResultsDescription')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div>
                    <div className="text-4xl font-bold mb-2">{getContent('immigrationStats.0') || translations.immigrationStats[0]}</div>
                    <p className="text-lg">{getContent('immigrationStatLabels.0') || translations.immigrationStatLabels[0]}</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">{getContent('immigrationStats.1') || translations.immigrationStats[1]}</div>
                    <p className="text-lg">{getContent('immigrationStatLabels.1') || translations.immigrationStatLabels[1]}</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">{getContent('immigrationStats.2') || translations.immigrationStats[2]}</div>
                    <p className="text-lg">{getContent('immigrationStatLabels.2') || translations.immigrationStatLabels[2]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final call-to-action section with brand colors */}
      <section className="py-20 bg-[#0A3D91] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Call-to-action heading */}
          <h2 className="text-4xl font-bold mb-6">{getContent('immigrationCallToAction')}</h2>
          <p className="text-xl mb-8">
            {getContent('immigrationCallToActionDescription')}
          </p>
          
          {/* Registration button with hover effects */}
          <Link
            to={`/register?service=${encodeURIComponent('MANÉ Immigration')}`}
            className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl"
            style={{ backgroundColor: '#D6001C' }}
          >
            {translations.applyNow}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}