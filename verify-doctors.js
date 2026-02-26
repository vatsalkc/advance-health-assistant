// Verify all active doctors (what patients see)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDoctors() {
  console.log('🔍 Checking what patients see in appointment list...\n');
  
  // This is the EXACT query the app uses
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Total active doctors: ${doctors.length}\n`);
  
  // Find ducho
  const ducho = doctors.find(d => d.email === 'duchopatel@gmail.com');
  
  if (ducho) {
    console.log('✅ DUCHO FOUND IN PATIENT LIST!\n');
    console.log('Doctor details:');
    console.log('- ID:', ducho.id);
    console.log('- Name:', ducho.name);
    console.log('- Email:', ducho.email);
    console.log('- Specialization:', ducho.specialization);
    console.log('- Phone:', ducho.phone);
    console.log('- Qualification:', ducho.qualification);
    console.log('- License:', ducho.license_number);
    console.log('- Experience:', ducho.experience);
    console.log('- Rating:', ducho.rating);
    console.log('- Active:', ducho.is_active);
    console.log('- Verified:', ducho.is_verified);
    console.log('\n✅ Patients CAN see and book appointments with ducho!');
  } else {
    console.log('❌ DUCHO NOT FOUND in patient list');
  }
  
  // Show last 5 doctors
  console.log('\n📋 Last 5 registered doctors:');
  doctors.slice(0, 5).forEach((d, i) => {
    console.log(`${i + 1}. ${d.name} (${d.specialization}) - ${d.email}`);
  });
}

verifyDoctors();
