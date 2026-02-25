import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'health-assistant'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('[Supabase] Connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('[Supabase] Connection successful');
    return { success: true };
  } catch (error) {
    console.error('[Supabase] Connection error:', error);
    return { success: false, error: error.message };
  }
};

// Initialize connection test
testSupabaseConnection();

export default supabase;
