import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Newsletter() {
  const { translations } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1000);
  };

  return (
    <section className="py-16 bg-[#0A3D91] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <Mail className="h-12 w-12 text-[#D6001C]" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {translations.homeContactTitle || "Stay Updated"}
        </h2>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
          {translations.homeContactDescription || "Subscribe to our newsletter for the latest updates and offers."}
        </p>
        
        {isSubscribed ? (
          <div className="bg-green-500 text-white py-4 px-6 rounded-lg inline-block">
            <p className="font-medium">
              {translations.thankYou || "Thank you for subscribing! Check your email for confirmation."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translations.email || "Enter your email"}
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D6001C]"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#D6001C] hover:bg-[#b30015] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    {translations.contactUs || "Subscribe"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        
        <p className="text-sm text-blue-200 mt-4">
          {translations.homeAboutDescription || "We respect your privacy. Unsubscribe at any time."}
        </p>
      </div>
    </section>
  );
}