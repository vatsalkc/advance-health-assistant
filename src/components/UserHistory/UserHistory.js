import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ListGroup, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import { appointmentsAPI, medicinesAPI } from '../../utils/api';
import axios from 'axios';

function UserHistory({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [symptomChecks, setSymptomChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all appointments
      const appointmentsResponse = await appointmentsAPI.getAll();
      setAppointments(appointmentsResponse.data.appointments);

      // Fetch all medicines
      const medicinesResponse = await medicinesAPI.getAll();
      setMedicines(medicinesResponse.data.medicines);

      // Fetch all symptom checks
      const symptomResponse = await axios.get(`${process.env.REACT_APP_API_URL}/symptom-checks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setSymptomChecks(symptomResponse.data.symptom_checks);

      setLoading(false);
    } catch (err) {
      setError('Failed to load user history');
      setLoading(false);
      console.error('Error fetching user history:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your health history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Your Health History</h2>
        <p className="text-muted">Complete overview of your medical records and activities</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
              <h3 className="mt-2">{appointments.length}</h3>
              <p className="text-muted mb-0">Total Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-capsule" style={{ fontSize: '2rem', color: 'var(--success-color)' }}></i>
              <h3 className="mt-2">{medicines.length}</h3>
              <p className="text-muted mb-0">Medicine Records</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-clipboard2-pulse" style={{ fontSize: '2rem', color: 'var(--info-color)' }}></i>
              <h3 className="mt-2">{symptomChecks.length}</h3>
              <p className="text-muted mb-0">Symptom Checks</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed History Tabs */}
      <Card>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            {/* Appointments Tab */}
            <Tab eventKey="appointments" title={`Appointments (${appointments.length})`}>
              <ListGroup variant="flush">
                {appointments.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <p className="text-muted mt-2">No appointments found</p>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <ListGroup.Item key={appointment.id}>
                      <Row>
                        <Col md={8}>
                          <h6 className="mb-1">{appointment.doctor_name}</h6>
                          <p className="mb-1 text-muted">
                            <i className="bi bi-person-badge me-2"></i>
                            {appointment.specialization}
                          </p>
                          <p className="mb-1">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {appointment.date} at {appointment.time}
                          </small>
                        </Col>
                        <Col md={4} className="text-end">
                          <Badge bg={
                            appointment.status === 'Confirmed' ? 'success' :
                            appointment.status === 'Completed' ? 'primary' :
                            appointment.status === 'Cancelled' ? 'danger' : 'warning'
                          }>
                            {appointment.status}
                          </Badge>
                          <br />
                          <small className="text-muted">
                            Created: {formatDate(appointment.created_at)}
                          </small>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Tab>

            {/* Medicines Tab */}
            <Tab eventKey="medicines" title={`Medicines (${medicines.length})`}>
              <ListGroup variant="flush">
                {medicines.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-capsule" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <p className="text-muted mt-2">No medicine records found</p>
                  </div>
                ) : (
                  medicines.map((medicine) => (
                    <ListGroup.Item key={medicine.id}>
                      <Row>
                        <Col md={8}>
                          <h6 className="mb-1">{medicine.medicine_name}</h6>
                          <p className="mb-1">
                            <strong>Dosage:</strong> {medicine.dosage}
                          </p>
                          <p className="mb-1">
                            <strong>Schedule:</strong> {medicine.time} - {medicine.frequency}
                          </p>
                          <small className="text-muted">
                            Added: {formatDate(medicine.created_at)}
                          </small>
                        </Col>
                        <Col md={4} className="text-end">
                          <Badge bg={medicine.active ? 'success' : 'secondary'}>
                            {medicine.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Tab>

            {/* Symptom Checks Tab */}
            <Tab eventKey="symptoms" title={`Symptom Checks (${symptomChecks.length})`}>
              <ListGroup variant="flush">
                {symptomChecks.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-clipboard2-pulse" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <p className="text-muted mt-2">No symptom checks found</p>
                  </div>
                ) : (
                  symptomChecks.map((check) => (
                    <ListGroup.Item key={check.id}>
                      <Row>
                        <Col md={8}>
                          <h6 className="mb-1">{check.predicted_disease}</h6>
                          {check.confidence && (
                            <p className="mb-1">
                              <strong>Confidence:</strong> {check.confidence.toFixed(1)}%
                            </p>
                          )}
                          <p className="mb-1">
                            <strong>Recommended Specialist:</strong> {check.recommended_specialization}
                          </p>
                          {check.description && (
                            <p className="mb-1">
                              <strong>Description:</strong> {check.description}
                            </p>
                          )}
                          <div className="mb-2">
                            <strong>Symptoms:</strong>
                            <div className="mt-1">
                              {check.symptoms.map((symptom, index) => (
                                <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {check.precautions && check.precautions.length > 0 && (
                            <div className="mb-2">
                              <strong>Precautions:</strong>
                              <ul className="mt-1 mb-0">
                                {check.precautions.slice(0, 3).map((precaution, index) => (
                                  <li key={index} className="small text-muted">{precaution}</li>
                                ))}
                                {check.precautions.length > 3 && (
                                  <li className="small text-muted">...and {check.precautions.length - 3} more</li>
                                )}
                              </ul>
                            </div>
                          )}
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {formatDate(check.timestamp)}
                          </small>
                        </Col>
                        <Col md={4} className="text-end">
                          <Badge bg="info">
                            Analysis Complete
                          </Badge>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserHistory;