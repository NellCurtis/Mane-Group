import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, Palette, Layers, Image, Video } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

const getBannerImages = () => [
  '/images/Design/des1.jpg',
  '/images/Design/des2.jpg',
  '/images/Design/des3.jpg',
  '/images/Design/des4.jpg',
  '/images/Design/des5.jpg',
  '/images/Design/des6.jpg',
  '/images/Design/des7.jpg'
];

export default function GraphicDesign() {
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
        .eq('section', 'graphic-design');

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
          return '/images/Design/des1.jpg';
        case 'brandImage':
          return '/images/Design/des2.jpg';
        case 'digitalImage':
          return '/images/Design/des3.jpg';
        case 'printImage':
          return '/images/Design/des4.jpg';
        default:
          return '';
      }
    }
    return content[key];
  };
  
  // Using a completely generic approach to avoid TypeScript errors
  const features = [
    { icon: Palette, title: getContent('feature1Title') || 'Brand Identity Design', description: getContent('feature1Description') || 'Develop distinctive logos and comprehensive brand identities that establish memorable market presence.' },
    { icon: Layers, title: getContent('feature2Title') || 'Marketing Materials', description: getContent('feature2Description') || 'Create eye-catching brochures, flyers, banners, and promotional materials that drive engagement.' },
    { icon: Image, title: getContent('feature3Title') || 'Digital Experiences', description: getContent('feature3Description') || 'Design intuitive websites, apps, and digital interfaces that enhance user experience and conversion.' },
    { icon: Video, title: getContent('feature4Title') || 'Print & Packaging', description: getContent('feature4Description') || 'Craft attractive packaging and print materials that showcase products and reinforce brand recognition.' },
    { icon: Layers, title: getContent('feature5Title') || 'Motion Graphics', description: getContent('feature5Description') || 'Dynamic animations and visual effects that bring brands to life across digital platforms.' },
    { icon: Palette, title: getContent('feature6Title') || 'UX/UI Design', description: getContent('feature6Description') || 'User-centered design approaches that optimize usability and create seamless digital journeys.' }
  ];

  const designServices = [
    {
      categoryKey: getContent('service1CategoryKey') || 'service1Category',
      servicesKey: getContent('service1ServicesKey') || 'service1Services'
    },
    {
      categoryKey: getContent('service2CategoryKey') || 'service2Category',
      servicesKey: getContent('service2ServicesKey') || 'service2Services'
    },
    {
      categoryKey: getContent('service3CategoryKey') || 'service3Category',
      servicesKey: getContent('service3ServicesKey') || 'service3Services'
    },
    {
      categoryKey: getContent('service4CategoryKey') || 'service4Category',
      servicesKey: getContent('service4ServicesKey') || 'service4Services'
    },
    {
      categoryKey: getContent('service5CategoryKey') || 'service5Category',
      servicesKey: getContent('service5ServicesKey') || 'service5Services'
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
                <Logo size="lg" serviceType="graphicDesign" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{translations.graphicDesignTitle || 'Mane Graphic Design'}</h1>
              </div>
              <p className="text-xl md:text-3xl max-w-2xl font-light mb-8 animate-fade-in-delay">
                {translations.graphicDesignSubtitle || 'Creating compelling visual experiences that tell your brand story'}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
                <Link
                  to={`/register?service=${encodeURIComponent(translations.graphicDesignTitle || 'Mane Graphic Design')}`}
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  style={{ backgroundColor: '#D6001C' }}
                >
                  Apply Now
                  <Palette className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl border-2 border-white text-white"
                >
                  Our Design Services
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
                  {getContent('graphicDesignMainHeading') || translations.graphicDesignMainHeading || 'Visual Design Excellence That Communicates Your Brand\'s Unique Story'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {getContent('graphicDesignMainDescription1') || translations.graphicDesignMainDescription1 || 'Mane Graphics transforms ideas into stunning visual realities that captivate audiences and communicate your brand\'s essence. Our talented designers combine artistic creativity with strategic thinking to craft compelling visual identities, marketing materials, digital experiences, and brand assets that resonate with your target audience and drive measurable results.'}
                </p>
                <p className="text-lg text-gray-700">
                  {getContent('graphicDesignMainDescription2') || translations.graphicDesignMainDescription2 || 'From logo design and brand identity development to comprehensive marketing campaigns and digital interfaces, we deliver cohesive visual experiences that strengthen your market presence. Our collaborative approach ensures every design element aligns with your brand values, messaging, and business objectives.'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  Our Design Services
                </h3>
                <p className="text-gray-700 mb-6">
                  Creative design services including branding, marketing materials, and digital content. Our talented designers bring your vision to life with stunning visuals that captivate your audience and elevate your brand.
                </p>
                <img 
                  src={getImage('brandImage')} 
                  alt="Brand Identity Design" 
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
                Design Excellence in Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience our creative design solutions and visual storytelling capabilities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('digitalImage')} 
                  alt="Digital Design" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Digital Experiences</h3>
                  <p className="text-gray-600">Intuitive websites and app interfaces</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('printImage')} 
                  alt="Print Design" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Print & Packaging</h3>
                  <p className="text-gray-600">Attractive materials and packaging design</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImage('mainImage')} 
                  alt="Creative Design" 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>Brand Identity</h3>
                  <p className="text-gray-600">Distinctive logos and comprehensive branding</p>
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
                {translations.graphicDesignFeaturesHeading || 'Why Choose Our Design Services'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.graphicDesignHeroDescription || 'Exceptional design solutions that captivate audiences and elevate brands'}
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
                Our Design Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Creative design services including branding, marketing materials, and digital content. Our talented designers bring your vision to life with stunning visuals that captivate your audience and elevate your brand.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designServices.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                      {(translations.graphicDesignServiceCategories && translations.graphicDesignServiceCategories[service.categoryKey]) || 'Service Category'}
                    </h3>
                    <ul className="space-y-2">
                      {(translations.graphicDesignServiceItems && translations.graphicDesignServiceItems[service.servicesKey] || []).map((item: string, itemIndex: number) => (
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
              Ready to Transform Your Brand?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let our creative team transform your ideas into stunning visual experiences.
            </p>
            <Link
              to={`/register?service=${encodeURIComponent('Mane Graphic Design')}`}
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