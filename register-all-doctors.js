// Script to register all sample doctors
// Run this with: node register-all-doctors.js

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample doctors data
const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0101',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    license_number: 'MED-CARD-2018-001',
    experience: '12 years',
    rating: 4.8,
    consultation_fee: 150.00,
    bio: 'Experienced cardiologist specializing in heart disease prevention and treatment. Board certified with over 12 years of clinical experience.'
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0102',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    license_number: 'MED-DERM-2019-002',
    experience: '8 years',
    rating: 4.7,
    consultation_fee: 120.00,
    bio: 'Specialist in skin conditions, acne treatment, and cosmetic dermatology. Dedicated to providing personalized care.'
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0103',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD, DM (Neurology)',
    license_number: 'MED-NEUR-2017-003',
    experience: '15 years',
    rating: 4.9,
    consultation_fee: 180.00,
    bio: 'Expert in neurological disorders including migraines, epilepsy, and stroke management. Published researcher in neuroscience.'
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0104',
    specialization: 'Orthopedic',
    qualification: 'MBBS, MS (Orthopedics)',
    license_number: 'MED-ORTH-2016-004',
    experience: '18 years',
    rating: 4.6,
    consultation_fee: 160.00,
    bio: 'Orthopedic surgeon specializing in joint replacement and sports injuries. Extensive experience in minimally invasive procedures.'
  },
  {
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0105',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    license_number: 'MED-PEDI-2020-005',
    experience: '6 years',
    rating: 4.9,
    consultation_fee: 100.00,
    bio: 'Compassionate pediatrician focused on child health and development. Specializes in preventive care and childhood illnesses.'
  },
  {
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0106',
    specialization: 'Psychiatrist',
    qualification: 'MBBS, MD (Psychiatry)',
    license_number: 'MED-PSYC-2018-006',
    experience: '10 years',
    rating: 4.7,
    consultation_fee: 140.00,
    bio: 'Mental health specialist with expertise in anxiety, depression, and behavioral disorders. Provides both therapy and medication management.'
  },
  {
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0107',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS (ENT)',
    license_number: 'MED-ENT-2019-007',
    experience: '9 years',
    rating: 4.8,
    consultation_fee: 130.00,
    bio: 'Ear, nose, and throat specialist. Expert in sinus problems, hearing issues, and throat disorders.'
  },
  {
    name: 'Dr. David Kim',
    email: 'david.kim@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0108',
    specialization: 'Ophthalmologist',
    qualification: 'MBBS, MS (Ophthalmology)',
    license_number: 'MED-OPHT-2017-008',
    experience: '14 years',
    rating: 4.9,
    consultation_fee: 145.00,
    bio: 'Eye care specialist with expertise in cataract surgery, LASIK, and retinal disorders. State-of-the-art treatment approaches.'
  },
  {
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.lee@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0109',
    specialization: 'Gynecologist',
    qualification: 'MBBS, MD (Obstetrics & Gynecology)',
    license_number: 'MED-GYNE-2018-009',
    experience: '11 years',
    rating: 4.8,
    consultation_fee: 135.00,
    bio: 'Women\'s health specialist providing comprehensive gynecological care, prenatal care, and family planning services.'
  },
  {
    name: 'Dr. Thomas Brown',
    email: 'thomas.brown@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0110',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    license_number: 'MED-GP-2015-010',
    experience: '20 years',
    rating: 4.7,
    consultation_fee: 90.00,
    bio: 'Experienced general practitioner providing primary care for all ages. Focus on preventive medicine and chronic disease management.'
  },
  {
    name: 'Dr. Amanda White',
    email: 'amanda.white@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0111',
    specialization: 'Dentist',
    qualification: 'BDS, MDS (Orthodontics)',
    license_number: 'MED-DENT-2019-011',
    experience: '7 years',
    rating: 4.6,
    consultation_fee: 110.00,
    bio: 'Dental specialist offering comprehensive oral care including orthodontics, cosmetic dentistry, and preventive treatments.'
  },
  {
    name: 'Dr. Christopher Martinez',
    email: 'christopher.martinez@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0112',
    specialization: 'Pulmonologist',
    qualification: 'MBBS, MD (Pulmonary Medicine)',
    license_number: 'MED-PULM-2017-012',
    experience: '13 years',
    rating: 4.8,
    consultation_fee: 155.00,
    bio: 'Lung and respiratory specialist. Expert in asthma, COPD, and sleep disorders. Advanced training in critical care.'
  },
  {
    name: 'Dr. Rachel Green',
    email: 'rachel.green@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0113',
    specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD, DM (Gastroenterology)',
    license_number: 'MED-GAST-2018-013',
    experience: '10 years',
    rating: 4.7,
    consultation_fee: 165.00,
    bio: 'Digestive system specialist treating conditions like IBS, acid reflux, and liver diseases. Performs endoscopic procedures.'
  },
  {
    name: 'Dr. Kevin Patel',
    email: 'kevin.patel@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0114',
    specialization: 'Urologist',
    qualification: 'MBBS, MS (Urology)',
    license_number: 'MED-UROL-2016-014',
    experience: '16 years',
    rating: 4.6,
    consultation_fee: 150.00,
    bio: 'Urinary tract and male reproductive system specialist. Expert in kidney stones, prostate issues, and urological cancers.'
  },
  {
    name: 'Dr. Sophia Davis',
    email: 'sophia.davis@hospital.com',
    password: 'doctor123',
    phone: '+1-555-0115',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD, DM (Endocrinology)',
    license_number: 'MED-ENDO-2019-015',
    experience: '8 years',
    rating: 4.9,
    consultation_fee: 170.00,
    bio: 'Hormone and metabolism specialist. Treats diabetes, thyroid disorders, and hormonal imbalances with personalized care plans.'
  }
];

async function registerDoctor(doctorData) {
  try {
    console.log(`\n📝 Registering: ${doctorData.name} (${doctorData.email})`);

    // Check if doctor already exists in auth
    const { data: existingAuth } = await supabase.auth.admin.listUsers();
    const authExists = existingAuth?.users?.some(u => u.email === doctorData.email);

    if (authExists) {
      console.log(`   ⚠️  Auth account already exists, skipping...`);
      return { success: false, reason: 'already_exists' };
    }

    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: doctorData.email,
      password: doctorData.password,
      options: {
        data: {
          role: 'doctor'
        }
      }
    });

    if (authError) {
      console.log(`   ❌ Auth error: ${authError.message}`);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      console.log(`   ❌ No user returned from auth`);
      return { success: false, error: 'No user returned' };
    }

    console.log(`   ✅ Auth account created: ${authData.user.id}`);

    // Check if doctor profile exists
    const { data: existingDoctor } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', doctorData.email)
      .maybeSingle();

    let profile;

    if (existingDoctor) {
      // Update existing profile with auth_id
      console.log(`   🔗 Linking to existing doctor profile...`);
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('doctors')
        .update({
          auth_id: authData.user.id,
          is_verified: true,
          is_active: true
        })
        .eq('email', doctorData.email)
        .select()
        .single();

      if (updateError) {
        console.log(`   ❌ Profile update error: ${updateError.message}`);
        return { success: false, error: updateError.message };
      }

      profile = updatedProfile;
      console.log(`   ✅ Profile linked successfully`);
    } else {
      // Create new doctor profile
      console.log(`   📋 Creating new doctor profile...`);
      
      const { data: newProfile, error: profileError } = await supabase
        .from('doctors')
        .insert([
          {
            auth_id: authData.user.id,
            name: doctorData.name,
            email: doctorData.email,
            phone: doctorData.phone,
            specialization: doctorData.specialization,
            qualification: doctorData.qualification,
            license_number: doctorData.license_number,
            experience: doctorData.experience,
            rating: doctorData.rating,
            consultation_fee: doctorData.consultation_fee,
            bio: doctorData.bio,
            is_verified: true,
            is_active: true
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.log(`   ❌ Profile creation error: ${profileError.message}`);
        return { success: false, error: profileError.message };
      }

      profile = newProfile;
      console.log(`   ✅ Profile created successfully`);
    }

    console.log(`   🎉 ${doctorData.name} registered successfully!`);
    return { success: true, profile };

  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function registerAllDoctors() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           REGISTERING ALL SAMPLE DOCTORS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\nTotal doctors to register: ${doctors.length}`);
  console.log('Password for all: doctor123\n');

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  for (const doctor of doctors) {
    const result = await registerDoctor(doctor);
    
    if (result.success) {
      results.success++;
    } else if (result.reason === 'already_exists') {
      results.skipped++;
    } else {
      results.failed++;
      results.errors.push({
        doctor: doctor.name,
        error: result.error
      });
    }

    // Wait a bit between registrations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    REGISTRATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Successfully registered: ${results.success}`);
  console.log(`⚠️  Skipped (already exist): ${results.skipped}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('═══════════════════════════════════════════════════════════');

  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach(err => {
      console.log(`   ${err.doctor}: ${err.error}`);
    });
  }

  if (results.success > 0) {
    console.log('\n🎉 SUCCESS! Doctors can now login with:');
    console.log('   Email: [doctor email from DOCTOR_CREDENTIALS.txt]');
    console.log('   Password: doctor123');
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

// Run the registration
registerAllDoctors()
  .then(() => {
    console.log('✅ Registration process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
