import { Award, Users, Globe, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SocialProof() {
  const { translations } = useLanguage();
  
  // Social proof data
  const stats = [
    {
      id: 'clients',
      value: '5000+',
      label: translations.clientsServedLabel || 'Clients Served',
      icon: Users
    },
    {
      id: 'rating',
      value: '4.9/5',
      label: translations.averageRatingLabel || 'Average Rating',
      icon: Star
    },
    {
      id: 'countries',
      value: '15+',
      label: translations.countriesLabel || 'Countries',
      icon: Globe
    },
    {
      id: 'awards',
      value: '25+',
      label: translations.awardsWonLabel || 'Awards Won',
      icon: Award
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.id}
                className="text-center group"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Icon className="h-8 w-8 text-[#0A3D91]" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#0A3D91] mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}