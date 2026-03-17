import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Tab, Nav } from 'react-bootstrap';
import { doctorPatientsAPI } from '../../utils/doctorApi';
import FileViewer from '../Reports/FileViewer';
import ReportDownloader from '../Reports/ReportDownloader';

function PatientDetails({ patientId, onBack }) {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await doctorPatientsAPI.getPatientDetails(patientId);
      setPatientData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patient details:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading patient details...</p>
      </div>
    );
  }

  if (!patientData) {
    return (
      <Card>
        <Card.Body>
          <p className="text-muted">Patient not found</p>
          <Button onClick={onBack}>Back to Patients</Button>
        </Card.Body>
      </Card>
    );
  }

  const { patient, appointments, symptomChecks, medicalReports, patientDiagnoses } = patientData;

  return (
    <div className="patient-details-container">
      <Button variant="outline-primary" onClick={onBack} className="mb-4 back-button">
        <i className="bi bi-arrow-left me-2"></i>
        Back to Patients
      </Button>

      {/* Patient Info Card - Enhanced */}
      <Card className="patient-info-card mb-4">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={2} className="text-center">
              <div className="patient-avatar-large">
                {patient.name.charAt(0).toUpperCase()}
              </div>
            </Col>
            <Col md={6}>
              <h2 className="patient-name mb-2">{patient.name}</h2>
              <p className="patient-id text-muted mb-3">
                <i className="bi bi-person-badge me-2"></i>
                Patient ID: {patient.id.substring(0, 8)}...
              </p>
              
              <Row className="patient-info-grid">
                <Col md={6} className="mb-3">
                  <div className="info-item">
                    <i className="bi bi-envelope-fill text-primary me-2"></i>
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <strong>{patient.email}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="info-item">
                    <i className="bi bi-telephone-fill text-success me-2"></i>
                    <div>
                      <small className="text-muted d-block">Phone</small>
                      <strong>{patient.phone || 'N/A'}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <i className="bi bi-calendar-event text-info me-2"></i>
                    <div>
                      <small className="text-muted d-block">Age</small>
                      <strong>{patient.age || 'N/A'} years</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <i className="bi bi-gender-ambiguous text-warning me-2"></i>
                    <div>
                      <small className="text-muted d-block">Gender</small>
                      <strong>{patient.gender || 'N/A'}</strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <div className="patient-stats">
                <div className="stat-item">
                  <div className="stat-icon bg-primary">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{appointments.length}</h3>
                    <p>Appointments</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon bg-info">
                    <i className="bi bi-heart-pulse"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{symptomChecks.length}</h3>
                    <p>Symptom Checks</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon bg-success">
                    <i className="bi bi-file-medical"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{medicalReports.length}</h3>
                    <p>Reports</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon bg-warning">
                    <i className="bi bi-clipboard2-pulse"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{patientDiagnoses ? patientDiagnoses.length : 0}</h3>
                    <p>All Diagnoses</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs for different sections - Restructured */}
      <Tab.Container defaultActiveKey="overview">
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="overview">
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="diagnoses">
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  My Diagnoses ({appointments.filter(a => a.diagnosis && a.diagnosis.trim()).length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="appointments">
                  <i className="bi bi-calendar-check me-2"></i>
                  All Appointments ({appointments.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="prescriptions">
                  <i className="bi bi-prescription2 me-2"></i>
                  Prescriptions ({appointments.filter(a => a.prescription && a.prescription.trim()).length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports">
                  <i className="bi bi-file-medical me-2"></i>
                  Patient Reports ({medicalReports.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="all-diagnoses">
                  <i className="bi bi-clipboard-data me-2"></i>
                  All Patient Diagnoses ({patientDiagnoses ? patientDiagnoses.length : 0})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="history">
                  <i className="bi bi-clock-history me-2"></i>
                  Patient History
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              {/* Overview Tab - NEW */}
              <Tab.Pane eventKey="overview">
                <Row>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-activity me-2 text-primary"></i>
                          Recent Activity
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {appointments.length === 0 ? (
                          <p className="text-muted">No recent appointments</p>
                        ) : (
                          <div>
                            {appointments
                              .sort((a, b) => new Date(b.date) - new Date(a.date))
                              .slice(0, 3)
                              .map(apt => (
                                <div key={apt.id} className="mb-3 pb-3 border-bottom">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <strong className="text-primary">{apt.date}</strong>
                                    <Badge bg={
                                      apt.status === 'Confirmed' ? 'success' :
                                      apt.status === 'Pending' ? 'warning' :
                                      apt.status === 'Rejected' ? 'danger' : 'secondary'
                                    }>
                                      {apt.status}
                                    </Badge>
                                  </div>
                                  <p className="mb-1 small"><strong>Reason:</strong> {apt.reason}</p>
                                  {apt.diagnosis && (
                                    <p className="mb-1 small text-success">
                                      <i className="bi bi-check-circle me-1"></i>
                                      Diagnosis provided
                                    </p>
                                  )}
                                  {apt.prescription && (
                                    <p className="mb-0 small text-info">
                                      <i className="bi bi-prescription2 me-1"></i>
                                      Prescription given
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-graph-up me-2 text-success"></i>
                          Health Summary
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Total Visits</span>
                            <Badge bg="primary" className="fs-6">{appointments.length}</Badge>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Diagnoses Given</span>
                            <Badge bg="success" className="fs-6">
                              {appointments.filter(a => a.diagnosis && a.diagnosis.trim()).length}
                            </Badge>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Prescriptions</span>
                            <Badge bg="info" className="fs-6">
                              {appointments.filter(a => a.prescription && a.prescription.trim()).length}
                            </Badge>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Symptom Checks</span>
                            <Badge bg="warning" className="fs-6">{symptomChecks.length}</Badge>
                          </div>
                        </div>
                        
                        {appointments.filter(a => a.diagnosis && a.diagnosis.trim()).length > 0 && (
                          <div className="mt-4">
                            <h6 className="text-muted mb-2">Latest Diagnosis</h6>
                            <div className="p-3 bg-light rounded">
                              {(() => {
                                const latestDiagnosis = appointments
                                  .filter(a => a.diagnosis && a.diagnosis.trim())
                                  .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                                return (
                                  <div>
                                    <small className="text-muted">{latestDiagnosis.date}</small>
                                    <p className="mb-0 mt-1">{latestDiagnosis.diagnosis}</p>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* My Diagnoses Tab - NEW DEDICATED TAB */}
              <Tab.Pane eventKey="diagnoses">
                {appointments.filter(a => a.diagnosis && a.diagnosis.trim()).length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-clipboard2-pulse" style={{ fontSize: '4rem', color: '#94a3b8' }}></i>
                    <h4 className="text-muted mt-3">No Diagnoses Yet</h4>
                    <p className="text-muted">You haven't provided any diagnoses for this patient yet.</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
                        All My Diagnoses for {patient.name}
                      </h5>
                      <Badge bg="primary" className="fs-6">
                        {appointments.filter(a => a.diagnosis && a.diagnosis.trim()).length} Total
                      </Badge>
                    </div>
                    
                    <ListGroup variant="flush">
                      {appointments
                        .filter(apt => apt.diagnosis && apt.diagnosis.trim())
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((apt, index) => (
                          <ListGroup.Item key={apt.id} className="diagnosis-item border rounded mb-3">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="mb-1 text-primary">
                                  <i className="bi bi-calendar3 me-2"></i>
                                  Diagnosis #{appointments.filter(a => a.diagnosis && a.diagnosis.trim()).length - index}
                                </h6>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <Badge bg="outline-primary">{apt.date} • {apt.time}</Badge>
                                  <Badge bg={
                                    apt.status === 'Confirmed' ? 'success' :
                                    apt.status === 'Cancelled' ? 'secondary' :
                                    apt.status === 'Rejected' ? 'danger' : 'secondary'
                                  }>
                                    {apt.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-end">
                                <small className="text-muted">
                                  {(() => {
                                    const diagnosisDate = new Date(apt.date);
                                    const today = new Date();
                                    const diffTime = Math.abs(today - diagnosisDate);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
                                  })()}
                                </small>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <small className="text-muted d-block mb-1">
                                <i className="bi bi-person-fill me-1"></i>
                                Patient's Complaint
                              </small>
                              <p className="mb-0 p-2 bg-light rounded">{apt.reason}</p>
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
                                <strong className="text-primary">My Diagnosis</strong>
                              </div>
                              <div className="p-3 bg-primary bg-opacity-10 rounded border-start border-4 border-primary">
                                <p className="mb-0 diagnosis-text">{apt.diagnosis}</p>
                              </div>
                            </div>
                            
                            {apt.prescription && apt.prescription.trim() && (
                              <div className="mb-2">
                                <div className="d-flex align-items-center mb-2">
                                  <i className="bi bi-prescription2 me-2 text-success"></i>
                                  <strong className="text-success">Prescribed Treatment</strong>
                                </div>
                                <div className="p-3 bg-success bg-opacity-10 rounded border-start border-4 border-success">
                                  <p className="mb-0 prescription-text">{apt.prescription}</p>
                                </div>
                              </div>
                            )}
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </div>
                )}
              </Tab.Pane>
              {/* All Appointments Tab - Restructured */}
              <Tab.Pane eventKey="appointments">
                {appointments.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    <p className="text-muted mt-3">No appointments</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="bi bi-calendar-check me-2 text-primary"></i>
                        Complete Appointment History
                      </h5>
                      <Badge bg="primary" className="fs-6">{appointments.length} Total</Badge>
                    </div>
                    
                    <ListGroup variant="flush">
                      {appointments
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(apt => (
                          <ListGroup.Item key={apt.id} className="border-start border-4 mb-3 rounded" style={{
                            borderColor: apt.status === 'Confirmed' ? '#10b981' :
                                       apt.status === 'Pending' ? '#f59e0b' :
                                       apt.status === 'Rejected' ? '#ef4444' :
                                       apt.status === 'Cancelled' ? '#6b7280' : '#94a3b8'
                          }}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <strong style={{ fontSize: '16px' }}>{apt.date} • {apt.time}</strong>
                                  <Badge bg={
                                    apt.status === 'Confirmed' ? 'success' :
                                    apt.status === 'Pending' ? 'warning' :
                                    apt.status === 'Rejected' ? 'danger' :
                                    apt.status === 'Cancelled' ? 'secondary' : 'secondary'
                                  }>
                                    {apt.status}
                                  </Badge>
                                </div>
                                <p className="mb-2"><strong>Reason:</strong> {apt.reason}</p>
                                {apt.diagnosis && apt.diagnosis.trim() && (
                                  <div className="mb-2 p-3 bg-primary bg-opacity-10 rounded">
                                    <strong className="text-primary">
                                      <i className="bi bi-clipboard2-pulse me-2"></i>
                                      My Diagnosis:
                                    </strong>
                                    <p className="mb-0 mt-1">{apt.diagnosis}</p>
                                  </div>
                                )}
                                {apt.prescription && apt.prescription.trim() && (
                                  <div className="mb-2 p-3 bg-success bg-opacity-10 rounded">
                                    <strong className="text-success">
                                      <i className="bi bi-prescription2 me-2"></i>
                                      Prescription:
                                    </strong>
                                    <p className="mb-0 mt-1">{apt.prescription}</p>
                                  </div>
                                )}
                                {apt.rejected_reason && (
                                  <div className="mb-0 p-2 bg-danger bg-opacity-10 rounded">
                                    <strong className="text-danger">Rejection Reason:</strong>
                                    <p className="mb-0 mt-1">{apt.rejected_reason}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </div>
                )}
              </Tab.Pane>

              {/* Prescriptions Tab - Enhanced */}
              <Tab.Pane eventKey="prescriptions">
                {appointments.filter(a => a.prescription && a.prescription.trim()).length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-prescription2" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    <p className="text-muted mt-3">No prescriptions yet</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="bi bi-prescription2 me-2 text-success"></i>
                        All Prescriptions Given
                      </h5>
                      <Badge bg="success" className="fs-6">
                        {appointments.filter(a => a.prescription && a.prescription.trim()).length} Total
                      </Badge>
                    </div>
                    
                    <ListGroup variant="flush">
                      {appointments
                        .filter(apt => apt.prescription && apt.prescription.trim())
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(apt => (
                          <ListGroup.Item key={apt.id} className="prescription-item border rounded mb-3">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="mb-1">
                                  <i className="bi bi-calendar3 me-2 text-primary"></i>
                                  {apt.date} • {apt.time}
                                </h6>
                                <Badge bg={
                                  apt.status === 'Confirmed' ? 'success' :
                                  apt.status === 'Cancelled' ? 'secondary' :
                                  apt.status === 'Rejected' ? 'danger' : 'secondary'
                                } className="me-2">
                                  {apt.status}
                                </Badge>
                                {(apt.status === 'Cancelled' || apt.status === 'Rejected') && (
                                  <Badge bg="info">Prescription Saved</Badge>
                                )}
                              </div>
                            </div>
                            
                            {apt.diagnosis && apt.diagnosis.trim() && (
                              <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded">
                                <div className="d-flex align-items-center mb-2">
                                  <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
                                  <strong className="text-primary">Associated Diagnosis</strong>
                                </div>
                                <p className="mb-0">{apt.diagnosis}</p>
                              </div>
                            )}
                            
                            <div className="p-3 bg-success bg-opacity-10 rounded">
                              <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-prescription2 me-2 text-success"></i>
                                <strong className="text-success">Prescription Details</strong>
                              </div>
                              <p className="mb-0 prescription-text">{apt.prescription}</p>
                            </div>
                            
                            <div className="mt-2 text-muted small">
                              <i className="bi bi-info-circle me-1"></i>
                              Original complaint: {apt.reason}
                            </div>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </div>
                )}
              </Tab.Pane>

              {/* Patient Reports Tab - NEW */}
              <Tab.Pane eventKey="reports">
                {medicalReports.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-file-medical" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    <p className="text-muted mt-3">No reports uploaded yet</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="bi bi-file-medical me-2 text-primary"></i>
                        Patient's Medical Reports
                      </h5>
                      <Badge bg="primary" className="fs-6">{medicalReports.length} Total</Badge>
                    </div>
                    
                    <Row>
                      {medicalReports.map(report => (
                        <Col md={6} lg={4} key={report.id} className="mb-4">
                          <Card className="h-100 report-card">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <Badge bg={
                                  report.report_type === 'Blood Test' ? 'danger' :
                                  report.report_type === 'X-Ray' ? 'info' :
                                  report.report_type === 'MRI' ? 'primary' :
                                  report.report_type === 'CT Scan' ? 'warning' :
                                  report.report_type === 'Ultrasound' ? 'success' :
                                  'secondary'
                                }>
                                  {report.report_type}
                                </Badge>
                                <small className="text-muted">
                                  {new Date(report.report_date).toLocaleDateString()}
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
                                    Uploaded by patient
                                  </small>
                                </div>
                              ) : report.doctors ? (
                                <div className="mb-2">
                                  <small className="text-success">
                                    <i className="bi bi-person-check me-1"></i>
                                    Created by Dr. {report.doctors.name}
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
                                  <small className="text-warning">
                                    <i className="bi bi-paperclip me-1"></i>
                                    {report.attachments.length} attachment(s)
                                  </small>
                                  <div className="mt-2">
                                    {report.attachments.map((url, index) => (
                                      <div key={index} className="mb-2">
                                        <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                                          <div>
                                            <i className={`bi ${url.includes('.pdf') ? 'bi-file-pdf' : 'bi-image'} me-2`}></i>
                                            <span>Attachment {index + 1}</span>
                                          </div>
                                          <FileViewer 
                                            url={url} 
                                            fileName={`report_attachment_${index + 1}`}
                                            index={index}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  {new Date(report.created_at).toLocaleDateString()}
                                </small>
                                <ReportDownloader 
                                  report={report} 
                                  patientName={patient.name}
                                />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Tab.Pane>

              {/* All Patient Diagnoses Tab - NEW */}
              <Tab.Pane eventKey="all-diagnoses">
                {!patientDiagnoses || patientDiagnoses.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-clipboard-data" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    <p className="text-muted mt-3">No diagnoses recorded yet</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="bi bi-clipboard-data me-2 text-warning"></i>
                        Complete Diagnosis History for {patient.name}
                      </h5>
                      <Badge bg="warning" className="fs-6">{patientDiagnoses.length} Total</Badge>
                    </div>
                    
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      This shows all diagnoses from all doctors who have treated this patient.
                    </div>
                    
                    <ListGroup variant="flush">
                      {patientDiagnoses.map((diagnosis, index) => (
                        <ListGroup.Item key={diagnosis.id} className="all-diagnosis-item border rounded mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="mb-1 text-warning">
                                <i className="bi bi-clipboard2-pulse me-2"></i>
                                Diagnosis #{patientDiagnoses.length - index}
                              </h6>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Badge bg="outline-warning">{diagnosis.date} • {diagnosis.time}</Badge>
                                <Badge bg={
                                  diagnosis.status === 'Confirmed' ? 'success' :
                                  diagnosis.status === 'Cancelled' ? 'secondary' :
                                  diagnosis.status === 'Rejected' ? 'danger' : 'secondary'
                                }>
                                  {diagnosis.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-end">
                              {diagnosis.doctors ? (
                                <div>
                                  <small className="text-success d-block">
                                    <i className="bi bi-person-check me-1"></i>
                                    Dr. {diagnosis.doctors.name}
                                  </small>
                                  {diagnosis.doctors.specialization && (
                                    <small className="text-muted">
                                      {diagnosis.doctors.specialization}
                                    </small>
                                  )}
                                </div>
                              ) : (
                                <small className="text-muted">Doctor info unavailable</small>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <small className="text-muted d-block mb-1">
                              <i className="bi bi-person-fill me-1"></i>
                              Patient's Complaint
                            </small>
                            <p className="mb-0 p-2 bg-light rounded">{diagnosis.reason}</p>
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-clipboard2-pulse me-2 text-warning"></i>
                              <strong className="text-warning">Medical Diagnosis</strong>
                            </div>
                            <div className="p-3 bg-warning bg-opacity-10 rounded border-start border-4 border-warning">
                              <p className="mb-0 diagnosis-text">{diagnosis.diagnosis}</p>
                            </div>
                          </div>
                          
                          {diagnosis.prescription && diagnosis.prescription.trim() && (
                            <div className="mb-2">
                              <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-prescription2 me-2 text-success"></i>
                                <strong className="text-success">Prescribed Treatment</strong>
                              </div>
                              <div className="p-3 bg-success bg-opacity-10 rounded border-start border-4 border-success">
                                <p className="mb-0 prescription-text">{diagnosis.prescription}</p>
                              </div>
                            </div>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </Tab.Pane>

              {/* Patient History Tab - Combined Symptoms and Reports */}
              <Tab.Pane eventKey="history">
                <Row>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-heart-pulse me-2 text-info"></i>
                          Symptom History ({symptomChecks.length})
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {symptomChecks.length === 0 ? (
                          <p className="text-muted">No symptom checks recorded</p>
                        ) : (
                          <ListGroup variant="flush">
                            {symptomChecks
                              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                              .map(check => (
                                <ListGroup.Item key={check.id} className="px-0">
                                  <div className="mb-2">
                                    <strong className="text-info">{check.predicted_disease}</strong>
                                    <Badge bg="info" className="ms-2">
                                      {check.recommended_specialization}
                                    </Badge>
                                  </div>
                                  <p className="small mb-1">
                                    <strong>Symptoms:</strong> {check.symptoms}
                                  </p>
                                  <p className="small text-muted mb-1">
                                    <strong>Description:</strong> {check.description}
                                  </p>
                                  <p className="small text-muted mb-0">
                                    <strong>Date:</strong> {new Date(check.created_at).toLocaleDateString()}
                                  </p>
                                </ListGroup.Item>
                              ))}
                          </ListGroup>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-file-medical me-2 text-warning"></i>
                          Medical Reports ({medicalReports.length})
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {medicalReports.length === 0 ? (
                          <p className="text-muted">No medical reports available</p>
                        ) : (
                          <ListGroup variant="flush">
                            {medicalReports
                              .sort((a, b) => new Date(b.report_date) - new Date(a.report_date))
                              .map(report => (
                                <ListGroup.Item key={report.id} className="px-0">
                                  <div className="mb-2">
                                    <strong className="text-warning">{report.report_title}</strong>
                                    <Badge bg="secondary" className="ms-2">
                                      {report.report_type}
                                    </Badge>
                                  </div>
                                  <p className="small mb-1">{report.report_content}</p>
                                  <p className="small text-muted mb-0">
                                    <strong>Date:</strong> {report.report_date}
                                  </p>
                                </ListGroup.Item>
                              ))}
                          </ListGroup>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}

export default PatientDetails;
