import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Row, Col } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function ReportUpload({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Test Supabase connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Test database connection
      const { data, error } = await supabase
        .from('medical_reports')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Database connection failed:', error);
        setConnectionStatus('database_error');
        setError('Database connection failed. Please check your internet connection.');
        return;
      }
      
      // Test storage access
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        console.error('Storage access failed:', storageError);
        setConnectionStatus('storage_error');
        setError('Storage access failed. File uploads may not work properly.');
        return;
      }
      
      console.log('Supabase connection successful');
      setConnectionStatus('connected');
      
    } catch (err) {
      console.error('Connection test failed:', err);
      setConnectionStatus('error');
      setError('Failed to connect to the server. Please check your internet connection.');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Only images and PDFs under 10MB are allowed.');
    } else {
      setError('');
    }

    setSelectedFiles(validFiles);
  };

  const uploadFileToSupabase = async (file) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData || !userData.id) {
        throw new Error('User not authenticated');
      }

      // Create a safe filename
      const fileExtension = file.name.split('.').pop();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${userData.id}/${Date.now()}_${safeFileName}`;
      
      console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type);
      
      // First, check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        throw new Error('Unable to access storage. Please try again.');
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'medical-reports');
      console.log('Medical reports bucket exists:', bucketExists);
      
      if (!bucketExists) {
        console.log('Creating medical-reports bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('medical-reports', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (bucketError) {
          console.error('Failed to create bucket:', bucketError);
          throw new Error(`Storage setup failed: ${bucketError.message}`);
        }
        console.log('Bucket created successfully');
      }
      
      // Try to upload the file
      console.log('Starting file upload...');
      const { data, error } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('File uploaded successfully to:', data.path);
      return data.path;
      
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportTitle || !reportType || !reportDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Files are now optional
    // if (selectedFiles.length === 0) {
    //   setError('Please select at least one file to upload');
    //   return;
    // }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData || !userData.id) {
        throw new Error('Please log in again to upload reports');
      }
      
      setUploadProgress(10);

      // For now, let's save the report without file attachments as a fallback
      // This ensures the functionality works even if storage has issues
      let attachmentUrls = [];
      
      if (selectedFiles.length > 0) {
        try {
          // Try to upload files to Supabase Storage
          console.log('Attempting to upload', selectedFiles.length, 'files...');
          
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            console.log(`Uploading file ${i + 1}/${selectedFiles.length}:`, file.name, 'Size:', file.size, 'Type:', file.type);
            
            const uploadedPath = await uploadFileToSupabase(file);
            console.log('File uploaded to path:', uploadedPath);
            
            // Get public URL for the uploaded file
            const { data } = supabase.storage
              .from('medical-reports')
              .getPublicUrl(uploadedPath);
            
            console.log('Generated public URL:', data.publicUrl);
            attachmentUrls.push(data.publicUrl);
            
            // Update progress
            const progress = 25 + ((i + 1) / selectedFiles.length) * 50;
            setUploadProgress(Math.round(progress));
          }
          
          console.log('All files uploaded successfully. Final URLs:', attachmentUrls);
          
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          setError(`File upload failed: ${uploadError.message}. Report details will still be saved.`);
          // Continue without attachments
          attachmentUrls = [];
        }
      } else {
        // No files selected, just save the report details
        console.log('No files selected, saving report details only');
      }
      
      setUploadProgress(75);

      // Save report data to database
      // Workaround: Use an existing doctor ID for patient uploads
      // We'll use the first doctor in the system as a placeholder for patient uploads
      
      try {
        // Get the first available doctor to use as a system placeholder
        const { data: availableDoctor, error: doctorError } = await supabase
          .from('doctors')
          .select('id, name')
          .limit(1)
          .single();
        
        if (doctorError) {
          console.error('Error fetching system doctor:', doctorError);
          throw new Error('Database access error. Please check your connection and try again.');
        }
        
        if (!availableDoctor) {
          throw new Error('No doctors available in system. Please contact administrator.');
        }
        
        console.log('Using system doctor for patient upload:', availableDoctor.name);
        
        const reportData = {
          patient_id: userData.id,
          doctor_id: availableDoctor.id, // Use first available doctor as placeholder
          report_type: reportType,
          report_title: reportTitle,
          report_content: `[PATIENT UPLOAD] ${description || `Patient uploaded ${reportType} report: ${reportTitle}`}`,
          report_date: reportDate,
          attachments: attachmentUrls.length > 0 ? attachmentUrls : [], // Use empty array instead of null
          created_at: new Date().toISOString()
        };
        
        console.log('Saving report data:', reportData);
        console.log('Attachments being saved:', attachmentUrls);
        console.log('Attachments array length:', attachmentUrls.length);
        
        const { data, error } = await supabase
          .from('medical_reports')
          .insert([reportData])
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          
          // Provide more specific error messages
          if (error.code === '23503') {
            throw new Error('Database relationship error. Please contact administrator.');
          } else if (error.code === '42501') {
            throw new Error('Permission denied. Please log out and log back in.');
          } else {
            throw new Error(`Failed to save report: ${error.message}`);
          }
        }

        console.log('Report saved successfully:', data);
        console.log('Saved report attachments:', data.attachments);
        console.log('Saved attachments type:', typeof data.attachments);
        console.log('Saved attachments length:', data.attachments?.length);
        
        setUploadProgress(100);
        setSuccess(`Report "${reportTitle}" uploaded successfully!`);
        
        // Reset form
        setSelectedFiles([]);
        setReportTitle('');
        setReportType('');
        setReportDate('');
        setDescription('');
        
        // Notify parent component
        if (onUploadSuccess) {
          onUploadSuccess(data);
        }

        setTimeout(() => {
          setSuccess('');
          setError('');
        }, 5000);
        
      } catch (dbError) {
        console.error('Database save error:', dbError);
        setError(dbError.message || 'Failed to save report to database. Please try again.');
        throw dbError;
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-cloud-upload me-2 text-primary"></i>
          Upload Medical Reports
        </h5>
      </Card.Header>
      <Card.Body>
        {connectionStatus === 'checking' && (
          <Alert variant="info">
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Checking connection to server...
            </div>
          </Alert>
        )}
        
        {connectionStatus === 'database_error' && (
          <Alert variant="danger">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Database connection failed. Please check your internet connection and try again.
              </div>
              <Button variant="outline-danger" size="sm" onClick={testConnection}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Retry
              </Button>
            </div>
          </Alert>
        )}
        
        {connectionStatus === 'storage_error' && (
          <Alert variant="warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Storage access limited. You can still create reports, but file uploads may not work.
              </div>
              <Button variant="outline-warning" size="sm" onClick={testConnection}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Retry
              </Button>
            </div>
          </Alert>
        )}
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <fieldset disabled={connectionStatus !== 'connected' && connectionStatus !== 'storage_error'}>
            <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Report Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g., Blood Test Results, X-Ray Report"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Report Type *</Form.Label>
                <Form.Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  required
                >
                  <option value="">Select report type</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG">ECG</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Report Date *</Form.Label>
            <Form.Control
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional notes about this report..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Files (Optional)</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <Form.Text className="text-muted">
              Upload images (JPG, PNG) or PDF files. Maximum 10MB per file. You can also create a report without files.
            </Form.Text>
          </Form.Group>

          {selectedFiles.length > 0 && (
            <div className="mb-3">
              <h6>Selected Files:</h6>
              {selectedFiles.map((file, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                  <div>
                    <i className={`bi ${file.type.startsWith('image/') ? 'bi-image' : 'bi-file-pdf'} me-2`}></i>
                    <span>{file.name}</span>
                    <small className="text-muted ms-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</small>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <ProgressBar now={uploadProgress} animated />
            </div>
          )}

          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              disabled={uploading || (connectionStatus !== 'connected' && connectionStatus !== 'storage_error')}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Save Report
                </>
              )}
            </Button>
          </div>
          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ReportUpload;