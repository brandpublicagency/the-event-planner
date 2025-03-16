
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://gqkhnmlytbvklkyktcwt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa2hubWx5dGJ2a2xreWt0Y3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDk1MjYsImV4cCI6MjA0Njc4NTUyNn0.xT3iS1sWyX0pClMadR0CFlyMGlRoiGGAXGu0yuozgZs";

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
    // Set reasonable timeouts for all requests including Function invocations
    fetch: (url, options) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    }
  },
  db: {
    schema: 'public'
  }
});
