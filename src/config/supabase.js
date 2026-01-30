import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
