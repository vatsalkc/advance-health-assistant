-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new policy that allows insert during registration
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Also ensure the policy allows authenticated users to insert
CREATE POLICY "Enable insert for authenticated users only" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
