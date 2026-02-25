import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

// Custom storage implementation for better mobile support
const customStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }
};

// Create Supabase client with mobile-optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: customStorage,
    storageKey: 'sb-mklbffjqlcvowdardqkb-auth-token',
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

// Session persistence helper for mobile
export const ensureSessionPersistence = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Supabase] Session check error:', error);
      return false;
    }
    
    if (session) {
      // Force save session to localStorage for mobile
      customStorage.setItem(
        'sb-mklbffjqlcvowdardqkb-auth-token',
        JSON.stringify(session)
      );
      console.log('[Supabase] Session persisted for mobile');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Supabase] Session persistence error:', error);
    return false;
  }
};

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
