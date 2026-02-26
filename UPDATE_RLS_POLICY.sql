-- Update RLS Policy to show all active doctors (not just verified)
-- This allows newly registered doctors to appear in user list
-- Run this in Supabase SQL Editor

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Anyone can view active verified doctors" ON doctors;

-- Create new policy that shows all active doctors
CREATE POLICY "Anyone can view active doctors" ON doctors
  FOR SELECT USING (is_active = true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'doctors';
