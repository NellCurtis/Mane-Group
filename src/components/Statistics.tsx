import { useState, useEffect } from 'react';
import { Users, Award, BookOpen, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Statistic {
  id: string;
  value: number;
  label: string;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
}

export default function Statistics() {
  const { translations } = useLanguage();
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Statistics data
  const statistics: Statistic[] = [
    {
      id: 'students',
      value: 5000,
      label: translations.drivingSchoolStatLabels?.[2] || 'Students Trained',
      icon: Users,
      suffix: '+'
    },
    {
      id: 'certifications',
      value: 25,
      label: translations.immigrationStatLabels?.[1] || 'Years Experience',
      icon: Award,
      suffix: '+'
    },
    {
      id: 'courses',
      value: 50,
      label: translations.languagesTitle || 'Courses Offered',
      icon: BookOpen,
      suffix: '+'
    },
    {
      id: 'countries',
      value: 15,
      label: translations.immigrationTitle || 'Countries Served',
      icon: Globe,
      suffix: '+'
    }
  ];
  // Animate counters when component mounts
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    statistics.forEach((stat) => {
      let currentValue = 0;
      const increment = stat.value / 50; // Animation steps
      
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.value) {
          currentValue = stat.value;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: Math.floor(currentValue)
        }));
      }, 30);
      
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.id}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-[#0A3D91]">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0A3D91' }}>
                  {animatedValues[stat.id]?.toLocaleString() || 0}{stat.suffix}
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