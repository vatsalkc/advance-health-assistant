-- Simple script to ensure there's at least one doctor in the system for patient uploads
-- Run this in your Supabase SQL Editor if you're still having issues

-- Check if we have any doctors
DO $$
BEGIN
    -- If no doctors exist, insert a basic system doctor
    IF NOT EXISTS (SELECT 1 FROM doctors LIMIT 1) THEN
        INSERT INTO doctors (name, specialization, experience, rating) 
        VALUES ('System Doctor', 'General', '1 year', 4.0);
        
        RAISE NOTICE 'System doctor created for patient uploads';
    ELSE
        RAISE NOTICE 'Doctors already exist in system';
    END IF;
END $$;