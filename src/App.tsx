import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Immigration = lazy(() => import('./pages/services/Immigration'));
const DrivingSchool = lazy(() => import('./pages/services/DrivingSchool'));
const Languages = lazy(() => import('./pages/services/Languages'));
const Innovation = lazy(() => import('./pages/services/Innovation'));
const GraphicDesign = lazy(() => import('./pages/services/GraphicDesign'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const Register = lazy(() => import('./pages/Register'));
// Loading component for lazy-loaded pages
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2" style={{ borderColor: '#0A3D91' }}></div>
  </div>
);

/**
 * Main Application Component
 * This is the root component that sets up the entire application
 * It manages routing, providers, layout, and global state
 */
export default function App() {

  return (
    // Wrap entire app with providers for language and authentication
    <AuthProvider>
      <LanguageProvider>
        {/* Browser router for SPA navigation */}
        <Router>
          {/* Flex container for sticky footer layout */}
          <div className="flex flex-col min-h-screen">
            {/* Header component visible on all pages */}
            <Header />
            
            {/* Main content area that grows to fill available space */}
            <main className="flex-grow">
              {/* Suspense wrapper for lazy-loaded components */}
              <Suspense fallback={<LoadingSpinner />}>
                {/* Route definitions for all application pages */}
                <Routes>
                  {/* Home page route */}
                  <Route path="/" element={<Home />} />
                  {/* Service page routes */}
                  <Route path="/services/immigration" element={<Immigration />} />
                  <Route path="/services/driving-school" element={<DrivingSchool />} />
                  <Route path="/services/languages" element={<Languages />} />
                  <Route path="/services/innovation" element={<Innovation />} />
                  <Route path="/services/graphic-design" element={<GraphicDesign />} />
                  {/* Static page routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* Admin dashboard route - protected */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Login route */}
                  <Route path="/login" element={<Login />} />
                  {/* Registration route */}
                  <Route path="/register" element={<Register />} />
                </Routes>              </Suspense>
            </main>
            {/* Footer component visible on all pages */}
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}