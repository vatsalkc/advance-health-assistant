import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Alert, ListGroup } from 'react-bootstrap';
import { supabase } from '../../config/supabase';
import FileViewer from './FileViewer';
import ReportDownloader from './ReportDownloader';

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [deleting, setDeleting] = useState(null); // Track which report is being deleted

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user_data'));
      
      const { data, error } = await supabase
        .from('medical_reports')
        .select(`
          *,
          doctors:doctor_id (
            name,
            specialization
          )
        `)
        .eq('patient_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
      
      // Debug logging
      console.log('MyReports - Fetched reports:', data);
      data?.forEach((report, index) => {
        console.log(`Report ${index + 1}:`, {
          id: report.id,
          title: report.report_title,
          attachments: report.attachments,
          attachmentsType: typeof report.attachments,
          attachmentsLength: report.attachments?.length
        });
      });
      
      // Store user data for download component
      setUserData(userData);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleDeleteReport = async (reportId, reportTitle) => {
    const reportToDelete = reports.find(r => r.id === reportId);
    const fileCount = reportToDelete?.attachments?.length || 0;
    
    let confirmMessage = `Are you sure you want to delete "${reportTitle}"?`;
    if (fileCount > 0) {
      confirmMessage += `\n\nThis will also delete ${fileCount} attached file(s).`;
    }
    confirmMessage += '\n\nThis action cannot be undone.';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeleting(reportId);
    
    try {
      // Delete files from storage if they exist
      if (reportToDelete?.attachments && Array.isArray(reportToDelete.attachments)) {
        console.log('Deleting', reportToDelete.attachments.length, 'files from storage...');
        
        for (const url of reportToDelete.attachments) {
          try {
            // Extract file path from URL
            const urlParts = url.split('/');
            const bucketIndex = urlParts.findIndex(part => part === 'medical-reports');
            
            if (bucketIndex !== -1) {
              const filePath = urlParts.slice(bucketIndex + 1).join('/');
              console.log('Deleting file:', filePath);
              
              const { error: deleteError } = await supabase.storage
                .from('medical-reports')
                .remove([filePath]);
              
              if (deleteError) {
                console.warn('Failed to delete file:', filePath, deleteError);
              } else {
                console.log('File deleted successfully:', filePath);
              }
            }
          } catch (fileError) {
            console.warn('Error deleting file:', fileError);
          }
        }
      }
      
      // Delete the report from database
      const { error } = await supabase
        .from('medical_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setReports(prevReports => prevReports.filter(report => report.id !== reportId));
      
      // Close modal if the deleted report was being viewed
      if (selectedReport?.id === reportId) {
        setShowModal(false);
        setSelectedReport(null);
      }
      
      console.log('Report deleted successfully:', reportTitle);
      
      // Show success message briefly
      const successMessage = fileCount > 0 
        ? `Report "${reportTitle}" and ${fileCount} file(s) deleted successfully.`
        : `Report "${reportTitle}" deleted successfully.`;
      
      // You could add a success state here if needed
      
    } catch (err) {
      console.error('Error deleting report:', err);
      setError(`Failed to delete report: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const getReportTypeColor = (type) => {
    const colors = {
      'Blood Test': 'danger',
      'X-Ray': 'info',
      'MRI': 'primary',
      'CT Scan': 'warning',
      'Ultrasound': 'success',
      'ECG': 'secondary',
      'Prescription': 'success',
      'Discharge Summary': 'primary',
      'Other': 'secondary'
    };
    return colors[type] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <i className="bi bi-file-medical me-2 text-primary"></i>
          My Medical Reports
        </h4>
        <Badge bg="primary" className="fs-6">{reports.length} Reports</Badge>
      </div>

      {reports.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-file-medical" style={{ fontSize: '4rem', color: '#94a3b8' }}></i>
            <h5 className="text-muted mt-3">No Reports Yet</h5>
            <p className="text-muted">Upload your medical reports to keep track of your health records.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {reports.map(report => (
            <Col md={6} lg={4} key={report.id} className="mb-4">
              <Card className="h-100 report-card" style={{ cursor: 'pointer' }} onClick={() => handleViewReport(report)}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge bg={getReportTypeColor(report.report_type)}>
                      {report.report_type}
                    </Badge>
                    <small className="text-muted">
                      {formatDate(report.report_date)}
                    </small>
                  </div>
                  
                  <h6 className="card-title">{report.report_title}</h6>
                  
                  <p className="card-text text-muted small">
                    {(() => {
                      let content = report.report_content;
                      if (content.startsWith('[PATIENT UPLOAD] ')) {
                        content = content.replace('[PATIENT UPLOAD] ', '');
                      }
                      return content.length > 100 
                        ? `${content.substring(0, 100)}...`
                        : content;
                    })()}
                  </p>

                  {report.report_content && report.report_content.startsWith('[PATIENT UPLOAD]') ? (
                    <div className="mb-2">
                      <small className="text-info">
                        <i className="bi bi-upload me-1"></i>
                        Uploaded by you
                      </small>
                    </div>
                  ) : report.doctors ? (
                    <div className="mb-2">
                      <small className="text-success">
                        <i className="bi bi-person-check me-1"></i>
                        Reviewed by Dr. {report.doctors.name}
                      </small>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="bi bi-file-medical me-1"></i>
                        System report
                      </small>
                    </div>
                  )}

                  {report.attachments && report.attachments.length > 0 && (
                    <div className="mb-3">
                      <small className="text-info">
                        <i className="bi bi-paperclip me-1"></i>
                        {report.attachments.length} attachment(s)
                      </small>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Uploaded {formatDate(report.created_at)}
                    </small>
                    <div className="d-flex gap-2 btn-group-actions" onClick={(e) => e.stopPropagation()}>
                      <ReportDownloader 
                        report={report} 
                        patientName={userData?.name || 'Patient'}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id, report.report_title);
                        }}
                        disabled={deleting === report.id}
                        title="Delete this report"
                        className="flex-shrink-0"
                      >
                        {deleting === report.id ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Report Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-medical me-2"></i>
            {selectedReport?.report_title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Report Type:</strong>
                  <Badge bg={getReportTypeColor(selectedReport.report_type)} className="ms-2">
                    {selectedReport.report_type}
                  </Badge>
                </Col>
                <Col md={6}>
                  <strong>Report Date:</strong>
                  <span className="ms-2">{formatDate(selectedReport.report_date)}</span>
                </Col>
              </Row>

              {selectedReport.report_content && !selectedReport.report_content.startsWith('[PATIENT UPLOAD]') && selectedReport.doctors && (
                <Row className="mb-3">
                  <Col>
                    <strong>Reviewed by:</strong>
                    <span className="ms-2 text-success">
                      Dr. {selectedReport.doctors.name}
                      {selectedReport.doctors.specialization && 
                        ` (${selectedReport.doctors.specialization})`
                      }
                    </span>
                  </Col>
                </Row>
              )}
              
              {selectedReport.report_content && selectedReport.report_content.startsWith('[PATIENT UPLOAD]') && (
                <Row className="mb-3">
                  <Col>
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      This report was uploaded by you and has not been reviewed by a doctor yet.
                    </div>
                  </Col>
                </Row>
              )}

              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mt-2">
                  {selectedReport.report_content && selectedReport.report_content.startsWith('[PATIENT UPLOAD]') 
                    ? selectedReport.report_content.replace('[PATIENT UPLOAD] ', '')
                    : selectedReport.report_content
                  }
                </p>
              </div>

              {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                <div>
                  <strong>Attachments:</strong>
                  <ListGroup className="mt-2">
                    {selectedReport.attachments.map((url, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <i className={`bi ${url.includes('.pdf') ? 'bi-file-pdf' : 'bi-image'} me-2`}></i>
                          Attachment {index + 1}
                        </div>
                        <FileViewer 
                          url={url} 
                          fileName={`${selectedReport.report_title}_attachment_${index + 1}`}
                          index={index}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}

              <div className="mt-3 text-muted small">
                <i className="bi bi-clock me-1"></i>
                Uploaded on {formatDate(selectedReport.created_at)}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              setShowModal(false);
              handleDeleteReport(selectedReport.id, selectedReport.report_title);
            }}
            disabled={deleting === selectedReport?.id}
          >
            {deleting === selectedReport?.id ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-1"></i>
                Delete Report
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyReports;