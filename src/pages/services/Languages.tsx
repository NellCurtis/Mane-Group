import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, BookOpen, Users, Globe, Trophy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

const getBannerImages = () => [
  '/images/Linguistic/ling1.jpg',
  '/images/Linguistic/ling2.jpg',
  '/images/Linguistic/ling3.jpg',
  '/images/Linguistic/ling1.jpg',
  '/images/Linguistic/ling2.jpg',
  '/images/Linguistic/ling3.jpg'
];

export default function Languages() {
  const { translations, language } = useLanguage();
  
  // State for managing dynamic content and loading status
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    fetchContent();
  }, []);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section', 'languages');

      if (error) throw error;

      const contentObj: any = {};
      data?.forEach(item => {
        contentObj[item.key] = language === 'en' ? item.englishText : item.frenchText;
      });

      setContent(contentObj);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getContent = (key: string) => {
    if (loading || !content[key]) {
      return translations[key as keyof typeof translations] || '';
    }
    return content[key];
  };
  
  const getImage = (key: string) => {
    if (loading || !content[key]) {
      // Return default image based on key
      switch(key) {
        case 'bannerImages':
          return getBannerImages();
        case 'mainImage':
          return '/images/Linguistic/ling1.jpg';
        case 'classroomImage':
          return '/images/Linguistic/ling2.jpg';
        case 'cultureImage':
          return '/images/Linguistic/ling3.jpg';
        case 'studentsImage':
          return '/images/Linguistic/ling1.jpg';
        default:
          return '';
      }
    }
    return content[key];
  };
  
  // Using a completely generic approach to avoid TypeScript errors
  const features = [
    { icon: Users, title: getContent('feature1Title') || 'Native Speaking Instructors', description: getContent('feature1Description') || 'Learn from fluent native speakers who bring authentic pronunciation, cultural insights, and real-world language expertise to every lesson.' },
    { icon: BookOpen, title: getContent('feature2Title') || 'Interactive Learning Methods', description: getContent('feature2Description') || 'Engage in dynamic, participatory classes that promote active speaking, listening, reading, and writing skills development.' },
    { icon: Globe, title: getContent('feature3Title') || 'Flexible Class Schedules', description: getContent('feature3Description') || 'Choose from various scheduling options including morning, evening, weekend, and intensive courses to fit your busy lifestyle.' },
    { icon: Trophy, title: getContent('feature4Title') || 'Cultural Immersion Programs', description: getContent('feature4Description') || 'Experience authentic cultural elements through themed events, conversation clubs, and multimedia resources that enhance learning.' }
  ];

  const languages = [
    {
      nameKey: getContent('language1NameKey') || 'language1Name',
      levelsKey: getContent('language1LevelsKey') || 'language1Levels',
      descriptionKey: getContent('language1DescriptionKey') || 'language1Description',
      benefitsKey: getContent('language1BenefitsKey') || 'language1Benefits'
    },
    {
      nameKey: getContent('language2NameKey') || 'language2Name',
      levelsKey: getContent('language2LevelsKey') || 'language2Levels',
      descriptionKey: getContent('language2DescriptionKey') || 'language2Description',
      benefitsKey: getContent('language2BenefitsKey') || 'language2Benefits'
    },
    {
      nameKey: getContent('language3NameKey') || 'language3Name',
      levelsKey: getContent('language3LevelsKey') || 'language3Levels',
      descriptionKey: getContent('language3DescriptionKey') || 'language3Description',
      benefitsKey: getContent('language3BenefitsKey') || 'language3Benefits'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <ImageSlider images={getImage('bannerImages') || getBannerImages()} height="h-[70vh]" autoPlay={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D91]/90 via-[#0A3D91]/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6 animate-fade-in">
                <Logo size="lg" serviceType="languages" />
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
                  {getContent('languagesMainHeading') || translations.languagesMainHeading || 'Language Education That Opens Doors to Global Opportunities'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {getContent('languagesMainDescription1') || translations.languagesMainDescription1 || 'Mane Languages offers comprehensive language education programs designed to unlock global opportunities for individuals and businesses. Our experienced native speakers and certified instructors employ proven teaching methodologies to help students achieve fluency in multiple languages. Whether you\'re preparing for travel, academic pursuits, professional advancement, or personal enrichment, our tailored programs meet your specific needs.'}
                </p>
                <p className="text-lg text-gray-700">
                  {getContent('languagesMainDescription2') || translations.languagesMainDescription2 || 'With courses in English, French, Spanish, German, Mandarin, and Arabic, we provide structured learning paths from beginner to advanced proficiency levels. Our interactive approach combines traditional teaching methods with modern technology and cultural immersion to ensure effective language acquisition.'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  Our Language Programs
                </h3>
                <p className="text-gray-700 mb-6">
                  Multilingual language training center offering courses in French, English, Spanish, and more. Expert native-speaking instructors provide flexible learning options for all proficiency levels from beginner to advanced.
                </p>
                <img 
                  src={getImage('classroomImage')} 
                  alt="Language Classroom" 
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Image Gallery Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                Cultural Learning Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Immerse yourself in authentic cultural and language experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('studentsImage')} 
                  alt="Language Students" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Interactive Learning</h3>
                  <p className="text-gray-600">Engaging group activities and conversation practice</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('cultureImage')} 
                  alt="Cultural Immersion" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Cultural Immersion</h3>
                  <p className="text-gray-600">Experience authentic cultural elements through themed events</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('mainImage')} 
                  alt="Language Education" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Native Instructors</h3>
                  <p className="text-gray-600">Learn from fluent native speakers with real-world expertise</p>
                </div>
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