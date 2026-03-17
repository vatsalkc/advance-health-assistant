import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Nav, Alert } from 'react-bootstrap';
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifyFormData, setModifyFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [activeTab, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments...');
      const response = await doctorAppointmentsAPI.getAll();
      console.log('Appointments response:', response);
      console.log('Appointments data:', response.data.appointments);
      setAppointments(response.data.appointments || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      console.error('Error details:', err.message);
      alert('Failed to load appointments: ' + err.message);
      setAppointments([]);
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
      // Always save diagnosis and prescription, even if empty
      // This ensures the doctor's notes are preserved
      await doctorAppointmentsAPI.addPrescription(
        selectedAppointment.id,
        prescription || '', // Save empty string if no prescription
        diagnosis || '' // Save empty string if no diagnosis
      );
      setShowModal(false);
      setPrescription('');
      setDiagnosis('');
      fetchAppointments();
      alert('Prescription and diagnosis saved successfully');
    } catch (err) {
      console.error('Error saving prescription:', err);
      alert('Failed to save prescription: ' + err.message);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      console.log('[DoctorAppointments] Cancelling appointment:', selectedAppointment.id);
      await doctorAppointmentsAPI.delete(selectedAppointment.id);
      setShowCancelModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
      alert('Appointment cancelled successfully');
    } catch (err) {
      console.error('[DoctorAppointments] Error cancelling appointment:', err);
      console.error('[DoctorAppointments] Error message:', err.message);
      
      let errorMessage = 'Failed to cancel appointment. ';
      if (err.message && err.message.includes('permission')) {
        errorMessage += 'Permission denied. Please run FIX_DOCTOR_PERMISSIONS.sql script.';
      } else if (err.message) {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleModifyClick = (appointment) => {
    setSelectedAppointment(appointment);
    setModifyFormData({
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason
    });
    setShowModifyModal(true);
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('[DoctorAppointments] Modifying appointment:', selectedAppointment.id);
      await doctorAppointmentsAPI.update(selectedAppointment.id, {
        date: modifyFormData.date,
        time: modifyFormData.time,
        reason: modifyFormData.reason,
        status: 'Confirmed' // Keep confirmed status for doctor modifications
      });
      setShowModifyModal(false);
      setSelectedAppointment(null);
      setModifyFormData({ date: '', time: '', reason: '' });
      fetchAppointments();
      alert('Appointment modified successfully');
    } catch (err) {
      console.error('[DoctorAppointments] Error modifying appointment:', err);
      console.error('[DoctorAppointments] Error message:', err.message);
      
      let errorMessage = 'Failed to modify appointment. ';
      if (err.message && err.message.includes('permission')) {
        errorMessage += 'Permission denied. Please run FIX_DOCTOR_PERMISSIONS.sql script.';
      } else if (err.message) {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
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
      <div className="appointments-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="appointments-management-card">
        <Card.Header className="appointments-management-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <i className="bi bi-calendar-check-fill me-2"></i>
                Appointment Management
              </h4>
              <small className="text-white-50">Manage all your patient appointments</small>
            </div>
            <Badge bg="light" text="dark" className="appointments-count-badge">
              {appointments.length} Total
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Filter Tabs */}
          <Nav variant="pills" className="mb-4" style={{ marginTop: '20px' }}>
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
            <div className="appointments-empty-state">
              <i className="bi bi-calendar-x"></i>
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="doctor-appointments-table">
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
                        <div className="patient-info-cell">
                          <div className="patient-info-avatar">
                            {(apt.patient_name || apt.users?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="patient-info-details">
                            <div className="patient-info-name">
                              {apt.patient_name || apt.users?.name || 'Unknown Patient'}
                            </div>
                            {(apt.patient_phone || apt.users?.phone) && (
                              <div className="patient-info-contact">
                                <i className="bi bi-telephone-fill"></i> {apt.patient_phone || apt.users?.phone}
                              </div>
                            )}
                            {apt.users?.email && (
                              <div className="patient-info-contact">
                                <i className="bi bi-envelope-fill"></i> {apt.users.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{apt.date}</strong>
                        <br />
                        <small>{apt.time}</small>
                      </td>
                      <td>{apt.reason}</td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td>
                        {apt.status === 'Pending' && (
                          <div className="appointment-actions">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAccept(apt.id)}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(apt.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Reject
                            </Button>
                          </div>
                        )}
                        {apt.status === 'Confirmed' && (
                          <div className="appointment-actions">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleAddPrescription(apt)}
                            >
                              <i className="bi bi-prescription2 me-1"></i>
                              {apt.prescription ? 'Edit' : 'Add'} Prescription
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => handleModifyClick(apt)}
                              className="mt-1"
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Modify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleCancelClick(apt)}
                              className="mt-1"
                            >
                              <i className="bi bi-x-lg me-1"></i>
                              Cancel
                            </Button>
                          </div>
                        )}
                        {apt.status === 'Rejected' && apt.rejected_reason && (
                          <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="prescription-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-prescription2 me-2"></i>
            Add Prescription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="patient-summary">
              <div><strong>Patient:</strong> {selectedAppointment.patient_name || selectedAppointment.users?.name || 'Unknown Patient'}</div>
              <div><strong>Date:</strong> {selectedAppointment.date} {selectedAppointment.time}</div>
              {selectedAppointment.users?.email && (
                <div><strong>Email:</strong> {selectedAppointment.users.email}</div>
              )}
              {(selectedAppointment.patient_phone || selectedAppointment.users?.phone) && (
                <div><strong>Phone:</strong> {selectedAppointment.patient_phone || selectedAppointment.users.phone}</div>
              )}
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

      {/* Modify Appointment Modal */}
      <Modal
        show={showModifyModal}
        onHide={() => {
          setShowModifyModal(false);
          setSelectedAppointment(null);
          setModifyFormData({ date: '', time: '', reason: '' });
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Modify Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="patient-summary mb-3">
              <div><strong>Patient:</strong> {selectedAppointment.patient_name || selectedAppointment.users?.name || 'Unknown Patient'}</div>
              <div><strong>Email:</strong> {selectedAppointment.users?.email || 'No email'}</div>
              {(selectedAppointment.patient_phone || selectedAppointment.users?.phone) && (
                <div><strong>Phone:</strong> {selectedAppointment.patient_phone || selectedAppointment.users?.phone}</div>
              )}
            </div>
          )}

          <Form onSubmit={handleModifySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-calendar3 me-2"></i>
                Date
              </Form.Label>
              <Form.Control
                type="date"
                value={modifyFormData.date}
                onChange={(e) => setModifyFormData({ ...modifyFormData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-clock me-2"></i>
                Time
              </Form.Label>
              <Form.Control
                type="time"
                value={modifyFormData.time}
                onChange={(e) => setModifyFormData({ ...modifyFormData, time: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-file-text me-2"></i>
                Reason
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={modifyFormData.reason}
                onChange={(e) => setModifyFormData({ ...modifyFormData, reason: e.target.value })}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowModifyModal(false);
                  setSelectedAppointment(null);
                  setModifyFormData({ date: '', time: '', reason: '' });
                }}
                className="flex-fill"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-fill">
                <i className="bi bi-check-lg me-2"></i>
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => {
          setShowCancelModal(false);
          setSelectedAppointment(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
            Confirm Cancellation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>Are you sure you want to cancel this appointment?</p>
              <div className="appointment-details-box p-3 bg-light rounded">
                <div className="mb-2">
                  <strong>Patient:</strong> {selectedAppointment.patient_name || selectedAppointment.users?.name || 'Unknown Patient'}
                </div>
                {selectedAppointment.users?.email && (
                  <div className="mb-2">
                    <strong>Email:</strong> {selectedAppointment.users.email}
                  </div>
                )}
                {(selectedAppointment.patient_phone || selectedAppointment.users?.phone) && (
                  <div className="mb-2">
                    <strong>Phone:</strong> {selectedAppointment.patient_phone || selectedAppointment.users.phone}
                  </div>
                )}
                <div className="mb-2">
                  <strong>Date:</strong> {selectedAppointment.date}
                </div>
                <div className="mb-2">
                  <strong>Time:</strong> {selectedAppointment.time}
                </div>
                <div>
                  <strong>Reason:</strong> {selectedAppointment.reason}
                </div>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                This action cannot be undone. The patient will be notified of the cancellation.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowCancelModal(false);
              setSelectedAppointment(null);
            }}
          >
            Keep Appointment
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            <i className="bi bi-x-lg me-2"></i>
            Yes, Cancel Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorAppointments;
