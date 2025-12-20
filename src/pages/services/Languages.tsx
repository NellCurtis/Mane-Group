import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, BookOpen, Users, Globe, Trophy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const getBannerImages = () => [
  'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/6325984/pexels-photo-6325984.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/5212325/pexels-photo-5212325.jpeg?auto=compress&cs=tinysrgb&w=1920'
];

export default function Languages() {
  const { translations } = useLanguage();
  const bannerImages = getBannerImages();
  
  // Using a completely generic approach to avoid TypeScript errors
  const features = [
    { icon: Users, title: 'Native Speaking Instructors', description: 'Learn from fluent native speakers who bring authentic pronunciation, cultural insights, and real-world language expertise to every lesson.' },
    { icon: BookOpen, title: 'Interactive Learning Methods', description: 'Engage in dynamic, participatory classes that promote active speaking, listening, reading, and writing skills development.' },
    { icon: Globe, title: 'Flexible Class Schedules', description: 'Choose from various scheduling options including morning, evening, weekend, and intensive courses to fit your busy lifestyle.' },
    { icon: Trophy, title: 'Cultural Immersion Programs', description: 'Experience authentic cultural elements through themed events, conversation clubs, and multimedia resources that enhance learning.' }
  ];

  const languages = [
    {
      nameKey: 0,
      levelsKey: 0,
      descriptionKey: 0,
      benefitsKey: 0
    },
    {
      nameKey: 1,
      levelsKey: 1,
      descriptionKey: 1,
      benefitsKey: 1
    },
    {
      nameKey: 2,
      levelsKey: 2,
      descriptionKey: 2,
      benefitsKey: 2
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <ImageSlider images={bannerImages} height="h-[650px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D91]/90 via-[#0A3D91]/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6 animate-fade-in">
                <Logo size="lg" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{translations.languagesTitle || 'Mane Multi-Linguistique'}</h1>
              </div>
              <p className="text-xl md:text-3xl max-w-2xl font-light mb-8 animate-fade-in-delay">
                {translations.languagesSubtitle || 'Unlock global opportunities through comprehensive language education'}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
                <Link
                  to={`/register?service=${encodeURIComponent(translations.languagesTitle || 'Mane Multi-Linguistique')}`}
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  style={{ backgroundColor: '#D6001C' }}
                >
                  Apply Now
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#programs"
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl border-2 border-white text-white"
                >
                  Our Language Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Description Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  {translations.languagesMainHeading || 'Language Education That Opens Doors to Global Opportunities'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {translations.languagesMainDescription1 || 'Mane Languages offers comprehensive language education programs designed to unlock global opportunities for individuals and businesses. Our experienced native speakers and certified instructors employ proven teaching methodologies to help students achieve fluency in multiple languages. Whether you\'re preparing for travel, academic pursuits, professional advancement, or personal enrichment, our tailored programs meet your specific needs.'}
                </p>
                <p className="text-lg text-gray-700">
                  {translations.languagesMainDescription2 || 'With courses in English, French, Spanish, German, Mandarin, and Arabic, we provide structured learning paths from beginner to advanced proficiency levels. Our interactive approach combines traditional teaching methods with modern technology and cultural immersion to ensure effective language acquisition.'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  Our Language Programs
                </h3>
                <p className="text-gray-700 mb-6">
                  Multilingual language training center offering courses in French, English, Spanish, and more. Expert native-speaking instructors provide flexible learning options for all proficiency levels from beginner to advanced.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                {translations.languagesFeaturesHeading || 'Why Choose Our Language Programs'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.languagesHeroDescription || 'Master new languages with expert instruction and immersive learning experiences'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0A3D91' }}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#0A3D91' }}>{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                {translations.languagesCoursesHeading || 'Our Language Programs'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.languagesDescription || 'Multilingual language training center offering courses in French, English, Spanish, and more. Expert native-speaking instructors provide flexible learning options for all proficiency levels from beginner to advanced.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {languages.map((language, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                      {(translations.languagesProgramNames && translations.languagesProgramNames[language.nameKey]) || 'Language Program'}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {(translations.languagesProgramDescriptions && translations.languagesProgramDescriptions[language.descriptionKey]) || ''}
                    </p>
                    <div className="mb-4">
                      <h4 className="font-bold mb-2">Levels:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(translations.languagesProgramLevels && translations.languagesProgramLevels[language.levelsKey] || []).map((level: string, levelIndex: number) => (
                          <span key={levelIndex} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {(translations.languagesProgramBenefits && translations.languagesProgramBenefits[language.benefitsKey] || []).map((benefit: string, benefitIndex: number) => (
                          <li key={benefitIndex} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0A3D91' }}>
              Ready to Speak a New Language?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of language learners and start your journey to global communication today.
            </p>
            <Link
              to={`/register?service=${encodeURIComponent('Mane Multi-Linguistique')}`}
              className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105 text-white"
              style={{ backgroundColor: '#D6001C' }}
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}