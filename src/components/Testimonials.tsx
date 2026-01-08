import { Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const { translations } = useLanguage();
  
  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Marie Dupont",
      role: "Immigration Client",
      company: "",
      content: translations.testimonialContent1 || "MANÉ Immigration made our family's visa process incredibly smooth. Their attention to detail and personalized support was exceptional.",
      rating: 5
    },
    {
      id: 2,
      name: "Jean Mbala",
      role: "Driving Student",
      company: "Auto-École Mane d'Afrique",
      content: translations.testimonialContent2 || "The instructors at Auto-École Mane d'Afrique are patient and professional. I passed my driving test on the first try!",
      rating: 5
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Business Owner",
      company: "Tech Innovations Ltd",
      content: translations.testimonialContent3 || "Mane Innovation transformed our digital infrastructure. Their team delivered beyond our expectations with cutting-edge solutions.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D91] mb-4">
            {translations.testimonialsTitle || "What Our Clients Say"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {translations.testimonialsDescription || "Hear from our satisfied customers about their experiences with our services."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                  {testimonial.company && (
                    <p className="text-sm text-[#0A3D91]">{testimonial.company}</p>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <Quote className="h-6 w-6 text-[#D6001C] absolute -top-2 -left-2 opacity-20" />
                <p className="text-gray-700 pl-4 pt-2">
                  {testimonial.content}
                </p>
              </div>
              
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}