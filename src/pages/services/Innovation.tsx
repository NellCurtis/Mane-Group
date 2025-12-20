import { Link } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../components/Logo';
import { ArrowRight, CheckCircle, Code, Cloud, Smartphone, Database } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const getBannerImages = () => [
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184285/pexels-photo-3184285.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg?auto=compress&cs=tinysrgb&w=1920'
];

export default function Innovation() {
  const { translations } = useLanguage();
  const bannerImages = getBannerImages();
  
  // Using a completely generic approach to avoid TypeScript errors
  const features = [
    { icon: Code, title: 'Custom Software Development', description: 'Bespoke software solutions engineered to address your unique business challenges and objectives.' },
    { icon: Cloud, title: 'Mobile Application Creation', description: 'Native and cross-platform mobile applications designed for optimal user engagement and performance.' },
    { icon: Smartphone, title: 'Data Analytics & Insights', description: 'Transform data into actionable business insights through advanced analytics and visualization tools.' },
    { icon: Database, title: 'Cloud Infrastructure', description: 'Scalable cloud infrastructure solutions that ensure reliability, security, and cost-effectiveness.' },
    { icon: Code, title: 'AI & Machine Learning', description: 'Intelligent automation and predictive modeling to drive innovation and competitive advantage.' },
    { icon: Cloud, title: 'Digital Transformation Strategy', description: 'Comprehensive digital strategy consulting to align technology with business goals and growth.' }
  ];

  const services = [
    {
      titleKey: 0,
      itemsKey: 0
    },
    {
      titleKey: 1,
      itemsKey: 1
    },
    {
      titleKey: 2,
      itemsKey: 2
    },
    {
      titleKey: 3,
      itemsKey: 3
    },
    {
      titleKey: 4,
      itemsKey: 4
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
                  {translations.innovationMainHeading || 'Technology & Digital Transformation That Transforms Businesses'}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {translations.innovationMainDescription1 || 'Mane Innovation is your visionary technology partner, driving digital transformation through cutting-edge solutions that propel your business into the future. Our elite team of developers, architects, and innovation specialists collaborate to architect transformative technologies that revolutionize operations, accelerate growth, and establish competitive advantages in today\'s rapidly evolving digital landscape.'}
                </p>
                <p className="text-lg text-gray-700">
                  {translations.innovationMainDescription2 || 'From ideation to implementation and beyond, we orchestrate your complete digital evolution with precision and expertise. Harnessing emerging technologies and industry-leading methodologies, we engineer robust, scalable, and future-proof solutions. Whether you\'re launching a groundbreaking startup platform, optimizing enterprise systems, or executing a comprehensive digital overhaul, our proven track record ensures extraordinary outcomes.'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                  Our Technology Services
                </h3>
                <p className="text-gray-700 mb-6">
                  Technology solutions and digital transformation services for businesses. We deliver cutting-edge software development, IT consulting, and innovative solutions to help your business thrive in the digital age.
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