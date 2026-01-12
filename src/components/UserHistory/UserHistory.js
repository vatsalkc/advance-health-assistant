import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert } from 'react-bootstrap';
import { appointmentsAPI, medicinesAPI } from '../../utils/api';

function UserHistory({ user }) {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      const appointments = appointmentsResponse.data.appointments;

      // Fetch all medicines
      const medicinesResponse = await medicinesAPI.getAll();
      const medicines = medicinesResponse.data.medicines;

      // Combine and format logs
      const logs = [];

      // Add appointments to logs
      appointments.forEach(apt => {
        logs.push({
          id: `apt-${apt.id}`,
          type: 'Appointment',
          title: apt.doctor_name,
          subtitle: apt.specialization,
          details: apt.reason,
          date: apt.date,
          time: apt.time,
          status: apt.status,
          created_at: apt.created_at,
          icon: 'calendar-check',
          color: 'primary'
        });
      });

      // Add medicines to logs
      medicines.forEach(med => {
        logs.push({
          id: `med-${med.id}`,
          type: 'Medicine',
          title: med.medicine_name,
          subtitle: med.dosage,
          details: `${med.time} - ${med.frequency}`,
          status: med.active ? 'Active' : 'Inactive',
          created_at: med.created_at,
          icon: 'capsule',
          color: 'success'
        });
      });

      // Sort by created date (newest first)
      logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setHistoryLogs(logs);
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

  const getStatusBadge = (log) => {
    if (log.type === 'Appointment') {
      const statusColors = {
        'Confirmed': 'success',
        'Completed': 'primary',
        'Cancelled': 'danger',
        'Pending': 'warning'
      };
      return <Badge bg={statusColors[log.status] || 'secondary'}>{log.status}</Badge>;
    } else {
      return <Badge bg={log.status === 'Active' ? 'success' : 'secondary'}>{log.status}</Badge>;
    }
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

  const appointmentCount = historyLogs.filter(log => log.type === 'Appointment').length;
  const medicineCount = historyLogs.filter(log => log.type === 'Medicine').length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Your Health History</h2>
        <p className="text-muted">Complete log of your appointments and medicines</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
              <h3 className="mt-2">{appointmentCount}</h3>
              <p className="text-muted mb-0">Total Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-capsule" style={{ fontSize: '2rem', color: 'var(--success-color)' }}></i>
              <h3 className="mt-2">{medicineCount}</h3>
              <p className="text-muted mb-0">Medicine Records</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Activity Log */}
      <Card>
        <Card.Body>
          <h5 className="mb-3">
            <i className="bi bi-clock-history me-2"></i>
            Activity Log
          </h5>
          
          {historyLogs.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              <p className="text-muted mt-3">No activity records found</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {historyLogs.map((log) => (
                <ListGroup.Item key={log.id} className="border-start border-4" style={{ borderColor: `var(--${log.color}-color)` }}>
                  <Row className="align-items-center">
                    <Col xs={1} className="text-center">
                      <i className={`bi bi-${log.icon}`} style={{ fontSize: '1.5rem', color: `var(--${log.color}-color)` }}></i>
                    </Col>
                    <Col xs={11} md={7}>
                      <div className="d-flex align-items-center mb-1">
                        <Badge bg={log.color} className="me-2">{log.type}</Badge>
                        <h6 className="mb-0">{log.title}</h6>
                      </div>
                      <p className="mb-1 text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        {log.subtitle}
                      </p>
                      <p className="mb-1">
                        <strong>Details:</strong> {log.details}
                      </p>
                      {log.date && (
                        <small className="text-muted">
                          <i className="bi bi-calendar3 me-1"></i>
                          {log.date} {log.time && `at ${log.time}`}
                        </small>
                      )}
                    </Col>
                    <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                      {getStatusBadge(log)}
                      <br />
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(log.created_at)}
                      </small>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserHistory;