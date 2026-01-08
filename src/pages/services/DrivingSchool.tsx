import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, Car, Clock, Award, MapPin, Users, Star, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

const getBannerImages = () => [
  '/images/Auto ecole/Auto1.jpg',
  '/images/Auto ecole/Auto2.jpg',
  '/images/Auto ecole/Auto3.jpg',
  '/images/Auto ecole/Auto4.jpg',
  '/images/Auto ecole/Auto5.jpg',
  '/images/Auto ecole/Auto6.jpg',
  '/images/Auto ecole/Auto7.jpg'
];

export default function DrivingSchool() {
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
        .eq('section', 'driving-school');

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
          return '/images/Auto ecole/Auto1.jpg';
        case 'instructorImage':
          return '/images/Auto ecole/Auto2.jpg';
        case 'carImage':
          return '/images/Auto ecole/Auto3.jpg';
        case 'roadImage':
          return '/images/Auto ecole/Auto4.jpg';
        default:
          return '';
      }
    }
    return content[key];
  };
  
  // Using a completely generic approach to avoid TypeScript errors
  const features = [
    { icon: Users, title: getContent('feature1Title') || 'Certified Instructors', description: getContent('feature1Description') || 'Highly qualified, licensed instructors with extensive driving experience and professional teaching credentials.' },
    { icon: Car, title: getContent('feature2Title') || 'Modern Vehicles', description: getContent('feature2Description') || 'Well-maintained, late-model vehicles equipped with dual controls for safe, effective learning experience.' },
    { icon: Clock, title: getContent('feature3Title') || 'Flexible Scheduling', description: getContent('feature3Description') || 'Convenient lesson scheduling that fits your busy lifestyle, including evenings and weekends.' },
    { icon: Award, title: getContent('feature4Title') || 'Comprehensive Curriculum', description: getContent('feature4Description') || 'Complete curriculum covering all aspects of safe driving, from basics to advanced defensive techniques.' },
    { icon: Shield, title: getContent('feature5Title') || 'Safe Learning Environment', description: getContent('feature5Description') || 'Controlled learning environment with emphasis on safety protocols and risk-free practice sessions.' },
    { icon: Star, title: getContent('feature6Title') || 'Personalized Attention', description: getContent('feature6Description') || 'Individualized instruction tailored to your specific needs, learning pace, and skill level.' },
    { icon: MapPin, title: getContent('feature7Title') || 'Affordable Pricing', description: getContent('feature7Description') || 'Competitive pricing with transparent fee structure and flexible payment options available.' },
    { icon: CheckCircle, title: getContent('feature8Title') || 'Guaranteed Results', description: getContent('feature8Description') || 'Confidence-building program with proven track record of successful licensing exam results.' }
  ];

  const courses = [
    {
      categoryKey: getContent('course1TitleKey') || 'drivingSchoolBeginnerCategory',
      detailsKey: getContent('course1DetailsKey') || 'drivingSchoolBeginnerDetails'
    },
    {
      categoryKey: getContent('course2TitleKey') || 'drivingSchoolAdvancedCategory',
      detailsKey: getContent('course2DetailsKey') || 'drivingSchoolAdvancedDetails'
    },
    {
      categoryKey: getContent('course3TitleKey') || 'drivingSchoolLicenseTestCategory',
      detailsKey: getContent('course3DetailsKey') || 'drivingSchoolLicenseTestDetails'
    },
    {
      categoryKey: getContent('course4TitleKey') || 'drivingSchoolRefresherCategory',
      detailsKey: getContent('course4DetailsKey') || 'drivingSchoolRefresherDetails'
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
                <Logo size="lg" serviceType="driving" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{translations.drivingSchoolTitle || 'Auto-École Mane d\'Afrique'}</h1>
              </div>
              <p className="text-xl md:text-3xl max-w-2xl font-light mb-8 animate-fade-in-delay">
                {translations.drivingSchoolSubtitle || 'Master the road with confidence through our comprehensive driving education programs'}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
                <Link
                  to={`/register?service=${encodeURIComponent(translations.drivingSchoolTitle || 'Auto-École Mane d\'Afrique')}`}
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  style={{ backgroundColor: '#D6001C' }}
                >
                  Apply Now
                  <Car className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#courses"
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl border-2 border-white text-white"
                >
                  Our Driving Courses
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
                  {getContent('drivingSchoolMainHeading') || translations.drivingSchoolMainHeading || 'Expert Driving Instruction That Builds Confident, Responsible Drivers'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {getContent('drivingSchoolMainDescription1') || translations.drivingSchoolMainDescription1 || 'Mane Driving School is committed to developing skilled, responsible drivers who navigate roads safely and confidently. Our certified instructors use modern teaching techniques and vehicles equipped with dual controls to ensure a safe learning environment. We cater to beginners, experienced drivers seeking improvement, and those preparing for licensing exams.'}
                </p>
                <p className="text-lg text-gray-700">
                  {getContent('drivingSchoolMainDescription2') || translations.drivingSchoolMainDescription2 || 'Our comprehensive curriculum covers everything from basic vehicle operation and traffic laws to advanced defensive driving techniques. Whether you\'re a teenager getting your first license, an adult upgrading your skills, or someone moving from another country, our patient instructors adapt to your learning pace and style.'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  Our Driving Programs
                </h3>
                <p className="text-gray-700 mb-6">
                  Professional driving school offering comprehensive training programs for all license categories. Our certified instructors provide safe, effective, and convenient driving lessons tailored to your schedule and learning pace.
                </p>
                <img 
                  src={getImage('instructorImage')} 
                  alt="Certified Driving Instructor" 
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
                Driving Excellence in Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience our modern fleet and professional training environment
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('carImage')} 
                  alt="Modern Training Vehicle" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Modern Training Vehicles</h3>
                  <p className="text-gray-600">Well-maintained vehicles with dual controls for safe learning</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('roadImage')} 
                  alt="Road Training" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Real Road Experience</h3>
                  <p className="text-gray-600">Practical training in various driving conditions</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('mainImage')} 
                  alt="Driving School" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Safe Learning Environment</h3>
                  <p className="text-gray-600">Controlled practice in secure training areas</p>
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
                {translations.drivingSchoolFeaturesHeading || 'Why Choose Our Driving School'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.drivingSchoolHeroDescription || 'Professional driving instruction for safe, confident drivers'}
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

        {/* Courses Section */}
        <section id="courses" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                {translations.drivingSchoolCoursesHeading || 'Our Driving Courses'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.drivingSchoolDescription || 'Professional driving school offering comprehensive training programs for all license categories. Our certified instructors provide safe, effective, and convenient driving lessons tailored to your schedule and learning pace.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>{typeof translations[course.categoryKey as keyof typeof translations] === 'string' ? translations[course.categoryKey as keyof typeof translations] as string : course.categoryKey}</h3>
                    <ul className="space-y-2">
                      {(translations[course.detailsKey as keyof typeof translations] as string[] || []).map((detail: string, detailIndex: number) => (
                        <li key={detailIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
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
              {translations.drivingSchoolCtaHeading || 'Ready to Hit the Road?'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {translations.drivingSchoolCallToActionDescription || 'Join our community of confident drivers and start your journey to safe, independent motoring today.'}
            </p>
            <Link
              to={`/register?service=${encodeURIComponent('Auto-École Mane d\'Afrique')}`}
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