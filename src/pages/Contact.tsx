import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Facebook, Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMapUrl();
  }, []);

  const fetchMapUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('imageUrl')
        .eq('section', 'contact')
        .eq('key', 'map')
        .single();

      if (error) {
        console.warn('Failed to fetch map URL:', error.message);
        return;
      }

      if (data && data.imageUrl) {
        setMapUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching map URL:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      return 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      return 'Message is required';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Validate form data
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }
      
      // Submit to Supabase
      const { error } = await supabase
        .from('messages')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        }]);
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message || 'Failed to send message. Please try again.');
      }
      
      console.log('Message submitted successfully');
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      console.error('Error submitting message:', error);
      setSubmitError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: translations.contactPageEmail || 'Email',
      content: 'manegroup993@gmail.com',
      link: 'mailto:manegroup993@gmail.com'
    },
    {
      icon: Phone,
      title: translations.contactPagePhone || 'Phone',
      content: '+237 681-062-998',
      link: 'tel:+237681062998'
    },
    {
      icon: MessageSquare,
      title: translations.contactPageWhatsApp || 'WhatsApp',
      content: '+237 681-062-998',
      link: 'https://wa.me/+237681062998'
    },
    {
      icon: Facebook,
      title: translations.contactPageFacebook || 'Facebook',
      content: '@MANÉ GROUP sarl',
      link: 'https://www.facebook.com/profile.php?id=100082989355949'
    },
    {
      icon: Music,
      title: translations.contactPageTikTok || 'TikTok',
      content: '@MANÉ GROUPE sarl',
      link: 'https://www.tiktok.com/@manegroupe?_r=1&_t=ZM-92MUSQLyNZ6'
    },
    {
      icon: MapPin,
      title: translations.contactPageAddress || 'Address',
      content: 'Bonas devant Auto Ecole Mane D\'Afrik',
      link: null
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-[#0A3D91] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{translations.contactPageTitle || 'Contact Us'}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {translations.contactPageSubtitle || 'We\'re here to help you achieve your goals'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#0A3D91' }}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#0A3D91' }}>
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-[#D6001C] transition-colors"
                      {...(info.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                {translations.contactPageSendMessage || 'Send us a Message'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.contactPageName || 'Name'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      {translations.contactPageEmail || 'Email'} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      {translations.contactPagePhone || 'Phone'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
                      placeholder="Your phone"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.contactPageSubject || 'Subject'} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.contactPageMessage || 'Message'} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent resize-none"
                    placeholder="Your message..."
                  />
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">
                      {submitError}
                    </p>
                  </div>
                )}

                {isSubmitted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-semibold">
                      Message sent successfully! We will get back to you soon.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: '#D6001C' }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {translations.submitting || 'Sending...'}
                    </span>
                  ) : (
                    translations.contactPageSendButton || 'Send Message'
                  )}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                {translations.contactPageLocation || 'Our Location'}
              </h2>
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md mb-6" style={{ height: '400px' }}>
                {mapUrl ? (
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={translations.contactMapTitle || "MANÉ GROUP Location"}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    <p>{translations.contactPageMapUnavailable || "Map unavailable. Please configure in admin panel."}</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                  {translations.contactPageBusinessHours || 'Business Hours'}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">{translations.contactPageMondayFriday || 'Monday - Friday'}</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{translations.contactPageSaturday || 'Saturday'}</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{translations.contactPageSunday || 'Sunday'}</span>
                    <span>{translations.contactPageClosed || 'Closed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#0A3D91' }}>
            {translations.contactPageReadyToGetStarted || 'Ready to Get Started?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {translations.contactPageAssistanceText || 'Contact us today to learn how we can help you achieve your goals'}
          </p>
          <a
            href="https://wa.me/+237681062998"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <MessageSquare className="mr-2 h-6 w-6" />
            {translations.contactPageChatOnWhatsApp || 'Chat on WhatsApp'}
          </a>
        </div>
      </section>
    </div>
  );
}