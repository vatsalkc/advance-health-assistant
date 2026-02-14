import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Alert } from 'react-bootstrap';
import { doctorStatsAPI, doctorAppointmentsAPI } from '../../utils/doctorApi';

function DoctorDashboard({ doctor, onNavigate }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0
  });
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await doctorStatsAPI.get();
      setStats(statsResponse.data);

      // Fetch pending appointments
      const pendingResponse = await doctorAppointmentsAPI.getAll('Pending');
      setPendingAppointments(pendingResponse.data.appointments);

      // Fetch upcoming confirmed appointments
      const confirmedResponse = await doctorAppointmentsAPI.getAll('Confirmed');
      const today = new Date().toISOString().split('T')[0];
      const upcoming = confirmedResponse.data.appointments.filter(
        apt => apt.date >= today
      ).slice(0, 5);
      setUpcomingAppointments(upcoming);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Confirmed');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error accepting appointment:', err);
      alert('Failed to accept appointment');
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Rejected', null, reason);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      alert('Failed to reject appointment');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Welcome Section */}
      <Card className="mb-4">
        <Card.Body>
          <h3>Welcome, Dr. {doctor.name}</h3>
          <p className="text-muted mb-0">
            <Badge bg="primary">{doctor.specialization}</Badge>
            {!doctor.is_verified && (
              <Badge bg="warning" className="ms-2">Pending Verification</Badge>
            )}
          </p>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-people-fill" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
              <h2 className="mt-3">{stats.totalPatients}</h2>
              <p className="text-muted">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-calendar-check" style={{ fontSize: '2.5rem', color: '#198754' }}></i>
              <h2 className="mt-3">{stats.todayAppointments}</h2>
              <p className="text-muted">Appointments Today</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-clock-history" style={{ fontSize: '2.5rem', color: '#ffc107' }}></i>
              <h2 className="mt-3">{stats.pendingAppointments}</h2>
              <p className="text-muted">Pending Requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Pending Appointments */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Appointments</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => onNavigate('appointments')}
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {pendingAppointments.length === 0 ? (
                <p className="text-muted text-center py-4">No pending appointments</p>
              ) : (
                <ListGroup variant="flush">
                  {pendingAppointments.map(apt => (
                    <ListGroup.Item key={apt.id}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{apt.users?.name || 'Unknown Patient'}</strong>
                          <p className="small text-muted mb-1">
                            {apt.date} • {apt.time}
                          </p>
                          <p className="small mb-2">{apt.reason}</p>
                        </div>
                        <Badge bg="warning">Pending</Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAcceptAppointment(apt.id)}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRejectAppointment(apt.id)}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Reject
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Appointments */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Appointments</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => onNavigate('appointments')}
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted text-center py-4">No upcoming appointments</p>
              ) : (
                <ListGroup variant="flush">
                  {upcomingAppointments.map(apt => (
                    <ListGroup.Item key={apt.id}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{apt.users?.name || 'Unknown Patient'}</strong>
                          <p className="small text-muted mb-1">
                            {apt.date} • {apt.time}
                          </p>
                          <p className="small mb-0">{apt.reason}</p>
                        </div>
                        <Badge bg="success">Confirmed</Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onNavigate('appointments')}
              >
                <i className="bi bi-calendar-check d-block mb-2" style={{ fontSize: '2rem' }}></i>
                Manage Appointments
              </Button>
            </Col>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onNavigate('patients')}
              >
                <i className="bi bi-people d-block mb-2" style={{ fontSize: '2rem' }}></i>
                View Patients
              </Button>
            </Col>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onNavigate('profile')}
              >
                <i className="bi bi-person-circle d-block mb-2" style={{ fontSize: '2rem' }}></i>
                My Profile
              </Button>
            </Col>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise d-block mb-2" style={{ fontSize: '2rem' }}></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DoctorDashboard;
