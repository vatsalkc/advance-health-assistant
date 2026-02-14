-- Sample Doctors Data for Testing
-- Run this AFTER running supabase_doctor_schema.sql
-- These doctors will be pre-registered in the system

-- NOTE: You need to create these users in Supabase Auth first, then link them to doctors
-- This file provides the INSERT statements for the doctors table
-- The auth users need to be created through the registration process or Supabase dashboard

-- ============================================
-- SAMPLE DOCTORS WITH CREDENTIALS
-- ============================================

-- Doctor 1: Dr. Sarah Johnson - Cardiologist
-- Email: sarah.johnson@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Sarah Johnson',
  'sarah.johnson@hospital.com',
  '+1-555-0101',
  'Cardiologist',
  'MBBS, MD (Cardiology)',
  'MED-CARD-2018-001',
  '12 years',
  4.8,
  true,
  true,
  150.00,
  'Experienced cardiologist specializing in heart disease prevention and treatment. Board certified with over 12 years of clinical experience.'
);

-- Doctor 2: Dr. Michael Chen - Dermatologist
-- Email: michael.chen@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Michael Chen',
  'michael.chen@hospital.com',
  '+1-555-0102',
  'Dermatologist',
  'MBBS, MD (Dermatology)',
  'MED-DERM-2019-002',
  '8 years',
  4.7,
  true,
  true,
  120.00,
  'Specialist in skin conditions, acne treatment, and cosmetic dermatology. Dedicated to providing personalized care.'
);

-- Doctor 3: Dr. Emily Rodriguez - Neurologist
-- Email: emily.rodriguez@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Emily Rodriguez',
  'emily.rodriguez@hospital.com',
  '+1-555-0103',
  'Neurologist',
  'MBBS, MD, DM (Neurology)',
  'MED-NEUR-2017-003',
  '15 years',
  4.9,
  true,
  true,
  180.00,
  'Expert in neurological disorders including migraines, epilepsy, and stroke management. Published researcher in neuroscience.'
);

-- Doctor 4: Dr. James Wilson - Orthopedic
-- Email: james.wilson@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. James Wilson',
  'james.wilson@hospital.com',
  '+1-555-0104',
  'Orthopedic',
  'MBBS, MS (Orthopedics)',
  'MED-ORTH-2016-004',
  '18 years',
  4.6,
  true,
  true,
  160.00,
  'Orthopedic surgeon specializing in joint replacement and sports injuries. Extensive experience in minimally invasive procedures.'
);

-- Doctor 5: Dr. Lisa Anderson - Pediatrician
-- Email: lisa.anderson@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Lisa Anderson',
  'lisa.anderson@hospital.com',
  '+1-555-0105',
  'Pediatrician',
  'MBBS, MD (Pediatrics)',
  'MED-PEDI-2020-005',
  '6 years',
  4.9,
  true,
  true,
  100.00,
  'Compassionate pediatrician focused on child health and development. Specializes in preventive care and childhood illnesses.'
);

-- Doctor 6: Dr. Robert Taylor - Psychiatrist
-- Email: robert.taylor@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Robert Taylor',
  'robert.taylor@hospital.com',
  '+1-555-0106',
  'Psychiatrist',
  'MBBS, MD (Psychiatry)',
  'MED-PSYC-2018-006',
  '10 years',
  4.7,
  true,
  true,
  140.00,
  'Mental health specialist with expertise in anxiety, depression, and behavioral disorders. Provides both therapy and medication management.'
);

-- Doctor 7: Dr. Maria Garcia - ENT Specialist
-- Email: maria.garcia@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Maria Garcia',
  'maria.garcia@hospital.com',
  '+1-555-0107',
  'ENT Specialist',
  'MBBS, MS (ENT)',u
  'MED-ENT-2019-007',
  '9 years',
  4.8,
  true,
  true,
  130.00,
  'Ear, nose, and throat specialist. Expert in sinus problems, hearing issues, and throat disorders.'
);

-- Doctor 8: Dr. David Kim - Ophthalmologist
-- Email: david.kim@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. David Kim',
  'david.kim@hospital.com',
  '+1-555-0108',
  'Ophthalmologist',
  'MBBS, MS (Ophthalmology)',
  'MED-OPHT-2017-008',
  '14 years',
  4.9,
  true,
  true,
  145.00,
  'Eye care specialist with expertise in cataract surgery, LASIK, and retinal disorders. State-of-the-art treatment approaches.'
);

-- Doctor 9: Dr. Jennifer Lee - Gynecologist
-- Email: jennifer.lee@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Jennifer Lee',
  'jennifer.lee@hospital.com',
  '+1-555-0109',
  'Gynecologist',
  'MBBS, MD (Obstetrics & Gynecology)',
  'MED-GYNE-2018-009',
  '11 years',
  4.8,
  true,
  true,
  135.00,
  'Women\'s health specialist providing comprehensive gynecological care, prenatal care, and family planning services.'
);

-- Doctor 10: Dr. Thomas Brown - General Physician
-- Email: thomas.brown@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Thomas Brown',
  'thomas.brown@hospital.com',
  '+1-555-0110',
  'General Physician',
  'MBBS, MD (General Medicine)',
  'MED-GP-2015-010',
  '20 years',
  4.7,
  true,
  true,
  90.00,
  'Experienced general practitioner providing primary care for all ages. Focus on preventive medicine and chronic disease management.'
);

-- Doctor 11: Dr. Amanda White - Dentist
-- Email: amanda.white@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Amanda White',
  'amanda.white@hospital.com',
  '+1-555-0111',
  'Dentist',
  'BDS, MDS (Orthodontics)',
  'MED-DENT-2019-011',
  '7 years',
  4.6,
  true,
  true,
  110.00,
  'Dental specialist offering comprehensive oral care including orthodontics, cosmetic dentistry, and preventive treatments.'
);

-- Doctor 12: Dr. Christopher Martinez - Pulmonologist
-- Email: christopher.martinez@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Christopher Martinez',
  'christopher.martinez@hospital.com',
  '+1-555-0112',
  'Pulmonologist',
  'MBBS, MD (Pulmonary Medicine)',
  'MED-PULM-2017-012',
  '13 years',
  4.8,
  true,
  true,
  155.00,
  'Lung and respiratory specialist. Expert in asthma, COPD, and sleep disorders. Advanced training in critical care.'
);

-- Doctor 13: Dr. Rachel Green - Gastroenterologist
-- Email: rachel.green@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Rachel Green',
  'rachel.green@hospital.com',
  '+1-555-0113',
  'Gastroenterologist',
  'MBBS, MD, DM (Gastroenterology)',
  'MED-GAST-2018-013',
  '10 years',
  4.7,
  true,
  true,
  165.00,
  'Digestive system specialist treating conditions like IBS, acid reflux, and liver diseases. Performs endoscopic procedures.'
);

-- Doctor 14: Dr. Kevin Patel - Urologist
-- Email: kevin.patel@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Kevin Patel',
  'kevin.patel@hospital.com',
  '+1-555-0114',
  'Urologist',
  'MBBS, MS (Urology)',
  'MED-UROL-2016-014',
  '16 years',
  4.6,
  true,
  true,
  150.00,
  'Urinary tract and male reproductive system specialist. Expert in kidney stones, prostate issues, and urological cancers.'
);

-- Doctor 15: Dr. Sophia Davis - Endocrinologist
-- Email: sophia.davis@hospital.com
-- Password: doctor123
INSERT INTO doctors (name, email, phone, specialization, qualification, license_number, experience, rating, is_verified, is_active, consultation_fee, bio)
VALUES (
  'Dr. Sophia Davis',
  'sophia.davis@hospital.com',
  '+1-555-0115',
  'Endocrinologist',
  'MBBS, MD, DM (Endocrinology)',
  'MED-ENDO-2019-015',
  '8 years',
  4.9,
  true,
  true,
  170.00,
  'Hormone and metabolism specialist. Treats diabetes, thyroid disorders, and hormonal imbalances with personalized care plans.'
);

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. These INSERT statements will add doctors to the doctors table
-- 2. However, they won't have auth_id yet (will be NULL)
-- 3. To make them functional, you need to either:
--    a) Have them register through the app (recommended)
--    b) Create auth users manually in Supabase and update auth_id
-- 
-- 4. All doctors use the same password for testing: doctor123
-- 5. In production, use strong unique passwords!
-- 
-- 6. After running this, doctors will appear in the patient's doctor list
-- 7. But they won't be able to login until they register or auth_id is set
