import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { translations } = useLanguage();
  
  return (
    <footer className="bg-[#0A3D91] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{translations.footerCompanyName || "MANÉ GROUP"}</h3>
            <p className="text-gray-300 mb-4">
              {translations.footerCompanyDescription || "Your trusted partner for global opportunities and professional services."}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100082989355949" target="_blank" rel="noopener noreferrer" className="hover:text-[#D6001C] transition-colors" title="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#D6001C] transition-colors" title="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#D6001C] transition-colors" title="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@manegroupe?_r=1&_t=ZM-92MUSQLyNZ6" target="_blank" rel="noopener noreferrer" className="hover:text-[#D6001C] transition-colors" title="TikTok">
                <Music className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#D6001C] transition-colors" title="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{translations.footerQuickLinks || "Quick Links"}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {translations.home || "Home"}
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-gray-300 hover:text-white transition-colors">
                  {translations.services || "Services"}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  {translations.aboutUs || "About Us"}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {translations.contact || "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{translations.footerServices || "Services"}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/immigration" className="text-gray-300 hover:text-white transition-colors">
                  {translations.immigrationTitle || "MANÉ Immigration"}
                </Link>
              </li>
              <li>
                <Link to="/services/driving-school" className="text-gray-300 hover:text-white transition-colors">
                  {translations.drivingSchoolTitle || "Auto-École"}
                </Link>
              </li>
              <li>
                <Link to="/services/languages" className="text-gray-300 hover:text-white transition-colors">
                  {translations.languagesTitle || "Multi-Linguistique"}
                </Link>
              </li>
              <li>
                <Link to="/services/innovation" className="text-gray-300 hover:text-white transition-colors">
                  {translations.innovationTitle || "Innovation"}
                </Link>
              </li>
              <li>
                <Link to="/services/graphic-design" className="text-gray-300 hover:text-white transition-colors">
                  {translations.graphicDesignTitle || "Graphic Design"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{translations.footerContactInfo || "Contact Info"}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">manegroup993@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">+237 681-062-998</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Bonas devant Auto Ecole Mane D'afrik</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            `© ${new Date().getFullYear()} MANÉ GROUP. ${translations.footerRights || 'All rights reserved.'}`
          </p>
        </div>
      </div>
    </footer>
  );
}