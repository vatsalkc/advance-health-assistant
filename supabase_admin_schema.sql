-- Admin table schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on auth_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_auth_id ON public.admins(auth_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table

-- Policy: Admins can read their own data
CREATE POLICY "Admins can view own profile"
    ON public.admins
    FOR SELECT
    USING (auth.uid() = auth_id);

-- Policy: Admins can update their own data
CREATE POLICY "Admins can update own profile"
    ON public.admins
    FOR UPDATE
    USING (auth.uid() = auth_id);

-- Policy: Allow admin registration (insert)
CREATE POLICY "Allow admin registration"
    ON public.admins
    FOR INSERT
    WITH CHECK (true);

-- Add rejection_reason column to doctors table if it doesn't exist
ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Grant necessary permissions
GRANT ALL ON public.admins TO authenticated;
GRANT ALL ON public.admins TO service_role;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for admins table
DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a default super admin (CHANGE PASSWORD AFTER FIRST LOGIN!)
-- Password: Admin@123 (you should change this immediately after first login)
-- You'll need to create this user in Supabase Auth first, then run this insert with the correct auth_id

-- Example insert (replace 'YOUR_AUTH_ID' with actual auth user ID after creating in Supabase Auth):
-- INSERT INTO public.admins (auth_id, name, email, role, is_active)
-- VALUES ('YOUR_AUTH_ID', 'Super Admin', 'admin@healthassistant.com', 'super_admin', true);

-- Note: To create the first admin:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create an admin user
-- 3. Copy the user's UUID
-- 4. Run the INSERT statement above with the copied UUID

COMMENT ON TABLE public.admins IS 'Admin users who can manage the system';
COMMENT ON COLUMN public.admins.role IS 'Admin role: admin or super_admin';
COMMENT ON COLUMN public.admins.is_active IS 'Whether the admin account is active';
