-- Fix Doctor Auth Links
-- This script links the auth accounts to doctor profiles
-- Run this in Supabase SQL Editor after running the registration script

-- Update Dr. Sarah Johnson
UPDATE doctors 
SET auth_id = '9cdf2a40-3fed-4b1f-8081-6a42fe82747a', 
    is_verified = true, 
    is_active = true
WHERE email = 'sarah.johnson@hospital.com' AND auth_id IS NULL;

-- Update Dr. Michael Chen
UPDATE doctors 
SET auth_id = 'b33d2842-92aa-4122-ba86-68094caee90d', 
    is_verified = true, 
    is_active = true
WHERE email = 'michael.chen@hospital.com' AND auth_id IS NULL;

-- Update Dr. Emily Rodriguez
UPDATE doctors 
SET auth_id = '7a2db6b0-6eae-444a-b2b9-cb474f3035a4', 
    is_verified = true, 
    is_active = true
WHERE email = 'emily.rodriguez@hospital.com' AND auth_id IS NULL;

-- Update Dr. James Wilson
UPDATE doctors 
SET auth_id = 'acd4dab3-3f09-4c97-811d-09931993c612', 
    is_verified = true, 
    is_active = true
WHERE email = 'james.wilson@hospital.com' AND auth_id IS NULL;

-- Update Dr. Lisa Anderson
UPDATE doctors 
SET auth_id = '5d461eac-36dc-497c-b814-159b66a68852', 
    is_verified = true, 
    is_active = true
WHERE email = 'lisa.anderson@hospital.com' AND auth_id IS NULL;

-- Update Dr. Robert Taylor
UPDATE doctors 
SET auth_id = '61f7873f-496b-4932-b511-f54f0a3acb52', 
    is_verified = true, 
    is_active = true
WHERE email = 'robert.taylor@hospital.com' AND auth_id IS NULL;

-- Update Dr. Maria Garcia
UPDATE doctors 
SET auth_id = 'bda39c26-e35e-4494-ad2b-9d5f81a222e3', 
    is_verified = true, 
    is_active = true
WHERE email = 'maria.garcia@hospital.com' AND auth_id IS NULL;

-- Update Dr. David Kim
UPDATE doctors 
SET auth_id = 'ed07429f-c196-4bd2-8313-593cb7155d38', 
    is_verified = true, 
    is_active = true
WHERE email = 'david.kim@hospital.com' AND auth_id IS NULL;

-- Update Dr. Jennifer Lee
UPDATE doctors 
SET auth_id = 'eb377974-25c2-475d-b024-c217657b9d6c', 
    is_verified = true, 
    is_active = true
WHERE email = 'jennifer.lee@hospital.com' AND auth_id IS NULL;

-- Update Dr. Thomas Brown
UPDATE doctors 
SET auth_id = 'c46dbb0c-d98c-4235-a227-f649e0b53612', 
    is_verified = true, 
    is_active = true
WHERE email = 'thomas.brown@hospital.com' AND auth_id IS NULL;

-- Update Dr. Amanda White
UPDATE doctors 
SET auth_id = '5ec91631-1039-4d62-b46d-6c4d742ee2c6', 
    is_verified = true, 
    is_active = true
WHERE email = 'amanda.white@hospital.com' AND auth_id IS NULL;

-- Update Dr. Christopher Martinez
UPDATE doctors 
SET auth_id = '3858ab04-353e-4612-9197-458281d6ddf4', 
    is_verified = true, 
    is_active = true
WHERE email = 'christopher.martinez@hospital.com' AND auth_id IS NULL;

-- Update Dr. Rachel Green
UPDATE doctors 
SET auth_id = '8ade3b9f-c7f2-4e42-b934-070659c3fdde', 
    is_verified = true, 
    is_active = true
WHERE email = 'rachel.green@hospital.com' AND auth_id IS NULL;

-- Update Dr. Kevin Patel
UPDATE doctors 
SET auth_id = 'd6ef6dcf-9425-4a98-b4c6-6c016f15631c', 
    is_verified = true, 
    is_active = true
WHERE email = 'kevin.patel@hospital.com' AND auth_id IS NULL;

-- Update Dr. Sophia Davis
UPDATE doctors 
SET auth_id = '4abc43e4-86b8-4bda-a0aa-cb5e3c5768fc', 
    is_verified = true, 
    is_active = true
WHERE email = 'sophia.davis@hospital.com' AND auth_id IS NULL;

-- Verify the updates
SELECT name, email, auth_id, is_verified, is_active 
FROM doctors 
WHERE email IN (
  'sarah.johnson@hospital.com',
  'michael.chen@hospital.com',
  'emily.rodriguez@hospital.com',
  'james.wilson@hospital.com',
  'lisa.anderson@hospital.com',
  'robert.taylor@hospital.com',
  'maria.garcia@hospital.com',
  'david.kim@hospital.com',
  'jennifer.lee@hospital.com',
  'thomas.brown@hospital.com',
  'amanda.white@hospital.com',
  'christopher.martinez@hospital.com',
  'rachel.green@hospital.com',
  'kevin.patel@hospital.com',
  'sophia.davis@hospital.com'
)
ORDER BY name;
