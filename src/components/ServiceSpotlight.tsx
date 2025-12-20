import { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface Service {
  id: string;
  title: string;
  description: string;
  rating: number;
  students: number;
  link: string;
  featured: boolean;
}

export default function ServiceSpotlight() {
  const { translations } = useLanguage();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Featured services data
  const services: Service[] = [
    {
      id: 'immigration',
      title: 'MANÉ Immigration',
      description: 'Expert visa and immigration services for individuals, families, and businesses seeking opportunities abroad. Our experienced consultants guide you through complex immigration processes with personalized support.',
      rating: 4.9,
      students: 1250,
      link: '/services/immigration',
      featured: true
    },
    {
      id: 'driving-school',
      title: 'Auto-École Mane d\'Afrique',
      description: 'Professional driving school offering comprehensive training programs for all license categories. Our certified instructors provide safe, effective, and convenient driving lessons tailored to your schedule and learning pace.',
      rating: 4.8,
      students: 2100,
      link: '/services/driving-school',
      featured: true
    },
    {
      id: 'languages',
      title: 'Mane Multi-Linguistique',
      description: 'Multilingual language training center offering courses in French, English, Spanish, and more. Expert native-speaking instructors provide flexible learning options for all proficiency levels from beginner to advanced.',
      rating: 4.7,
      students: 850,
      link: '/services/languages',
      featured: true
    }
  ];

  const featuredServices = services.filter(service => service.featured);

  // Auto-rotate featured services every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex(prevIndex => 
        prevIndex === featuredServices.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredServices.length]);

  const currentService = featuredServices[currentServiceIndex];

  return (
    <section className="py-16 bg-gradient-to-r from-[#0A3D91] to-[#D6001C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {translations.homeServicesTitle || "Service Spotlight"}
          </h2>          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {translations.homeServicesDescription || "Discover our most popular services this week"}
          </p>        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-2 font-semibold">{currentService.rating} Rating</span>
                <span className="mx-2">•</span>
                <span>{currentService.students}+ Students</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-4">{currentService.title}</h3>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                {currentService.description}
              </p>
              
              <Link
                to={currentService.link}
                className="inline-flex items-center px-6 py-3 bg-white text-[#0A3D91] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                {translations.learnMore}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80" />
              <div className="absolute -bottom-4 -right-4 bg-[#D6001C] text-white px-4 py-2 rounded-lg font-semibold">
                Featured
              </div>            </div>
          </div>
          
          {/* Service indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredServices.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentServiceIndex(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentServiceIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`View service ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}