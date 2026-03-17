// Script to run the schema fix for medical_reports table
// This allows patients to upload their own reports

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'https://mklbffjqlcvowdardqkb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // You'll need the service key for this

if (!supabaseServiceKey) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  console.log('You can find this in your Supabase project settings under API > service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSchemaFix() {
  try {
    console.log('Reading schema fix SQL...');
    const sql = fs.readFileSync('fix_medical_reports_schema.sql', 'utf8');
    
    console.log('Executing schema fix...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error executing schema fix:', error);
      return;
    }
    
    console.log('Schema fix completed successfully!');
    console.log('Patients can now upload their own medical reports.');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runSchemaFix();