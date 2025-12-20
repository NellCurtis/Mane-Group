import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider';
import Testimonials from '../components/Testimonials';

import Statistics from '../components/Statistics';
import FAQ from '../components/FAQ';
import SocialProof from '../components/SocialProof';
import { ArrowRight, Globe, GraduationCap, Languages, Lightbulb, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
/**
 * Hero images for the homepage slider
 * High-quality professional images representing the company's services
 */
const heroImages = [
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920'
];

/**
 * Service data structure
 * Defines all services offered by MANÉ GROUP with:
 * - Unique identifiers
 * - Titles and descriptions
 * - Image galleries
 * - Icons for visual representation
 * - Links to detailed service pages
 */
interface Service {
  id: string;
  title: string;
  descriptionKey: string;
  images: string[];
  icon: React.ElementType;
  link: string;
}

const services: Service[] = [
  {
    id: 'immigration',
    title: 'MANÉ Immigration',
    descriptionKey: 'immigrationDescription',
    images: [
      'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/4427610/pexels-photo-4427610.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    icon: Globe,
    link: '/services/immigration'
  },
  {
    id: 'driving-school',
    title: 'Auto-École Mane d\'Afrique',
    descriptionKey: 'drivingSchoolDescription',
    images: [
      'https://images.pexels.com/photos/1028746/pexels-photo-1028746.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1687147/pexels-photo-1687147.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    icon: GraduationCap,
    link: '/services/driving-school'
  },
  {
    id: 'languages',
    title: 'Mane Multi-Linguistique',
    descriptionKey: 'languagesDescription',
    images: [
      'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6325984/pexels-photo-6325984.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    icon: Languages,
    link: '/services/languages'
  },
  {
    id: 'innovation',
    title: 'Mane Innovation',
    descriptionKey: 'innovationDescription',
    images: [
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    icon: Lightbulb,
    link: '/services/innovation'
  },
  {
    id: 'graphic-design',
    title: 'Mane Graphic Design',
    descriptionKey: 'graphicDesignDescription',
    images: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    icon: Palette,
    link: '/services/graphic-design'
  }
];

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
 * Home Page Component
 * Main landing page for the MANÉ GROUP website
 * 
 * Features:
 * - Hero section with image slider and call-to-action
 * - Services showcase with alternating layouts
 * - About section highlighting company values
 * - Contact section encouraging user engagement
 * - Responsive design for all device sizes
 * - Multi-language support
 * - Micro-interactions with hover animations
 * - Smooth scrolling for anchor links
 */
export default function Home() {
  // Access translations from language context
  const { translations } = useLanguage();
  
  // Helper function to convert kebab-case to camelCase
  const toCamelCase = (str: string) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero section with full-width image slider */}
      <section className="relative">
        <ImageSlider images={heroImages} height="h-[600px]" />
        {/* Overlay with company branding and call-to-action */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {translations.homeTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
              {translations.homeSubtitle}
            </p>
            <button
              onClick={() => scrollToElement('services')}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-fade-in-delay-2"
              style={{ backgroundColor: '#D6001C' }}
            >
              {translations.homeServicesTitle}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Services section showcasing all offerings */}
      <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Subtle MANE watermark background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-9xl font-bold text-[#0A3D91] transform -rotate-12">
            MANE
          </div>
          <div className="absolute bottom-1/4 right-1/4 text-9xl font-bold text-[#D6001C] transform rotate-12">
            GROUP
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header with title and description */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0A3D91]">
              <span className="font-extrabold">MANE</span> {translations.homeServicesTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translations.homeServicesDescription}
            </p>
          </div>

          {/* Services grid with alternating layouts */}
          <div className="space-y-20">
            {services.map((service, index) => {
              // Dynamically assign icon component
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Service image gallery */}
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <ImageSlider
                      images={service.images}
                      height="h-80"
                      autoPlay={true}
                      interval={4000}
                    />
                  </div>

                  {/* Service description and call-to-action */}
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''} space-y-6 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-center space-x-3">
                      {/* Service icon with brand colors */}
                      <div className="p-3 rounded-lg transition-transform duration-300 hover:scale-110" style={{ backgroundColor: '#0A3D91' }}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      {/* Service title with dynamic translation - Enhanced styling for MANE branding */}
                      <h3 className="text-3xl font-bold text-[#0A3D91]">
                        <span className="font-extrabold">
                          {(translations as any)[`${toCamelCase(service.id)}Title`] || service.title}
                        </span>
                      </h3>
                    </div>
                    {/* Service description with dynamic translation */}
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {(translations as any)[service.descriptionKey] || (translations as any)[`${toCamelCase(service.id)}Description`] || ''}
                    </p>
                    {/* Learn more button linking to service page */}
                    <Link
                      to={service.link}
                      className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                      style={{ backgroundColor: '#D6001C' }}
                    >
                      {translations.learnMore}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      
      {/* Social Proof section */}
      <SocialProof />
      
      {/* Statistics section */}
      <Statistics />
      
      {/* FAQ section */}
      <FAQ />

      {/* Testimonials section */}
      <Testimonials />
      {/* About section with company information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text content about the company */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-[#0A3D91]">
                {translations.homeAboutTitle}
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {translations.homeAboutDescription}
              </p>
              {/* Read more button linking to about page */}
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                style={{ backgroundColor: '#0A3D91' }}
              >
                {translations.readMore}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            {/* Company image */}
            <div>
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={translations.homeAboutImageAlt || "About MANÉ GROUP"}
                className="rounded-lg shadow-xl w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Contact section with call-to-action */}
      <section className="py-20 bg-[#0A3D91] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{translations.homeContactTitle}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {translations.homeContactDescription}
          </p>
          {/* Contact us button linking to contact page */}
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            style={{ backgroundColor: '#D6001C' }}
          >
            {translations.contactUs}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}