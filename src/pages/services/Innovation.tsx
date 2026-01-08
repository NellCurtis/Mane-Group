import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, Code, Cloud, Smartphone, Database } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

const getBannerImages = () => [
  '/images/innovation/inno1.jpg',
  '/images/innovation/inno2.jpg',
  '/images/innovation/inno3.jpg',
  '/images/innovation/inno4.jpg',
  '/images/innovation/inno5.jpg',
  '/images/innovation/inno6.jpg',
  '/images/innovation/inno7.jpg'
];

export default function Innovation() {
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
        .eq('section', 'innovation');

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
          return '/images/innovation/inno1.jpg';
        case 'codeImage':
          return '/images/innovation/inno2.jpg';
        case 'mobileImage':
          return '/images/innovation/inno3.jpg';
        case 'cloudImage':
          return '/images/innovation/inno4.jpg';
        default:
          return '';
      }
    }
    return content[key];
  };
  
  // Using a completely generic approach to avoid TypeScript errors
  const features = [
    { icon: Code, title: getContent('feature1Title') || 'Custom Software Development', description: getContent('feature1Description') || 'Bespoke software solutions engineered to address your unique business challenges and objectives.' },
    { icon: Cloud, title: getContent('feature2Title') || 'Mobile Application Creation', description: getContent('feature2Description') || 'Native and cross-platform mobile applications designed for optimal user engagement and performance.' },
    { icon: Smartphone, title: getContent('feature3Title') || 'Data Analytics & Insights', description: getContent('feature3Description') || 'Transform data into actionable business insights through advanced analytics and visualization tools.' },
    { icon: Database, title: getContent('feature4Title') || 'Cloud Infrastructure', description: getContent('feature4Description') || 'Scalable cloud infrastructure solutions that ensure reliability, security, and cost-effectiveness.' },
    { icon: Code, title: getContent('feature5Title') || 'AI & Machine Learning', description: getContent('feature5Description') || 'Intelligent automation and predictive modeling to drive innovation and competitive advantage.' },
    { icon: Cloud, title: getContent('feature6Title') || 'Digital Transformation Strategy', description: getContent('feature6Description') || 'Comprehensive digital strategy consulting to align technology with business goals and growth.' }
  ];

  const services = [
    {
      titleKey: getContent('service1TitleKey') || 'service1Title',
      itemsKey: getContent('service1ItemsKey') || 'service1Items'
    },
    {
      titleKey: getContent('service2TitleKey') || 'service2Title',
      itemsKey: getContent('service2ItemsKey') || 'service2Items'
    },
    {
      titleKey: getContent('service3TitleKey') || 'service3Title',
      itemsKey: getContent('service3ItemsKey') || 'service3Items'
    },
    {
      titleKey: getContent('service4TitleKey') || 'service4Title',
      itemsKey: getContent('service4ItemsKey') || 'service4Items'
    },
    {
      titleKey: getContent('service5TitleKey') || 'service5Title',
      itemsKey: getContent('service5ItemsKey') || 'service5Items'
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
                <Logo size="lg" serviceType="innovation" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{translations.innovationTitle || 'Mane Innovation'}</h1>
              </div>
              <p className="text-xl md:text-3xl max-w-2xl font-light mb-8 animate-fade-in-delay">
                {translations.innovationSubtitle || 'Transforming businesses through cutting-edge technology solutions'}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
                <Link
                  to={`/register?service=${encodeURIComponent(translations.innovationTitle || 'Mane Innovation')}`}
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  style={{ backgroundColor: '#D6001C' }}
                >
                  Apply Now
                  <Code className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl border-2 border-white text-white"
                >
                  Our Technology Services
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
                  {getContent('innovationMainHeading') || translations.innovationMainHeading || 'Technology & Digital Transformation That Transforms Businesses'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {getContent('innovationMainDescription1') || translations.innovationMainDescription1 || 'Mane Innovation is your visionary technology partner, driving digital transformation through cutting-edge solutions that propel your business into the future. Our elite team of developers, architects, and innovation specialists collaborate to architect transformative technologies that revolutionize operations, accelerate growth, and establish competitive advantages in today\'s rapidly evolving digital landscape.'}
                </p>
                <p className="text-lg text-gray-700">
                  {getContent('innovationMainDescription2') || translations.innovationMainDescription2 || 'From ideation to implementation and beyond, we orchestrate your complete digital evolution with precision and expertise. Harnessing emerging technologies and industry-leading methodologies, we engineer robust, scalable, and future-proof solutions. Whether you\'re launching a groundbreaking startup platform, optimizing enterprise systems, or executing a comprehensive digital overhaul, our proven track record ensures extraordinary outcomes.'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  Our Technology Services
                </h3>
                <p className="text-gray-700 mb-6">
                  Technology solutions and digital transformation services for businesses. We deliver cutting-edge software development, IT consulting, and innovative solutions to help your business thrive in the digital age.
                </p>
                <img 
                  src={getImage('codeImage')} 
                  alt="Code Development" 
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
                Innovation in Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience our cutting-edge technology solutions and digital transformation services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('mobileImage')} 
                  alt="Mobile Application" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Mobile Solutions</h3>
                  <p className="text-gray-600">Native and cross-platform mobile applications</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('cloudImage')} 
                  alt="Cloud Infrastructure" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Cloud Infrastructure</h3>
                  <p className="text-gray-600">Scalable cloud solutions for your business needs</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('mainImage')} 
                  alt="Innovation Hub" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>AI & ML Solutions</h3>
                  <p className="text-gray-600">Intelligent automation and predictive modeling</p>
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
                {translations.innovationFeaturesHeading || 'Why Choose Our Innovation Services'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.innovationHeroDescription || 'Driving digital transformation with innovative technology services'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Services Section */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                Our Technology Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Technology solutions and digital transformation services for businesses. We deliver cutting-edge software development, IT consulting, and innovative solutions to help your business thrive in the digital age.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                      {(translations.innovationServiceTitles && translations.innovationServiceTitles[service.titleKey]) || 'Service'}
                    </h3>
                    <ul className="space-y-2">
                      {(translations.innovationServiceItems && translations.innovationServiceItems[service.itemsKey] || []).map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
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
              Ready to Innovate Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Partner with us to leverage technology for unprecedented business growth and innovation.
            </p>
            <Link
              to={`/register?service=${encodeURIComponent('Mane Innovation')}`}
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