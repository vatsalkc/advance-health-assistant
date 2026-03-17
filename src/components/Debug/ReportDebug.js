import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function ReportDebug() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDebugCheck = async () => {
    setLoading(true);
    try {
      const results = {};
      
      // Check current user
      const { data: { user } } = await supabase.auth.getUser();
      results.currentUser = user;
      
      // Check if user is a doctor
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('auth_id', user?.id)
        .single();
      
      results.doctorData = doctorData;
      results.doctorError = doctorError;
      
      // Check total reports in system (this might fail due to RLS)
      const { data: allReports, error: allReportsError } = await supabase
        .from('medical_reports')
        .select('id, patient_id, doctor_id, report_title, report_content')
        .limit(5);
      
      results.allReports = allReports;
      results.allReportsError = allReportsError;
      
      // Check appointments for this doctor
      if (doctorData) {
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id, user_id, doctor_id')
          .eq('doctor_id', doctorData.id)
          .limit(5);
        
        results.appointments = appointments;
        results.appointmentsError = appointmentsError;
        
        // Try to get reports for patients with appointments
        if (appointments && appointments.length > 0) {
          const patientIds = appointments.map(a => a.user_id);
          const { data: patientReports, error: patientReportsError } = await supabase
            .from('medical_reports')
            .select('id, patient_id, doctor_id, report_title, report_content')
            .in('patient_id', patientIds);
          
          results.patientReports = patientReports;
          results.patientReportsError = patientReportsError;
        }
      }
      
      setDebugInfo(results);
    } catch (error) {
      setDebugInfo({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <Card>
      <Card.Header>
        <h5>Report Access Debug Tool</h5>
      </Card.Header>
      <Card.Body>
        <Button onClick={runDebugCheck} disabled={loading}>
          {loading ? 'Running Debug...' : 'Run Debug Check'}
        </Button>
        
        {debugInfo && (
          <div className="mt-3">
            <Alert variant="info">
              <h6>Debug Results:</h6>
              <pre style={{ fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </Alert>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ReportDebug;