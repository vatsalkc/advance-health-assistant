import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Row, Col } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function ReportUploadFixed({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportTitle || !reportType || !reportDate) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData || !userData.id) {
        throw new Error('Please log in again to upload reports');
      }
      
      console.log('Starting upload process for user:', userData.id);
      setUploadProgress(10);

      // Step 1: Get system doctor
      const { data: availableDoctor, error: doctorError } = await supabase
        .from('doctors')
        .select('id, name')
        .limit(1)
        .single();
      
      if (doctorError || !availableDoctor) {
        throw new Error('System configuration error. Please contact administrator.');
      }

      console.log('Using system doctor:', availableDoctor.name);
      setUploadProgress(20);

      // Step 2: Upload files if any
      let attachmentUrls = [];
      
      if (selectedFiles.length > 0) {
        console.log('Uploading', selectedFiles.length, 'files...');
        
        // Ensure bucket exists and is public
        try {
          const { error: bucketError } = await supabase.storage
            .from('medical-reports')
            .list('', { limit: 1 });
          
          if (bucketError && bucketError.message.includes('Bucket not found')) {
            console.log('Creating medical-reports bucket...');
            await supabase.storage.createBucket('medical-reports', { public: true });
          }
        } catch (bucketErr) {
          console.warn('Bucket check failed:', bucketErr);
        }
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          console.log(`Uploading file ${i + 1}:`, file.name);
          
          try {
            // Create unique filename
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop();
            const fileName = `${userData.id}/${timestamp}_${randomId}.${extension}`;
            
            console.log('Upload path:', fileName);
            
            // Upload file
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('medical-reports')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error('Upload failed:', uploadError);
              throw new Error(`Upload failed: ${uploadError.message}`);
            }

            console.log('File uploaded to:', uploadData.path);

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('medical-reports')
              .getPublicUrl(uploadData.path);

            if (urlData?.publicUrl) {
              attachmentUrls.push(urlData.publicUrl);
              console.log('Public URL generated:', urlData.publicUrl);
            }

            // Update progress
            const fileProgress = 30 + ((i + 1) / selectedFiles.length) * 40;
            setUploadProgress(Math.round(fileProgress));
            
          } catch (fileError) {
            console.error(`File ${file.name} upload failed:`, fileError);
            setError(`Failed to upload ${file.name}: ${fileError.message}`);
          }
        }
        
        console.log('Final attachment URLs:', attachmentUrls);
      }

      setUploadProgress(75);

      // Step 3: Save report to database
      const reportData = {
        patient_id: userData.id,
        doctor_id: availableDoctor.id,
        report_type: reportType,
        report_title: reportTitle,
        report_content: `[PATIENT UPLOAD] ${description || `Patient uploaded ${reportType} report: ${reportTitle}`}`,
        report_date: reportDate,
        attachments: attachmentUrls // Always save as array
      };
      
      console.log('Saving report data:', reportData);
      
      const { data: savedReport, error: saveError } = await supabase
        .from('medical_reports')
        .insert([reportData])
        .select()
        .single();

      if (saveError) {
        console.error('Database save error:', saveError);
        throw new Error(`Failed to save report: ${saveError.message}`);
      }

      console.log('Report saved successfully:', savedReport);
      console.log('Saved attachments:', savedReport.attachments);

      setUploadProgress(100);
      
      const fileCount = attachmentUrls.length;
      if (fileCount > 0) {
        setSuccess(`Report "${reportTitle}" uploaded successfully with ${fileCount} file(s)!`);
      } else if (selectedFiles.length > 0) {
        setSuccess(`Report "${reportTitle}" saved, but file uploads failed. You can try again.`);
      } else {
        setSuccess(`Report "${reportTitle}" uploaded successfully!`);
      }
      
      // Reset form
      setSelectedFiles([]);
      setReportTitle('');
      setReportType('');
      setReportDate('');
      setDescription('');
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(savedReport);
      }

      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);

    } catch (err) {
      console.error('Upload process error:', err);
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
          Upload Medical Reports (Fixed Version)
        </h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
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
              Upload images (JPG, PNG) or PDF files. Maximum 10MB per file.
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
              disabled={uploading}
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
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ReportUploadFixed;