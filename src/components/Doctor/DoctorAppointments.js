import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Nav, Tab } from 'react-bootstrap';
import { doctorAppointmentsAPI } from '../../utils/doctorApi';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prescription, setPrescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [activeTab, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorAppointmentsAPI.getAll();
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    if (activeTab === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(apt => apt.status.toLowerCase() === activeTab)
      );
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Confirmed');
      fetchAppointments();
    } catch (err) {
      console.error('Error accepting appointment:', err);
      alert('Failed to accept appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Rejected', null, reason);
      fetchAppointments();
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      alert('Failed to reject appointment');
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescription(appointment.prescription || '');
    setDiagnosis(appointment.diagnosis || '');
    setShowModal(true);
  };

  const handleSavePrescription = async () => {
    try {
      await doctorAppointmentsAPI.addPrescription(
        selectedAppointment.id,
        prescription,
        diagnosis
      );
      setShowModal(false);
      fetchAppointments();
      alert('Prescription saved successfully');
    } catch (err) {
      console.error('Error saving prescription:', err);
      alert('Failed to save prescription');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Confirmed': 'success',
      'Rejected': 'danger',
      'Completed': 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header>
          <h4>Appointment Management</h4>
        </Card.Header>
        <Card.Body>
          {/* Filter Tabs */}
          <Nav variant="pills" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'all'} 
                onClick={() => setActiveTab('all')}
              >
                All ({appointments.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'pending'} 
                onClick={() => setActiveTab('pending')}
              >
                Pending ({appointments.filter(a => a.status === 'Pending').length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'confirmed'} 
                onClick={() => setActiveTab('confirmed')}
              >
                Confirmed ({appointments.filter(a => a.status === 'Confirmed').length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'rejected'} 
                onClick={() => setActiveTab('rejected')}
              >
                Rejected ({appointments.filter(a => a.status === 'Rejected').length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Appointments Table */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <strong>{apt.users?.name || 'Unknown'}</strong>
                        <br />
                        <small className="text-muted">
                          {apt.users?.email}
                        </small>
                      </td>
                      <td>
                        {apt.date}
                        <br />
                        <small>{apt.time}</small>
                      </td>
                      <td>{apt.reason}</td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td>
                        {apt.status === 'Pending' && (
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAccept(apt.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(apt.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {apt.status === 'Confirmed' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAddPrescription(apt)}
                          >
                            {apt.prescription ? 'Edit' : 'Add'} Prescription
                          </Button>
                        )}
                        {apt.status === 'Rejected' && apt.rejected_reason && (
                          <small className="text-muted">
                            Reason: {apt.rejected_reason}
                          </small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Prescription Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="mb-3">
              <strong>Patient:</strong> {selectedAppointment.users?.name}
              <br />
              <strong>Date:</strong> {selectedAppointment.date} {selectedAppointment.time}
            </div>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prescription</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription details..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePrescription}>
            Save Prescription
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorAppointments;
