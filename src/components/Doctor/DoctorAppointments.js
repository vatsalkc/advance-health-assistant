import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Form, Row, Col, Container } from 'react-bootstrap';
import { doctorAppointmentsAPI } from '../../utils/doctorApi';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescription, setPrescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorAppointmentsAPI.getAll();
      const allAppointments = response.data.appointments || [];
      
      const today = new Date().toISOString().split('T')[0];
      
      // Separate appointments
      const todayAppts = allAppointments.filter(apt => 
        apt.date === today && apt.status !== 'Rejected' && apt.status !== 'Cancelled'
      ).sort((a, b) => a.time.localeCompare(b.time));
      
      const upcomingAppts = allAppointments.filter(apt => 
        apt.date > today && (apt.status === 'Confirmed' || apt.status === 'Pending')
      ).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const pendingAppts = allAppointments.filter(apt => 
        apt.status === 'Pending'
      ).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const pastAppts = allAppointments.filter(apt => 
        apt.date < today || apt.status === 'Completed' || apt.status === 'Rejected' || apt.status === 'Cancelled'
      ).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAppointments(allAppointments);
      setTodayAppointments(todayAppts);
      setUpcomingAppointments(upcomingAppts);
      setPendingAppointments(pendingAppts);
      setPastAppointments(pastAppts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      alert('Failed to load appointments');
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Confirmed');
      fetchAppointments();
    } catch (err) {
      alert('Failed to accept appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Rejected', null, reason);
      fetchAppointments();
    } catch (err) {
      alert('Failed to reject appointment');
    }
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Completed');
      fetchAppointments();
    } catch (err) {
      alert('Failed to mark as completed');
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescription(appointment.prescription || '');
    setDiagnosis(appointment.diagnosis || '');
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = async () => {
    try {
      await doctorAppointmentsAPI.addPrescription(
        selectedAppointment.id,
        prescription,
        diagnosis
      );
      setShowPrescriptionModal(false);
      setPrescription('');
      setDiagnosis('');
      fetchAppointments();
      alert('Saved successfully!');
    } catch (err) {
      alert('Failed to save');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': <Badge bg="warning" className="status-badge-new">Pending</Badge>,
      'Confirmed': <Badge bg="success" className="status-badge-new">Confirmed</Badge>,
      'Completed': <Badge bg="info" className="status-badge-new">Completed</Badge>,
      'Rejected': <Badge bg="danger" className="status-badge-new">Rejected</Badge>,
      'Cancelled': <Badge bg="secondary" className="status-badge-new">Cancelled</Badge>
    };
    return badges[status] || <Badge bg="secondary">{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="appointments-page-new">
      {/* Header */}
      <div className="page-header-new mb-4">
        <h2><i className="bi bi-calendar-check me-2"></i>Appointments Management</h2>
        <p className="text-muted">Manage your patient appointments efficiently</p>
      </div>

      {/* Today's Appointments - Priority Section */}
      {todayAppointments.length > 0 && (
        <Card className="today-section-card mb-4">
          <Card.Header className="today-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  <i className="bi bi-calendar-day me-2"></i>
                  Today's Appointments
                </h4>
                <small>All appointments scheduled for today</small>
              </div>
              <Badge bg="primary" className="count-badge">
                {todayAppointments.length}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="appointments-grid-new">
              {todayAppointments.map(apt => (
                <div key={apt.id} className="appointment-card-new today-card">
                  <div className="card-header-new">
                    <div className="patient-info-new">
                      <div className="avatar-new">
                        {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5>{apt.patient_name || apt.users?.name || 'Unknown'}</h5>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>{apt.time}
                        </small>
                      </div>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="card-body-new">
                    <div className="info-row-new">
                      <i className="bi bi-telephone"></i>
                      <span>{apt.patient_phone || apt.users?.phone || 'N/A'}</span>
                    </div>
                    <div className="info-row-new">
                      <i className="bi bi-file-text"></i>
                      <span>{apt.reason}</span>
                    </div>
                  </div>

                  <div className="card-actions-new">
                    {apt.status === 'Pending' && (
                      <>
                        <Button size="sm" variant="success" onClick={() => handleAccept(apt.id)}>
                          <i className="bi bi-check-lg me-1"></i>Accept
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(apt.id)}>
                          <i className="bi bi-x-lg me-1"></i>Reject
                        </Button>
                      </>
                    )}
                    {apt.status === 'Confirmed' && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => handleAddPrescription(apt)}>
                          <i className="bi bi-prescription2 me-1"></i>Add Prescription
                        </Button>
                        <Button size="sm" variant="info" onClick={() => handleMarkCompleted(apt.id)}>
                          <i className="bi bi-check-circle me-1"></i>Mark Completed
                        </Button>
                      </>
                    )}
                    {apt.status === 'Completed' && apt.prescription && (
                      <Button size="sm" variant="outline-primary" onClick={() => handleAddPrescription(apt)}>
                        <i className="bi bi-eye me-1"></i>View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      <Row>
        {/* Pending Requests */}
        {pendingAppointments.length > 0 && (
          <Col lg={6} className="mb-4">
            <Card className="section-card-new">
              <Card.Header className="section-header-new pending-header">
                <h5><i className="bi bi-clock-history me-2"></i>Pending Requests</h5>
                <Badge bg="warning" text="dark">{pendingAppointments.length}</Badge>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="appointments-list-new">
                  {pendingAppointments.slice(0, 5).map(apt => (
                    <div key={apt.id} className="appointment-item-new">
                      <div className="item-header-new">
                        <div className="avatar-small-new">
                          {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1">
                          <h6>{apt.patient_name || apt.users?.name || 'Unknown'}</h6>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>{apt.date} • {apt.time}
                          </small>
                        </div>
                      </div>
                      <div className="item-actions-new">
                        <Button size="sm" variant="success" onClick={() => handleAccept(apt.id)}>
                          Accept
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(apt.id)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <Col lg={6} className="mb-4">
            <Card className="section-card-new">
              <Card.Header className="section-header-new upcoming-header">
                <h5><i className="bi bi-calendar-week me-2"></i>Upcoming</h5>
                <Badge bg="light" text="dark">{upcomingAppointments.length}</Badge>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="appointments-list-new">
                  {upcomingAppointments.slice(0, 5).map(apt => (
                    <div key={apt.id} className="appointment-item-new">
                      <div className="item-header-new">
                        <div className="avatar-small-new">
                          {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1">
                          <h6>{apt.patient_name || apt.users?.name || 'Unknown'}</h6>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>{apt.date} • {apt.time}
                          </small>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card className="section-card-new mb-4">
          <Card.Header className="section-header-new past-header">
            <h5><i className="bi bi-archive me-2"></i>Past Appointments</h5>
            <Badge bg="light" text="dark">{pastAppointments.length}</Badge>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="appointments-list-new">
              {pastAppointments.slice(0, 10).map(apt => (
                <div key={apt.id} className="appointment-item-new">
                  <div className="item-header-new">
                    <div className="avatar-small-new past-avatar">
                      {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <h6>{apt.patient_name || apt.users?.name || 'Unknown'}</h6>
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>{apt.date} • {apt.time}
                      </small>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                  {apt.prescription && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline-secondary" onClick={() => handleAddPrescription(apt)}>
                        <i className="bi bi-eye me-1"></i>View Details
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Prescription Modal */}
      <Modal show={showPrescriptionModal} onHide={() => setShowPrescriptionModal(false)} size="lg" centered>
        <Modal.Header closeButton className="prescription-modal-header">
          <Modal.Title>
            <i className="bi bi-prescription2 me-2"></i>
            Add Prescription & Diagnosis
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="patient-info-modal mb-3">
              <div className="avatar-large-new">
                {(selectedAppointment.patient_name || selectedAppointment.users?.name || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                <h5>{selectedAppointment.patient_name || selectedAppointment.users?.name}</h5>
                <small className="text-muted">
                  {selectedAppointment.date} • {selectedAppointment.time}
                </small>
              </div>
            </div>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-clipboard-pulse me-2"></i>Diagnosis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-prescription2 me-2"></i>Prescription</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription details..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrescriptionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePrescription}>
            <i className="bi bi-save me-2"></i>Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DoctorAppointments;
