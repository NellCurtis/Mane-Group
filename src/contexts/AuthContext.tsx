import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Interface for user profile
 */
interface UserProfile {
  id: string;
  email: string;
  role: 'admin';
  full_name: string;
}

/**
 * Interface for AuthContext
 */
interface AuthContextType {
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Creating the AuthContext with default values
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ success: false, error: 'Not implemented' }),
  signOut: async () => {},
  isLoading: true,
});

/**
 * Custom hook to use the AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component to wrap the application
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Convert Supabase user to our UserProfile format
   */
  const convertUser = (supabaseUser: any): UserProfile => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: 'admin', // Assume all authenticated users are admins for simplicity
      full_name: supabaseUser.email?.split('@')[0] || 'Admin User'
    };
  };

  /**
   * Sign in function - simplified authentication
   */
  const signIn = async (email: string, password: string) => {
    try {
      // Standard sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userProfile = convertUser(data.user);
        setUser(userProfile);
        // Wait a bit to ensure state is updated before returning
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  };

  /**
   * Sign out function
   */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  /**
   * Check active session on mount
   */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userProfile = convertUser(session.user);
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userProfile = convertUser(session.user);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};