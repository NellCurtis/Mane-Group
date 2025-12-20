import { Award, Users, Globe, Star } from 'lucide-react';

export default function SocialProof() {
  // Not using translations in this component
  
  // Social proof data
  const stats = [
    {
      id: 'clients',
      value: '5000+',
      label: 'Clients Served',
      icon: Users
    },
    {
      id: 'rating',
      value: '4.9/5',
      label: 'Average Rating',
      icon: Star
    },
    {
      id: 'countries',
      value: '15+',
      label: 'Countries',
      icon: Globe
    },
    {
      id: 'awards',
      value: '25+',
      label: 'Awards Won',
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