/**
 * Database Health Check Utility
 * Provides functions to check database connectivity and table existence
 */

import { supabase } from '../lib/supabase';

/**
 * Check if a table exists in the database
 * @param tableName - Name of the table to check
 * @returns Promise<boolean> indicating if table exists
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    // If we get an error about the table not existing, it doesn't exist
    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      return false;
    }
    
    // If we get data or a different kind of error, the table exists
    return true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Check database connectivity and required tables
 * @returns Promise<object> with health check results
 */
export const databaseHealthCheck = async (): Promise<{
  isConnected: boolean;
  missingTables: string[];
  errorMessage?: string;
}> => {
  try {
    // Test basic database connectivity
    const { error } = await supabase
      .from('content')
      .select('id')
      .limit(1);
    
    if (error) {
      return {
        isConnected: false,
        missingTables: [],
        errorMessage: `Database connection failed: ${error.message}`
      };
    }
    
    // Check if required tables exist
    const requiredTables = ['registrations', 'messages', 'content'];
    const missingTables: string[] = [];
    
    for (const table of requiredTables) {
      const exists = await checkTableExists(table);
      if (!exists) {
        missingTables.push(table);
      }
    }
    
    return {
      isConnected: true,
      missingTables
    };
  } catch (error: any) {
    return {
      isConnected: false,
      missingTables: [],
      errorMessage: `Health check failed: ${error.message}`
    };
  }
};

/**
 * Initialize database tables if they don't exist
 * @returns Promise<void>
 */
export const initializeDatabaseIfNeeded = async (): Promise<void> => {
  try {
    const health = await databaseHealthCheck();
    
    if (!health.isConnected) {
      console.error('Database connection failed:', health.errorMessage);
      return;
    }
    
    if (health.missingTables.length > 0) {
      console.warn('Missing tables detected:', health.missingTables);
      console.info('Please run database migrations to create missing tables');
    } else {
      console.log('Database health check passed: All required tables present');
    }
  } catch (error) {
    console.error('Database initialization check failed:', error);
  }
};