import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const { translations } = useLanguage();
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // FAQ data using translations
  const faqs: FAQItem[] = [
    {
      id: 'registration',
      question: translations.faqRegistrationQuestion || 'How do I register for your services?',
      answer: translations.faqRegistrationAnswer || 'You can register for our services by filling out the registration form on our website. Simply select the service you\'re interested in, provide your contact information, and our team will reach out to you within 24 hours to discuss next steps.'
    },
    {
      id: 'documents',
      question: translations.faqDocumentationQuestion || 'What documents do I need for immigration services?',
      answer: translations.faqDocumentationAnswer || "The required documents vary depending on your specific immigration case. During your initial consultation, our immigration experts will provide you with a detailed checklist of documents needed for your particular situation. Generally, you'll need identification documents, proof of financial capacity, educational credentials, and any relevant legal documents."
    },
    {
      id: 'duration',
      question: translations.faqDurationQuestion || 'How long does the immigration process take?',
      answer: translations.faqDurationAnswer || 'Processing times vary significantly depending on the type of application, the destination country, and current government processing volumes. Simple applications might take 3-6 months, while complex cases can take 12-18 months or longer. We provide realistic timelines during your consultation and keep you updated throughout the process.'
    },
    {
      id: 'driving-test',
      question: translations.faqDrivingTestQuestion || 'What should I expect during the driving test?',
      answer: translations.faqDrivingTestAnswer || 'Our driving tests assess both your theoretical knowledge and practical driving skills. The theory portion covers traffic rules, road signs, and safe driving practices. The practical test evaluates your ability to operate a vehicle safely in various conditions. We provide comprehensive preparation to ensure you\'re confident and ready for both parts of the exam.'
    },
    {
      id: 'refund',
      question: translations.faqRefundQuestion || 'Do you offer refunds if I\'m not satisfied?',
      answer: translations.faqRefundAnswer || 'We stand behind the quality of our services and strive for complete customer satisfaction. While our services are generally non-refundable due to their personalized nature, we offer revisions and additional support to address any concerns. Please contact our customer service team to discuss specific situations.'
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3D91]">
            {translations.faqTitle || "Frequently Asked Questions"}
          </h2>
          <p className="text-lg text-gray-600">
            {translations.faqDescription || "Find answers to common questions about our services"}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                onClick={() => toggleItem(faq.id)}
                aria-expanded={openItemId === faq.id}
                aria-controls={`faq-${faq.id}`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {openItemId === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-[#0A3D91]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#0A3D91]" />
                )}
              </button>
              
              {openItemId === faq.id && (
                <div 
                  id={`faq-${faq.id}`}
                  className="p-6 bg-white border-t border-gray-200"
                >
                  <p className="text-gray-700">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}