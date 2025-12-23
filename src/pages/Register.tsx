import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from '../components/Logo';

export default function Register() {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service') || '';
  
  // State to manage service information
  const [serviceInfo, setServiceInfo] = useState({
    name: service,
    description: ''
  });

  // Set service information based on service name
  useEffect(() => {
    if (service) {
      setServiceInfo({
        name: service,
        description: getServiceDescription(service)
      });
    }
  }, [service]);

  // Helper function to get service description
  const getServiceDescription = (serviceName: string) => {
    // This would typically come from translations or a service catalog
    const descriptions: Record<string, string> = {
      "Auto-École Mane d'Afrique": translations.drivingSchoolTitle || "Auto-École Mane d'Afrique",
      "MANÉ Immigration": translations.immigrationTitle || "MANÉ Immigration",
      "Mane Multi-Linguistique": translations.languagesTitle || "Mane Multi-Linguistique",
      "Mane Innovation": translations.innovationTitle || "Mane Innovation",
      "Mane Graphic Design": translations.graphicDesignTitle || "Mane Graphic Design"
    };
    
    return descriptions[serviceName] || serviceName;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" serviceType="header" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.registrationPageTitle || 'Service Registration'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {translations.registrationPageSubtitle || 'Complete the form below to register for our services'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A3D91] to-[#0055A4] p-6">
            <h2 className="text-2xl font-bold text-white">
              {translations.registeringFor || 'Registering for:'}
            </h2>
            <div className="mt-2">
              <span className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-lg">
                {serviceInfo.name}
              </span>
              {serviceInfo.description && serviceInfo.description !== serviceInfo.name && (
                <p className="mt-2 text-blue-100">
                  {serviceInfo.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <RegistrationForm 
              service={service} 
              onSuccess={() => {
                // Optionally show success message or redirect
                setTimeout(() => {
                  navigate('/');
                }, 3000);
              }}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {translations.back || 'Back'}
          </button>
        </div>
      </div>
    </div>
  );
}