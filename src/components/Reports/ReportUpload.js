import React, { useState } from 'react';
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
    const userData = JSON.parse(localStorage.getItem('user_data'));
    const fileName = `${userData.id}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('medical-reports')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportTitle || !reportType || !reportDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      
      // Upload files to Supabase Storage
      const uploadPromises = selectedFiles.map(file => uploadFileToSupabase(file));
      const uploadedPaths = await Promise.all(uploadPromises);
      
      setUploadProgress(50);

      // Get public URLs for the uploaded files
      const attachmentUrls = [];
      for (const path of uploadedPaths) {
        const { data } = supabase.storage
          .from('medical-reports')
          .getPublicUrl(path);
        attachmentUrls.push(data.publicUrl);
      }

      setUploadProgress(75);

      // Save report data to database
      const { data, error } = await supabase
        .from('medical_reports')
        .insert([
          {
            patient_id: userData.id,
            doctor_id: null, // Patient uploaded, no doctor assigned yet
            report_type: reportType,
            report_title: reportTitle,
            report_content: description || 'Patient uploaded medical report',
            report_date: reportDate,
            attachments: attachmentUrls,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setUploadProgress(100);
      setSuccess('Report uploaded successfully!');
      
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

      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload report. Please try again.');
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
            <Form.Label>Upload Files *</Form.Label>
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
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload Report
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ReportUpload;