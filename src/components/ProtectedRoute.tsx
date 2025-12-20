import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      // If user is not authenticated, redirect to login
      navigate('/login');
    } else if (!isLoading && user && requiredRole) {
      // Check if user has required role
      if (user.role !== requiredRole) {
        // If user doesn't have required role, redirect to login
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold" style={{ color: '#0A3D91' }}>
          Loading...
        </div>
      </div>
    );
  }

  // If user is authenticated and has required role (if specified), render children
  if (user) {
    if (!requiredRole) {
      return <>{children}</>;
    }
    
    if (user.role === requiredRole) {
      return <>{children}</>;
    }
  }

  // If user is not authenticated or doesn't have required role, render nothing
  // (navigation will redirect to login)
  return null;
}