import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import adminAPI from '../../utils/adminApi';

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAppointments();
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteAppointment(appointmentId);
      setSuccessMessage('Appointment deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
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
      <div className="loading-state">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>
            <i className="bi bi-calendar3 me-2"></i>
            Appointment Management
          </h4>
          <Badge bg="primary">{appointments.length} Total</Badge>
        </Card.Header>
        <Card.Body>
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}

          {appointments.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-calendar-x"></i>
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div>
                          <strong>{apt.users?.name || 'Unknown'}</strong>
                          <br />
                          <small className="text-muted">{apt.users?.email}</small>
                        </div>
                      </td>
                      <td>
                        <strong>{apt.doctors?.name || apt.doctor_name}</strong>
                      </td>
                      <td>
                        <Badge bg="info">
                          {apt.doctors?.specialization || apt.specialization}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong>{apt.date}</strong>
                          <br />
                          <small>{apt.time}</small>
                        </div>
                      </td>
                      <td>
                        <small>{apt.reason}</small>
                      </td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(apt.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AppointmentManagement;
