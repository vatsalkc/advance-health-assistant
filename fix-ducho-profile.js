// Script to fix ducho's missing doctor profile
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuchoProfile() {
  console.log('🔧 Fixing ducho doctor profile...\n');
  
  // Get auth user by email
  const email = 'duchopatel@gmail.com';
  
  console.log(`Looking for auth user with email: ${email}`);
  
  // Since we can't query auth.users directly with anon key,
  // we'll create the profile with the data from the screenshot
  
  const doctorData = {
    name: 'ducho',
    email: 'duchopatel@gmail.com',
    phone: '7894561230',
    specialization: 'General Physician',
    qualification: 'MBBS',
    license_number: 'ESWP232XC',
    experience: 'Not specified',
    rating: 4.5,
    is_verified: false,
    is_active: true,
    // We'll need to get the auth_id from the login session
    // For now, we'll insert without it and update later
  };
  
  console.log('Creating doctor profile with data:');
  console.log(JSON.stringify(doctorData, null, 2));
  
  // Check if profile already exists
  const { data: existing, error: checkError } = await supabase
    .from('doctors')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  
  if (existing) {
    console.log('\n✅ Doctor profile already exists!');
    console.log('Updating to ensure is_active = true...');
    
    const { data: updated, error: updateError } = await supabase
      .from('doctors')
      .update({ is_active: true })
      .eq('email', email)
      .select();
    
    if (updateError) {
      console.error('❌ Error updating:', updateError);
    } else {
      console.log('✅ Profile updated successfully!');
      console.log(updated[0]);
    }
  } else {
    console.log('\n📝 Creating new doctor profile...');
    
    const { data: created, error: createError } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select();
    
    if (createError) {
      console.error('❌ Error creating profile:', createError);
      console.error('Details:', createError.message);
      
      // If it's an auth_id issue, we need to link it properly
      if (createError.message.includes('auth_id')) {
        console.log('\n⚠️  Need to link auth_id. Please run this after logging in as ducho.');
      }
    } else {
      console.log('✅ Doctor profile created successfully!');
      console.log(created[0]);
      console.log('\n✅ Doctor should now appear in user appointment tab!');
    }
  }
  
  // Verify
  console.log('\n🔍 Verifying...');
  const { data: verified, error: verifyError } = await supabase
    .from('doctors')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  
  if (verified) {
    console.log('✅ Verification successful!');
    console.log('Doctor details:', verified);
    console.log('\nStatus:');
    console.log('- Name:', verified.name);
    console.log('- Email:', verified.email);
    console.log('- Specialization:', verified.specialization);
    console.log('- is_active:', verified.is_active);
    console.log('- is_verified:', verified.is_verified);
  } else {
    console.log('❌ Verification failed');
  }
}

fixDuchoProfile();
