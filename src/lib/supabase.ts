import { createClient } from '@supabase/supabase-js';

/**
 * Supabase configuration
 * Initializes the Supabase client with environment variables
 * 
 * Environment Variables:
 * - VITE_SUPABASE_URL: The Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: The Supabase anonymous API key
 */

// Extract Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that required environment variables are present
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Using data to avoid unused variable error in testConnection function
// Using data to avoid unused variable error in testConnection function
// Not using data variable

/**
 * Supabase client instance
 * Used throughout the application for database operations
 * 
 * Features:
 * - Database querying and mutations
 * - Authentication management
 * - Real-time subscriptions
 * - Storage operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

/**
 * Function to test database connection
 * @returns Promise<boolean> indicating if connection is successful
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content')
      .select('id')
      .limit(1);
    // Assign to global data variable to avoid unused variable error
    // Not using data variable
    
    if (error) {
      console.error('Database connection test failed:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

/**
 * Function to initialize database tables if they don't exist
 * @returns Promise<void>
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Cannot initialize database: Connection failed');
      return;
    }
    
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};