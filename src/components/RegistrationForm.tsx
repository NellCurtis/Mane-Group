import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationFormProps {
  service: string;
  onSuccess?: () => void;
}

export default function RegistrationForm({ service, onSuccess }: RegistrationFormProps) {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    service: service,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): string | null => {
    if (!formData.full_name.trim()) {
      return 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }
    
    if (!formData.country.trim()) {
      return 'Country is required';
    }
    
    if (!formData.service.trim()) {
      return 'Service selection is required';
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
        .from('registrations')
        .insert([{
          full_name: formData.full_name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          country: formData.country.trim(),
          service: formData.service.trim(),
          message: formData.message.trim()
        }]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message || 'Failed to submit registration. Please try again.');
      }

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form after successful submission
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        country: '',
        service: service,
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      setSubmitError(error.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Registration Successful!
        </h3>
        <p className="text-green-700">
          Thank you for your registration. We will contact you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#0A3D91' }}>
        {translations.registerForService || 'Register for this service'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select your country</option>
              <option value="Canada">Canada</option>
              <option value="France">France</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D91] focus:border-transparent"
            placeholder="Enter your message (optional)"
          ></textarea>
        </div>
        
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#0A3D91] hover:bg-[#D6001C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A3D91]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}