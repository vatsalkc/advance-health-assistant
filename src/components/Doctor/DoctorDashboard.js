import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Alert, Modal } from 'react-bootstrap';
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
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showTodayModal, setShowTodayModal] = useState(false);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('[DoctorDashboard] Fetching dashboard data...');
      
      // Fetch stats
      const statsResponse = await doctorStatsAPI.get();
      console.log('[DoctorDashboard] Stats response:', statsResponse);
      
      // Fetch all appointments to calculate additional stats
      const allAppointmentsResponse = await doctorAppointmentsAPI.getAll();
      const allAppointments = allAppointmentsResponse.data.appointments || [];
      
      console.log('[DoctorDashboard] All appointments:', allAppointments);
      console.log('[DoctorDashboard] First appointment patient_name:', allAppointments[0]?.patient_name);
      console.log('[DoctorDashboard] First appointment users.name:', allAppointments[0]?.users?.name);
      
      // Calculate rejected and modified counts
      const rejectedCount = allAppointments.filter(apt => apt.status === 'Rejected').length;
      
      // Get local date in YYYY-MM-DD format (not UTC)
      const todayObj = new Date();
      const year = todayObj.getFullYear();
      const month = String(todayObj.getMonth() + 1).padStart(2, '0');
      const day = String(todayObj.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      
      console.log('[DoctorDashboard] Today date for filtering:', today);
      
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
      console.log('[DoctorDashboard] Pending appointments:', pendingResponse.data.appointments);
      setPendingAppointments(pendingResponse.data.appointments || []);

      // Get today's appointments (all statuses) and sort by time
      const todayAppts = allAppointments
        .filter(apt => apt.date === today)
        .sort((a, b) => {
          // Sort by time (ascending)
          const timeA = a.time || '00:00:00';
          const timeB = b.time || '00:00:00';
          return timeA.localeCompare(timeB);
        });
      console.log('[DoctorDashboard] Today appointments (sorted by time):', todayAppts);
      setTodayAppointments(todayAppts);
      
      // Update stats with correct today's count (excluding rejected and cancelled)
      const todayActiveCount = todayAppts.filter(apt => 
        apt.status !== 'Rejected' && apt.status !== 'Cancelled'
      ).length;
      console.log('[DoctorDashboard] Today active count:', todayActiveCount);
      setStats(prevStats => ({
        ...prevStats,
        todayAppointments: todayActiveCount
      }));

      // Fetch upcoming confirmed appointments (excluding today)
      const confirmedResponse = await doctorAppointmentsAPI.getAll('Confirmed');
      console.log('[DoctorDashboard] Confirmed appointments:', confirmedResponse.data.appointments);
      const upcoming = (confirmedResponse.data.appointments || []).filter(
        apt => apt.date > today
      ).slice(0, 5);
      setUpcomingAppointments(upcoming);

      // Fetch rejected appointments
      const rejectedResponse = await doctorAppointmentsAPI.getAll('Rejected');
      console.log('[DoctorDashboard] Rejected appointments:', rejectedResponse.data.appointments);
      setRejectedAppointments(rejectedResponse.data.appointments || []);

      // Get unique patients from all appointments
      const uniquePatients = [];
      const patientIds = new Set();
      allAppointments.forEach(apt => {
        const patientId = apt.user_id;
        if (patientId && !patientIds.has(patientId)) {
          patientIds.add(patientId);
          uniquePatients.push({
            id: patientId,
            name: apt.patient_name || apt.users?.name || 'Unknown Patient',
            email: apt.users?.email,
            phone: apt.patient_phone || apt.users?.phone,
            age: apt.users?.age,
            gender: apt.users?.gender,
            totalAppointments: allAppointments.filter(a => a.user_id === patientId).length,
            lastAppointment: allAppointments
              .filter(a => a.user_id === patientId)
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          });
        }
      });
      setAllPatients(uniquePatients);

      setLoading(false);
    } catch (err) {
      console.error('[DoctorDashboard] Error fetching dashboard data:', err);
      console.error('[DoctorDashboard] Error details:', err.message);
      setError('Failed to load dashboard data: ' + err.message);
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await doctorAppointmentsAPI.updateStatus(appointmentId, 'Confirmed');
      setShowPendingModal(false);
      setSelectedAppointment(null);
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
      setShowPendingModal(false);
      setSelectedAppointment(null);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      alert('Failed to reject appointment');
    }
  };

  const handlePendingCardClick = () => {
    if (pendingAppointments.length > 0) {
      setShowPendingModal(true);
    }
  };

  const handleTodayCardClick = () => {
    if (todayAppointments.length > 0) {
      setShowTodayModal(true);
    }
  };

  const handlePatientsCardClick = () => {
    if (allPatients.length > 0) {
      setShowPatientsModal(true);
    }
  };

  const handleRejectedCardClick = () => {
    if (rejectedAppointments.length > 0) {
      setShowRejectedModal(true);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
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
          <div 
            className="doctor-stat-card clickable-stat-card"
            onClick={handlePatientsCardClick}
            style={{ cursor: allPatients.length > 0 ? 'pointer' : 'default' }}
          >
            <i className="bi bi-people-fill" style={{ color: '#3b82f6' }}></i>
            <h2>{stats.totalPatients}</h2>
            <p>Total Patients</p>
            {allPatients.length > 0 && (
              <small className="text-muted">Click to view</small>
            )}
          </div>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <div 
            className="doctor-stat-card clickable-stat-card"
            onClick={handleTodayCardClick}
            style={{ cursor: todayAppointments.length > 0 ? 'pointer' : 'default' }}
          >
            <i className="bi bi-calendar-check" style={{ color: '#10b981' }}></i>
            <h2>{stats.todayAppointments}</h2>
            <p>Appointments Today</p>
            {todayAppointments.length > 0 && (
              <small className="text-muted">Click to view</small>
            )}
          </div>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <div 
            className="doctor-stat-card clickable-stat-card" 
            onClick={handlePendingCardClick}
            style={{ cursor: pendingAppointments.length > 0 ? 'pointer' : 'default' }}
          >
            <i className="bi bi-clock-history" style={{ color: '#f59e0b' }}></i>
            <h2>{stats.pendingAppointments}</h2>
            <p>Pending Requests</p>
            {pendingAppointments.length > 0 && (
              <small className="text-muted">Click to view</small>
            )}
          </div>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <div 
            className="doctor-stat-card clickable-stat-card"
            onClick={handleRejectedCardClick}
            style={{ cursor: rejectedAppointments.length > 0 ? 'pointer' : 'default' }}
          >
            <i className="bi bi-x-circle" style={{ color: '#ef4444' }}></i>
            <h2>{stats.rejectedAppointments}</h2>
            <p>Rejected</p>
            {rejectedAppointments.length > 0 && (
              <small className="text-muted">Click to view</small>
            )}
          </div>
        </Col>
      </Row>

      {/* Today's Appointments Section - Removed, now in modal */}

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

      {/* Pending Requests Modal */}
      <Modal 
        show={showPendingModal} 
        onHide={() => {
          setShowPendingModal(false);
          setSelectedAppointment(null);
        }}
        size="lg"
        centered
        className="pending-requests-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-clock-history me-2" style={{ color: '#f59e0b' }}></i>
            Pending Appointment Requests
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {pendingAppointments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-check display-1 text-muted"></i>
              <p className="text-muted mt-3">No pending requests</p>
            </div>
          ) : (
            <div className="pending-requests-list">
              {pendingAppointments.map((apt, index) => (
                <div 
                  key={apt.id} 
                  className={`pending-request-item ${selectedAppointment?.id === apt.id ? 'selected' : ''}`}
                  onClick={() => handleAppointmentClick(apt)}
                >
                  <div className="request-header">
                    <div className="d-flex align-items-center">
                      <div className="patient-avatar-large me-3">
                        {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{apt.patient_name || apt.users?.name || 'Unknown Patient'}</h5>
                        <div className="patient-contact-info">
                          {apt.users?.email && (
                            <span className="info-badge">
                              <i className="bi bi-envelope"></i> {apt.users.email}
                            </span>
                          )}
                          {(apt.patient_phone || apt.users?.phone) && (
                            <span className="info-badge">
                              <i className="bi bi-telephone"></i> {apt.patient_phone || apt.users.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge bg="warning" className="request-number">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>

                  <div className="request-details">
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-calendar3 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Date</small>
                            <strong>{new Date(apt.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</strong>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-clock text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Time</small>
                            <strong>{apt.time}</strong>
                          </div>
                        </div>
                      </Col>
                      {apt.users?.age && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-person text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Age</small>
                              <strong>{apt.users.age} years</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                      {apt.users?.gender && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-gender-ambiguous text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Gender</small>
                              <strong>{apt.users.gender}</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>

                    <div className="reason-box mt-3">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-file-text me-1"></i>
                        Reason for Visit
                      </small>
                      <p className="mb-0">{apt.reason}</p>
                    </div>
                  </div>

                  <div className="request-actions">
                    <Button
                      variant="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptAppointment(apt.id);
                      }}
                      className="action-button"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Accept Request
                    </Button>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectAppointment(apt.id);
                      }}
                      className="action-button"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Reject Request
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Today's Appointments Modal */}
      <Modal 
        show={showTodayModal} 
        onHide={() => {
          setShowTodayModal(false);
          setSelectedAppointment(null);
        }}
        size="lg"
        centered
        className="pending-requests-modal today-appointments-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-calendar-day me-2" style={{ color: '#10b981' }}></i>
            Today's Appointments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">No appointments today</p>
            </div>
          ) : (
            <div className="pending-requests-list">
              {todayAppointments.map((apt, index) => (
                <div 
                  key={apt.id} 
                  className={`pending-request-item ${selectedAppointment?.id === apt.id ? 'selected' : ''}`}
                  onClick={() => handleAppointmentClick(apt)}
                >
                  <div className="request-header">
                    <div className="d-flex align-items-center">
                      <div className="patient-avatar-large me-3">
                        {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{apt.patient_name || apt.users?.name || 'Unknown Patient'}</h5>
                        <div className="patient-contact-info">
                          {apt.users?.email && (
                            <span className="info-badge">
                              <i className="bi bi-envelope"></i> {apt.users.email}
                            </span>
                          )}
                          {(apt.patient_phone || apt.users?.phone) && (
                            <span className="info-badge">
                              <i className="bi bi-telephone"></i> {apt.patient_phone || apt.users.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge 
                        bg={apt.status === 'Confirmed' ? 'success' : apt.status === 'Pending' ? 'warning' : apt.status === 'Completed' ? 'info' : 'danger'}
                        className="request-number"
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="request-details">
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-clock text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Time</small>
                            <strong>{apt.time}</strong>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-info-circle text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Status</small>
                            <strong>{apt.status}</strong>
                          </div>
                        </div>
                      </Col>
                      {apt.users?.age && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-person text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Age</small>
                              <strong>{apt.users.age} years</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                      {apt.users?.gender && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-gender-ambiguous text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Gender</small>
                              <strong>{apt.users.gender}</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>

                    <div className="reason-box mt-3">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-file-text me-1"></i>
                        Reason for Visit
                      </small>
                      <p className="mb-0">{apt.reason}</p>
                    </div>

                    {apt.diagnosis && (
                      <div className="diagnosis-box mt-3">
                        <small className="text-muted d-block mb-1">
                          <i className="bi bi-clipboard-pulse me-1"></i>
                          Diagnosis
                        </small>
                        <p className="mb-0">{apt.diagnosis}</p>
                      </div>
                    )}

                    {apt.prescription && (
                      <div className="prescription-box mt-3">
                        <small className="text-muted d-block mb-1">
                          <i className="bi bi-prescription2 me-1"></i>
                          Prescription
                        </small>
                        <p className="mb-0">{apt.prescription}</p>
                      </div>
                    )}
                  </div>

                  {apt.status === 'Pending' && (
                    <div className="request-actions">
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptAppointment(apt.id);
                        }}
                        className="action-button"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectAppointment(apt.id);
                        }}
                        className="action-button"
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Total Patients Modal */}
      <Modal 
        show={showPatientsModal} 
        onHide={() => {
          setShowPatientsModal(false);
        }}
        size="lg"
        centered
        className="pending-requests-modal patients-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-people-fill me-2" style={{ color: '#3b82f6' }}></i>
            Total Patients
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {allPatients.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x display-1 text-muted"></i>
              <p className="text-muted mt-3">No patients yet</p>
            </div>
          ) : (
            <div className="pending-requests-list">
              {allPatients.map((patient, index) => (
                <div 
                  key={patient.id} 
                  className="pending-request-item"
                >
                  <div className="request-header">
                    <div className="d-flex align-items-center">
                      <div className="patient-avatar-large me-3">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{patient.name}</h5>
                        <div className="patient-contact-info">
                          {patient.email && (
                            <span className="info-badge">
                              <i className="bi bi-envelope"></i> {patient.email}
                            </span>
                          )}
                          {patient.phone && (
                            <span className="info-badge">
                              <i className="bi bi-telephone"></i> {patient.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge bg="primary" className="request-number">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>

                  <div className="request-details">
                    <Row className="g-3">
                      {patient.age && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-person text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Age</small>
                              <strong>{patient.age} years</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                      {patient.gender && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-gender-ambiguous text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Gender</small>
                              <strong>{patient.gender}</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-calendar-check text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Total Appointments</small>
                            <strong>{patient.totalAppointments}</strong>
                          </div>
                        </div>
                      </Col>
                      {patient.lastAppointment && (
                        <Col md={6}>
                          <div className="detail-box">
                            <i className="bi bi-clock-history text-primary"></i>
                            <div>
                              <small className="text-muted d-block">Last Visit</small>
                              <strong>{new Date(patient.lastAppointment.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}</strong>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Rejected Appointments Modal */}
      <Modal 
        show={showRejectedModal} 
        onHide={() => {
          setShowRejectedModal(false);
        }}
        size="lg"
        centered
        className="pending-requests-modal rejected-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-x-circle me-2" style={{ color: '#ef4444' }}></i>
            Rejected Appointments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {rejectedAppointments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-check-circle display-1 text-muted"></i>
              <p className="text-muted mt-3">No rejected appointments</p>
            </div>
          ) : (
            <div className="pending-requests-list">
              {rejectedAppointments.map((apt, index) => (
                <div 
                  key={apt.id} 
                  className="pending-request-item rejected-item"
                >
                  <div className="request-header">
                    <div className="d-flex align-items-center">
                      <div className="patient-avatar-large me-3">
                        {(apt.patient_name || apt.users?.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{apt.patient_name || apt.users?.name || 'Unknown Patient'}</h5>
                        <div className="patient-contact-info">
                          {apt.users?.email && (
                            <span className="info-badge">
                              <i className="bi bi-envelope"></i> {apt.users.email}
                            </span>
                          )}
                          {(apt.patient_phone || apt.users?.phone) && (
                            <span className="info-badge">
                              <i className="bi bi-telephone"></i> {apt.patient_phone || apt.users.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge bg="danger" className="request-number">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>

                  <div className="request-details">
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-calendar3 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Date</small>
                            <strong>{new Date(apt.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</strong>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-box">
                          <i className="bi bi-person-badge text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Rejected By</small>
                            <strong>Dr. {doctor.name}</strong>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="reason-box mt-3">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-file-text me-1"></i>
                        Original Reason for Visit
                      </small>
                      <p className="mb-0">{apt.reason}</p>
                    </div>

                    {apt.rejected_reason && (
                      <div className="rejection-box mt-3">
                        <small className="text-muted d-block mb-1">
                          <i className="bi bi-x-octagon me-1"></i>
                          Reason for Rejection
                        </small>
                        <p className="mb-0">{apt.rejected_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DoctorDashboard;
