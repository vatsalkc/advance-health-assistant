import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Alert } from 'react-bootstrap';
import { doctorStatsAPI, doctorAppointmentsAPI } from '../../utils/doctorApi';

function DoctorDashboard({ doctor, onNavigate }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    rejectedAppointments: 0,
    modifiedAppointments: 0
  });
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching dashboard data...');
      
      // Fetch stats
      const statsResponse = await doctorStatsAPI.get();
      console.log('Stats response:', statsResponse);
      
      // Fetch all appointments to calculate additional stats
      const allAppointmentsResponse = await doctorAppointmentsAPI.getAll();
      const allAppointments = allAppointmentsResponse.data.appointments || [];
      
      // Calculate rejected and modified counts
      const rejectedCount = allAppointments.filter(apt => apt.status === 'Rejected').length;
      const today = new Date().toISOString().split('T')[0];
      const modifiedCount = allAppointments.filter(apt => {
        const createdDate = new Date(apt.created_at).toISOString().split('T')[0];
        const updatedDate = new Date(apt.updated_at).toISOString().split('T')[0];
        return createdDate !== updatedDate;
      }).length;
      
      setStats({
        ...statsResponse.data,
        rejectedAppointments: rejectedCount,
        modifiedAppointments: modifiedCount
      });

      // Fetch pending appointments
      const pendingResponse = await doctorAppointmentsAPI.getAll('Pending');
      console.log('Pending appointments:', pendingResponse.data.appointments);
      setPendingAppointments(pendingResponse.data.appointments || []);

      // Get today's appointments (all statuses)
      const todayAppts = allAppointments.filter(apt => apt.date === today);
      setTodayAppointments(todayAppts);

      // Fetch upcoming confirmed appointments (excluding today)
      const confirmedResponse = await doctorAppointmentsAPI.getAll('Confirmed');
      console.log('Confirmed appointments:', confirmedResponse.data.appointments);
      const upcoming = (confirmedResponse.data.appointments || []).filter(
        apt => apt.date > today
      ).slice(0, 5);
      setUpcomingAppointments(upcoming);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.error('Error details:', err.message);
      setError('Failed to load dashboard data: ' + err.message);
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
      <div className="doctor-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Welcome Section */}
      <Card className="doctor-welcome-card mb-4">
        <Card.Body>
          <h3>Welcome, Dr. {doctor.name}</h3>
          <p className="text-muted mb-0">
            <Badge bg="primary" className="me-2">{doctor.specialization}</Badge>
            {!doctor.is_verified && (
              <Badge bg="warning">Pending Verification</Badge>
            )}
          </p>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <div className="doctor-stat-card">
            <i className="bi bi-people-fill" style={{ color: '#3b82f6' }}></i>
            <h2>{stats.totalPatients}</h2>
            <p>Total Patients</p>
          </div>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <div className="doctor-stat-card">
            <i className="bi bi-calendar-check" style={{ color: '#10b981' }}></i>
            <h2>{stats.todayAppointments}</h2>
            <p>Appointments Today</p>
          </div>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <div className="doctor-stat-card">
            <i className="bi bi-clock-history" style={{ color: '#f59e0b' }}></i>
            <h2>{stats.pendingAppointments}</h2>
            <p>Pending Requests</p>
          </div>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <div className="doctor-stat-card">
            <i className="bi bi-x-circle" style={{ color: '#ef4444' }}></i>
            <h2>{stats.rejectedAppointments}</h2>
            <p>Rejected</p>
          </div>
        </Col>
      </Row>

      {/* Today's Appointments Section */}
      {todayAppointments.length > 0 && (
        <Card className="mb-4 today-appointments-card">
          <Card.Header className="today-appointments-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <i className="bi bi-calendar-day me-2"></i>
                  Today's Appointments
                </h5>
                <small>All appointments scheduled for today</small>
              </div>
              <Badge bg="primary" className="today-count-badge">
                {todayAppointments.length} {todayAppointments.length === 1 ? 'Appointment' : 'Appointments'}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <ListGroup variant="flush">
              {todayAppointments.map(apt => (
                <ListGroup.Item key={apt.id} className="doctor-appointment-item today-appointment-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <div className="patient-avatar me-3">
                          {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="mb-1">{apt.patient_name || apt.users?.name || 'Unknown Patient'}</h6>
                          <div className="patient-details">
                            {apt.users?.email && (
                              <span className="detail-item">
                                <i className="bi bi-envelope"></i> {apt.users.email}
                              </span>
                            )}
                            {(apt.patient_phone || apt.users?.phone) && (
                              <span className="detail-item">
                                <i className="bi bi-telephone"></i> {apt.patient_phone || apt.users.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="appointment-info">
                        <p className="mb-1">
                          <i className="bi bi-clock"></i> <strong>{apt.time}</strong>
                        </p>
                        <p className="mb-0 reason-text">
                          <i className="bi bi-file-text"></i> <strong>Reason:</strong> {apt.reason}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      bg={apt.status === 'Confirmed' ? 'success' : apt.status === 'Pending' ? 'warning' : 'danger'} 
                      className="status-badge"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

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
                <div className="doctor-empty-state">
                  <i className="bi bi-calendar-x"></i>
                  <p>No pending appointments</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {pendingAppointments.map(apt => (
                    <ListGroup.Item key={apt.id} className="doctor-appointment-item">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className="patient-avatar me-3">
                              {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 className="mb-1">{apt.patient_name || apt.users?.name || 'Unknown Patient'}</h6>
                              <div className="patient-details">
                                {apt.users?.email && (
                                  <span className="detail-item">
                                    <i className="bi bi-envelope"></i> {apt.users.email}
                                  </span>
                                )}
                                {(apt.patient_phone || apt.users?.phone) && (
                                  <span className="detail-item">
                                    <i className="bi bi-telephone"></i> {apt.patient_phone || apt.users.phone}
                                  </span>
                                )}
                                {apt.users?.age && (
                                  <span className="detail-item">
                                    <i className="bi bi-person"></i> {apt.users.age} years
                                  </span>
                                )}
                                {apt.users?.gender && (
                                  <span className="detail-item">
                                    <i className="bi bi-gender-ambiguous"></i> {apt.users.gender}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="appointment-info">
                            <p className="mb-1">
                              <i className="bi bi-calendar3"></i> {apt.date} • <i className="bi bi-clock"></i> {apt.time}
                            </p>
                            <p className="mb-0 reason-text">
                              <i className="bi bi-file-text"></i> <strong>Reason:</strong> {apt.reason}
                            </p>
                          </div>
                        </div>
                        <Badge bg="warning" className="status-badge">Pending</Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAcceptAppointment(apt.id)}
                          className="action-btn"
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRejectAppointment(apt.id)}
                          className="action-btn"
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
                <div className="doctor-empty-state">
                  <i className="bi bi-calendar-check"></i>
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {upcomingAppointments.map(apt => (
                    <ListGroup.Item key={apt.id} className="doctor-appointment-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className="patient-avatar me-3">
                              {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 className="mb-1">{apt.patient_name || apt.users?.name || 'Unknown Patient'}</h6>
                              <div className="patient-details">
                                {apt.users?.email && (
                                  <span className="detail-item">
                                    <i className="bi bi-envelope"></i> {apt.users.email}
                                  </span>
                                )}
                                {(apt.patient_phone || apt.users?.phone) && (
                                  <span className="detail-item">
                                    <i className="bi bi-telephone"></i> {apt.patient_phone || apt.users.phone}
                                  </span>
                                )}
                                {apt.users?.age && (
                                  <span className="detail-item">
                                    <i className="bi bi-person"></i> {apt.users.age} years
                                  </span>
                                )}
                                {apt.users?.gender && (
                                  <span className="detail-item">
                                    <i className="bi bi-gender-ambiguous"></i> {apt.users.gender}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="appointment-info">
                            <p className="mb-1">
                              <i className="bi bi-calendar3"></i> {apt.date} • <i className="bi bi-clock"></i> {apt.time}
                            </p>
                            <p className="mb-0 reason-text">
                              <i className="bi bi-file-text"></i> <strong>Reason:</strong> {apt.reason}
                            </p>
                          </div>
                        </div>
                        <Badge bg="success" className="status-badge">Confirmed</Badge>
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
        <Card.Body className="doctor-quick-actions">
          <Row>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onNavigate('appointments')}
              >
                <i className="bi bi-calendar-check"></i>
                <span>Manage Appointments</span>
              </Button>
            </Col>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onNavigate('patients')}
              >
                <i className="bi bi-people"></i>
                <span>View Patients</span>
              </Button>
            </Col>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onNavigate('profile')}
              >
                <i className="bi bi-person-circle"></i>
                <span>My Profile</span>
              </Button>
            </Col>
            <Col md={3} className="mb-3">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise"></i>
                <span>Refresh</span>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DoctorDashboard;
