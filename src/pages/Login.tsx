import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Only sign in, no signup option
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error || (language === 'en' ? 'Invalid credentials' : 'Identifiants invalides'));
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(language === 'en' ? 'An unexpected error occurred' : 'Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#0A3D91' }}>
            {language === 'en' ? 'Admin Login' : 'Connexion administrateur'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {language === 'en' ? 'Enter your credentials to access the admin panel' : 'Entrez vos identifiants pour accéder au panneau d\'administration'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Email address' : 'Adresse e-mail'}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md shadow-sm block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#0A3D91] focus:border-[#0A3D91] sm:text-sm"
              placeholder={language === 'en' ? 'Email address' : 'Adresse e-mail'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Password' : 'Mot de passe'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md shadow-sm block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#0A3D91] focus:border-[#0A3D91] sm:text-sm"
              placeholder={language === 'en' ? 'Password' : 'Mot de passe'}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#0A3D91' }}
            >
              {loading ? (
                <span>{language === 'en' ? 'Signing in...' : 'Connexion en cours...'}</span>
              ) : (
                language === 'en' ? 'Sign In' : 'Se connecter'
              )}
            </button>
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>
              {language === 'en' 
                ? 'Note: Admin accounts must be created directly in Supabase.' 
                : 'Remarque: Les comptes administrateurs doivent être créés directement dans Supabase.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}