import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, ListGroup, Alert } from 'react-bootstrap';
import { statsAPI, appointmentsAPI, medicinesAPI } from '../../utils/api';
import authService from '../../services/authService';
import axios from 'axios';

function Dashboard({ user, onNavigate, onSymptomResult }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [todayMedicines, setTodayMedicines] = useState([]);
  const [recentSymptomChecks, setRecentSymptomChecks] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    activeMedicines: 0,
    symptomsChecked: 0
  });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Add a refresh function that can be called when data changes
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  // Listen for storage events to refresh dashboard when data changes
  useEffect(() => {
    const handleStorageChange = () => {
      fetchDashboardData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh every 30 seconds to keep data fresh
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Dynamic API URL detection for mobile compatibility
      const getApiBaseUrl = () => {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          return `http://${window.location.hostname}:5000`;
        }
        return process.env.REACT_APP_API_URL || 'http://localhost:5000';
      };
      
      const apiUrl = getApiBaseUrl();
      console.log('Dashboard fetching from:', `${apiUrl}/api/user/profile`);
      
      // Fetch comprehensive user profile
      const profileResponse = await axios.get(`${apiUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      console.log('Profile response:', profileResponse.data);
      const profileData = profileResponse.data;
      setUserProfile(profileData.user);
      setStats(profileData.stats);
      
      // Set recent data
      const appointments = profileData.recent_data.appointments;
      const medicines = profileData.recent_data.medicines;
      const symptomChecks = profileData.recent_data.symptom_checks;
      
      // Filter upcoming appointments
      const today = new Date();
      const upcoming = appointments
        .filter(apt => new Date(apt.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingAppointments(upcoming);
      
      // Set active medicines
      setTodayMedicines(medicines.filter(m => m.active));
      
      // Set recent symptom checks
      setRecentSymptomChecks(symptomChecks);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error response:', error.response?.data);
      
      // Fallback to individual API calls if profile endpoint fails
      try {
        console.log('Attempting fallback API calls...');
        
        // Use dynamic API URL for fallback calls too
        const getApiBaseUrl = () => {
          if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return `http://${window.location.hostname}:5000/api`;
          }
          return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        };
        
        const apiBaseUrl = getApiBaseUrl();
        const authHeaders = {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        };
        
        // Fetch stats
        const statsResponse = await axios.get(`${apiBaseUrl}/stats`, { headers: authHeaders });
        setStats(statsResponse.data);
        console.log('Stats fetched:', statsResponse.data);
        
        // Fetch appointments
        const appointmentsResponse = await axios.get(`${apiBaseUrl}/appointments`, { headers: authHeaders });
        const appointments = appointmentsResponse.data.appointments;
        const today = new Date();
        const upcoming = appointments
          .filter(apt => new Date(apt.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingAppointments(upcoming);
        console.log('Appointments fetched:', appointments.length);
        
        // Fetch medicines
        const medicinesResponse = await axios.get(`${apiBaseUrl}/medicines`, { headers: authHeaders });
        const medicines = medicinesResponse.data.medicines;
        setTodayMedicines(medicines.filter(m => m.active));
        console.log('Medicines fetched:', medicines.length);
        
        // Fetch recent symptom checks
        const symptomResponse = await axios.get(`${apiBaseUrl}/symptom-checks?limit=5`, { headers: authHeaders });
        setRecentSymptomChecks(symptomResponse.data.symptom_checks);
        console.log('Symptom checks fetched:', symptomResponse.data.symptom_checks.length);
        
      } catch (fallbackError) {
        console.error('Fallback API calls also failed:', fallbackError);
        console.error('Fallback error response:', fallbackError.response?.data);
      }
      
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
    },
    {
      title: 'View History',
      icon: 'clock-history',
      color: 'info',
      description: 'See your medical history',
      action: () => onNavigate('userHistory')
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted">Here's your health overview for today</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your health data...</p>
        </div>
      ) : (
        <>
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
              <Col xl={3} lg={6} md={6} sm={12} key={index} className="mb-3">
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
        <Col lg={4} md={6} sm={12} className="mb-4">
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
                          <h6 className="mb-1">{appointment.doctor_name}</h6>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {appointment.date} at {appointment.time}
                          </small>
                          <br />
                          <small className="text-muted">
                            <i className="bi bi-person-badge me-1"></i>
                            {appointment.specialization}
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
        <Col lg={4} md={6} sm={12} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <i className="bi bi-alarm me-2"></i>
                  Active Medicines
                </Card.Title>
                <Button variant="link" size="sm" onClick={() => onNavigate('medicineReminder')}>
                  View All
                </Button>
              </div>
              <ListGroup variant="flush">
                {todayMedicines.length === 0 ? (
                  <p className="text-muted">No active medicines</p>
                ) : (
                  todayMedicines.slice(0, 3).map((medicine) => (
                    <ListGroup.Item key={medicine.id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{medicine.medicine_name}</h6>
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

        {/* Recent Symptom Checks */}
        <Col lg={4} md={12} sm={12} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  Recent Symptom Checks
                </Card.Title>
                <Button variant="link" size="sm" onClick={() => onNavigate('symptomChecker')}>
                  Check Now
                </Button>
              </div>
              <ListGroup variant="flush">
                {recentSymptomChecks.length === 0 ? (
                  <p className="text-muted">No symptom checks yet</p>
                ) : (
                  recentSymptomChecks.slice(0, 3).map((check) => (
                    <ListGroup.Item key={check.id}>
                      <div>
                        <h6 className="mb-1">{check.predicted_disease}</h6>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {new Date(check.timestamp).toLocaleDateString()}
                        </small>
                        <br />
                        <small className="text-muted">
                          <i className="bi bi-person-badge me-1"></i>
                          {check.recommended_specialization}
                        </small>
                        <br />
                        <div className="mt-1">
                          {check.symptoms.slice(0, 3).map((symptom, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                              {symptom}
                            </Badge>
                          ))}
                          {check.symptoms.length > 3 && (
                            <Badge bg="secondary" className="me-1 mb-1">
                              +{check.symptoms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Profile Summary */}
      {userProfile && (
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <i className="bi bi-person-circle me-2"></i>
                  Profile Summary
                </Card.Title>
                <Row>
                  <Col md={3} sm={12} className="text-center mb-3">
                    <div>
                      <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: 'var(--primary-color)' }}></i>
                      <h5 className="mt-2">{userProfile.name}</h5>
                      <p className="text-muted">{userProfile.email}</p>
                    </div>
                  </Col>
                  <Col md={9} sm={12}>
                    <Row>
                      <Col lg={4} md={6} sm={12} className="mb-3">
                        <div>
                          <strong>Personal Information</strong>
                          <div className="mt-2">
                            {userProfile.age && (
                              <p className="mb-1">
                                <i className="bi bi-calendar3 me-2"></i>
                                Age: {userProfile.age} years
                              </p>
                            )}
                            {userProfile.gender && (
                              <p className="mb-1">
                                <i className="bi bi-gender-ambiguous me-2"></i>
                                Gender: {userProfile.gender}
                              </p>
                            )}
                            {userProfile.phone && (
                              <p className="mb-1">
                                <i className="bi bi-telephone me-2"></i>
                                Phone: {userProfile.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col lg={4} md={6} sm={12} className="mb-3">
                        <div>
                          <strong>Health Activity</strong>
                          <div className="mt-2">
                            <p className="mb-1">
                              <i className="bi bi-calendar-check me-2"></i>
                              {stats.totalAppointments} Total Appointments
                            </p>
                            <p className="mb-1">
                              <i className="bi bi-capsule me-2"></i>
                              {stats.activeMedicines} Active Medicines
                            </p>
                            <p className="mb-1">
                              <i className="bi bi-heart-pulse me-2"></i>
                              {stats.symptomsChecked} Symptom Checks
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col lg={4} md={12} sm={12} className="mb-3">
                        <div>
                          <strong>Account Information</strong>
                          <div className="mt-2">
                            <p className="mb-1">
                              <i className="bi bi-calendar-plus me-2"></i>
                              Member since: {new Date(userProfile.created_at).toLocaleDateString()}
                            </p>
                            <p className="mb-1">
                              <i className="bi bi-shield-check me-2"></i>
                              Account Status: Active
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
