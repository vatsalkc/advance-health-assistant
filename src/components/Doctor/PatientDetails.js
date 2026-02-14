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
    <div>
      <Button variant="outline-secondary" onClick={onBack} className="mb-3">
        <i className="bi bi-arrow-left me-2"></i>
        Back to Patients
      </Button>

      {/* Patient Info Card */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h3>{patient.name}</h3>
              <p className="text-muted mb-3">Patient ID: {patient.id}</p>
              
              <Row>
                <Col md={6}>
                  <p><strong>Email:</strong> {patient.email}</p>
                  <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
                  <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="text-end">
              <div className="mb-2">
                <Badge bg="primary" className="me-2">
                  {appointments.length} Appointments
                </Badge>
              </div>
              <div className="mb-2">
                <Badge bg="info" className="me-2">
                  {symptomChecks.length} Symptom Checks
                </Badge>
              </div>
              <div>
                <Badge bg="success">
                  {medicalReports.length} Reports
                </Badge>
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
                <Nav.Link eventKey="appointments">Appointments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="symptoms">Symptom History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports">Medical Reports</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              {/* Appointments Tab */}
              <Tab.Pane eventKey="appointments">
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments</p>
                ) : (
                  <ListGroup variant="flush">
                    {appointments.map(apt => (
                      <ListGroup.Item key={apt.id}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{apt.date} • {apt.time}</strong>
                            <p className="mb-1">{apt.reason}</p>
                            {apt.diagnosis && (
                              <p className="small text-muted mb-1">
                                <strong>Diagnosis:</strong> {apt.diagnosis}
                              </p>
                            )}
                            {apt.prescription && (
                              <p className="small text-muted mb-0">
                                <strong>Prescription:</strong> {apt.prescription}
                              </p>
                            )}
                          </div>
                          <Badge bg={
                            apt.status === 'Confirmed' ? 'success' :
                            apt.status === 'Pending' ? 'warning' :
                            apt.status === 'Rejected' ? 'danger' : 'secondary'
                          }>
                            {apt.status}
                          </Badge>
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
