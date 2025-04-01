
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://gqkhnmlytbvklkyktcwt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa2hubWx5dGJ2a2xreWt0Y3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDk1MjYsImV4cCI6MjA0Njc4NTUyNn0.xT3iS1sWyX0pClMadR0CFlyMGlRoiGGAXGu0yuozgZs";

// Create a custom fetch function with increased timeout
const fetchWithTimeout = (url: RequestInfo | URL, options: RequestInit = {}, timeout = 30000): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;
    
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timeout: Operation took longer than ${timeout}ms`));
    }, timeout);
    
    fetch(url, { ...options, signal })
      .then(resolve)
      .catch((error) => {
        // Provide more context for network errors
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          reject(new Error('Network connection issue: Unable to reach Supabase servers'));
        } else {
          reject(error);
        }
      })
      .finally(() => clearTimeout(timeoutId));
  });
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    // Use custom fetch with increased timeout
    fetch: (url, options) => fetchWithTimeout(url, options, 30000)
  },
  db: {
    schema: 'public'
  }
});

// Log initialization for debugging
console.log('Supabase client initialized');

// Add a retry mechanism for database operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`Operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
      lastError = error;
      
      // Don't wait on the last attempt
      if (attempt < maxRetries) {
        // Add exponential backoff
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  console.error(`All ${maxRetries} retry attempts failed:`, lastError);
  throw lastError;
};
