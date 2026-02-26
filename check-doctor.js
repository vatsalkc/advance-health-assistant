// Quick script to check doctor in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGJmZmpxbGN2b3dkYXJkcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDEwMTAsImV4cCI6MjA4NTI3NzAxMH0.fJtyLVrn7tYCMNcLM_jwkUrFF4yVa4CTd5vSmhHakFg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDoctor() {
  console.log('Checking for doctor "ducho" in Supabase...\n');
  
  // Check all doctors (including inactive)
  const { data: allDoctors, error: allError } = await supabase
    .from('doctors')
    .select('*');
  
  if (allError) {
    console.error('Error fetching all doctors:', allError);
    return;
  }
  
  console.log(`Total doctors in database: ${allDoctors.length}\n`);
  
  // Search for "ducho" by email
  const duchoDoctor = allDoctors.find(d => 
    (d.name && d.name.toLowerCase().includes('ducho')) || 
    (d.email && d.email.toLowerCase().includes('ducho'))
  );
  
  if (duchoDoctor) {
    console.log('✅ Found doctor "ducho":');
    console.log(JSON.stringify(duchoDoctor, null, 2));
    console.log('\nDoctor status:');
    console.log('- is_active:', duchoDoctor.is_active);
    console.log('- is_verified:', duchoDoctor.is_verified);
    console.log('- has auth_id:', !!duchoDoctor.auth_id);
    console.log('- created_at:', duchoDoctor.created_at);
    
    // Fix if inactive
    if (!duchoDoctor.is_active) {
      console.log('\n⚠️  Doctor is INACTIVE - Activating now...');
      const { data: updated, error: updateError } = await supabase
        .from('doctors')
        .update({ is_active: true })
        .eq('id', duchoDoctor.id)
        .select();
      
      if (updateError) {
        console.error('Error activating doctor:', updateError);
      } else {
        console.log('✅ Doctor activated successfully!');
        console.log('Updated data:', updated[0]);
      }
    } else {
      console.log('\n✅ Doctor is already ACTIVE');
    }
  } else {
    console.log('❌ Doctor "ducho" not found in doctors table');
    console.log('\n📧 Checking by email: duchopatel@gmail.com');
    
    const { data: emailDoctor, error: emailError } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', 'duchopatel@gmail.com')
      .maybeSingle();
    
    if (emailDoctor) {
      console.log('✅ Found by email:', emailDoctor);
      
      if (!emailDoctor.is_active) {
        console.log('\n⚠️  Doctor is INACTIVE - Activating now...');
        const { data: updated, error: updateError } = await supabase
          .from('doctors')
          .update({ is_active: true })
          .eq('id', emailDoctor.id)
          .select();
        
        if (updateError) {
          console.error('Error activating doctor:', updateError);
        } else {
          console.log('✅ Doctor activated successfully!');
        }
      }
    } else {
      console.log('❌ Not found by email either');
      console.log('\n⚠️  ISSUE: Doctor can login but has no profile in doctors table!');
      console.log('This means the registration created Auth account but failed to create doctor profile.');
      console.log('\nSOLUTION: Need to manually create doctor profile or re-register.');
    }
  }
}

checkDoctor();
