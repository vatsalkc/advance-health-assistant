import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Tab, Nav } from 'react-bootstrap';
import { doctorPatientsAPI } from '../../utils/doctorApi';

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

  const { patient, appointments, symptomChecks, medicalReports } = patientData;

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
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs for different sections */}
      <Tab.Container defaultActiveKey="appointments">
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="appointments">
                  <i className="bi bi-calendar-check me-2"></i>
                  Appointments ({appointments.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="prescriptions">
                  <i className="bi bi-prescription2 me-2"></i>
                  Prescriptions ({appointments.filter(a => a.prescription).length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="symptoms">
                  <i className="bi bi-heart-pulse me-2"></i>
                  Symptom History ({symptomChecks.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports">
                  <i className="bi bi-file-medical me-2"></i>
                  Medical Reports ({medicalReports.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              {/* Appointments Tab */}
              <Tab.Pane eventKey="appointments">
                {appointments.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    <p className="text-muted mt-3">No appointments</p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {appointments.map(apt => (
                      <ListGroup.Item key={apt.id} className="border-start border-4" style={{
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
                            {apt.diagnosis && (
                              <div className="mb-2 p-2 bg-light rounded">
                                <strong className="text-primary">Diagnosis:</strong>
                                <p className="mb-0 mt-1">{apt.diagnosis}</p>
                              </div>
                            )}
                            {apt.prescription && (
                              <div className="mb-2 p-2 bg-light rounded">
                                <strong className="text-success">Prescription:</strong>
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
                )}
              </Tab.Pane>

              {/* Prescriptions Tab - NEW */}
              <Tab.Pane eventKey="prescriptions">
                {appointments.filter(a => a.prescription).length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-prescription2" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    <p className="text-muted mt-3">No prescriptions yet</p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {appointments
                      .filter(apt => apt.prescription)
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(apt => (
                        <ListGroup.Item key={apt.id} className="prescription-item">
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
                          
                          {apt.diagnosis && (
                            <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded">
                              <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
                                <strong className="text-primary">Diagnosis</strong>
                              </div>
                              <p className="mb-0">{apt.diagnosis}</p>
                            </div>
                          )}
                          
                          <div className="p-3 bg-success bg-opacity-10 rounded">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-prescription2 me-2 text-success"></i>
                              <strong className="text-success">Prescription</strong>
                            </div>
                            <p className="mb-0 prescription-text">{apt.prescription}</p>
                          </div>
                          
                          <div className="mt-2 text-muted small">
                            <i className="bi bi-info-circle me-1"></i>
                            Reason for visit: {apt.reason}
                          </div>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                )}
              </Tab.Pane>

              {/* Symptom History Tab */}
              <Tab.Pane eventKey="symptoms">
                {symptomChecks.length === 0 ? (
                  <p className="text-muted">No symptom checks</p>
                ) : (
                  <ListGroup variant="flush">
                    {symptomChecks.map(check => (
                      <ListGroup.Item key={check.id}>
                        <div className="mb-2">
                          <strong>{check.predicted_disease}</strong>
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
              </Tab.Pane>

              {/* Medical Reports Tab */}
              <Tab.Pane eventKey="reports">
                {medicalReports.length === 0 ? (
                  <p className="text-muted">No medical reports</p>
                ) : (
                  <ListGroup variant="flush">
                    {medicalReports.map(report => (
                      <ListGroup.Item key={report.id}>
                        <div className="mb-2">
                          <strong>{report.report_title}</strong>
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
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}

export default PatientDetails;
