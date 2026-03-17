import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Alert, ListGroup } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

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
      {error && <Alert variant="danger">{error}</Alert>}
      
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
              <Card className="h-100 report-card">
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
                    {report.report_content.length > 100 
                      ? `${report.report_content.substring(0, 100)}...`
                      : report.report_content
                    }
                  </p>

                  {report.doctors && (
                    <div className="mb-2">
                      <small className="text-success">
                        <i className="bi bi-person-check me-1"></i>
                        Reviewed by Dr. {report.doctors.name}
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
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewReport(report)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </Button>
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

              {selectedReport.doctors && (
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

              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mt-2">{selectedReport.report_content}</p>
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
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="me-2"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            href={url}
                            download
                          >
                            <i className="bi bi-download me-1"></i>
                            Download
                          </Button>
                        </div>
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyReports;