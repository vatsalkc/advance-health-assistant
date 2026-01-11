import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { getUserStats, subscribeToAppointments, subscribeToMedicines } from '../../firebase/firebaseService';

function Dashboard({ user, onNavigate, onSymptomResult }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [todayMedicines, setTodayMedicines] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    activeMedicines: 0,
    symptomsChecked: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardData();
      
      // Real-time listeners
      const unsubscribeAppointments = subscribeToAppointments(user.uid, (appointments) => {
        const today = new Date();
        const upcoming = appointments
          .filter(apt => new Date(apt.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingAppointments(upcoming);
      });
      
      const unsubscribeMedicines = subscribeToMedicines(user.uid, (medicines) => {
        setTodayMedicines(medicines.filter(m => m.active));
      });
      
      return () => {
        unsubscribeAppointments();
        unsubscribeMedicines();
      };
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userStats = await getUserStats(user.uid);
      setStats(userStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Check Symptoms',
      icon: 'clipboard2-pulse',
      color: 'primary',
      description: 'Analyze your symptoms',
      action: () => onNavigate('symptomChecker')
    },
    {
      title: 'Book Appointment',
      icon: 'calendar-plus',
      color: 'success',
      description: 'Schedule with a doctor',
      action: () => onNavigate('appointments')
    },
    {
      title: 'Medicine Reminder',
      icon: 'alarm',
      color: 'warning',
      description: 'Manage your medications',
      action: () => onNavigate('medicineReminder')
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted">Here's your health overview for today</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Appointments</p>
                <h3 className="mb-0">{stats.totalAppointments}</h3>
              </div>
              <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Active Medicines</p>
                <h3 className="mb-0">{stats.activeMedicines}</h3>
              </div>
              <i className="bi bi-capsule" style={{ fontSize: '2rem', color: 'var(--success-color)' }}></i>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Symptoms Checked</p>
                <h3 className="mb-0">{stats.symptomsChecked}</h3>
              </div>
              <i className="bi bi-heart-pulse" style={{ fontSize: '2rem', color: 'var(--info-color)' }}></i>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        {quickActions.map((action, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="dashboard-card" onClick={action.action}>
              <div className={`icon-wrapper bg-${action.color} bg-opacity-10`}>
                <i className={`bi bi-${action.icon} text-${action.color}`}></i>
              </div>
              <h5>{action.title}</h5>
              <p className="text-muted mb-0">{action.description}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Upcoming Appointments */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <i className="bi bi-calendar-event me-2"></i>
                  Upcoming Appointments
                </Card.Title>
                <Button variant="link" size="sm" onClick={() => onNavigate('appointments')}>
                  View All
                </Button>
              </div>
              <ListGroup variant="flush">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-muted">No upcoming appointments</p>
                ) : (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <ListGroup.Item key={appointment.id}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{appointment.doctorName}</h6>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {appointment.date} at {appointment.time}
                          </small>
                        </div>
                        <Badge bg={appointment.status === 'Confirmed' ? 'success' : 'warning'}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Today's Medicines */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <i className="bi bi-alarm me-2"></i>
                  Today's Medicines
                </Card.Title>
                <Button variant="link" size="sm" onClick={() => onNavigate('medicineReminder')}>
                  View All
                </Button>
              </div>
              <ListGroup variant="flush">
                {todayMedicines.length === 0 ? (
                  <p className="text-muted">No medicines scheduled for today</p>
                ) : (
                  todayMedicines.map((medicine) => (
                    <ListGroup.Item key={medicine.id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{medicine.medicineName}</h6>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {medicine.time} - {medicine.dosage}
                          </small>
                          <br />
                          <Badge bg="info" className="mt-1">{medicine.frequency}</Badge>
                        </div>
                        <Badge bg={medicine.active ? 'success' : 'secondary'}>
                          {medicine.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
