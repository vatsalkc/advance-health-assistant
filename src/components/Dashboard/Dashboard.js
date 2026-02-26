import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function Dashboard({ user, onNavigate, onSymptomResult, symptomCheckTrigger }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [todayMedicines, setTodayMedicines] = useState([]);
  const [recentSymptomChecks, setRecentSymptomChecks] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    activeMedicines: 0,
    symptomsChecked: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, symptomCheckTrigger]); // Re-fetch when symptomCheckTrigger changes

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('[Dashboard] Fetching dashboard data...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('[Dashboard] Session error:', sessionError);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const [appointmentsResult, medicinesResult, symptomChecksResult, symptomChecksCountResult] = await Promise.all([
        supabase.from('appointments').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('medicines').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('symptom_checks').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
        supabase.from('symptom_checks').select('id', { count: 'exact', head: false }).eq('user_id', userId)
      ]);

      if (!appointmentsResult.error) {
        const appointments = appointmentsResult.data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = appointments
          .filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate >= today;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingAppointments(upcoming);
        setStats(prev => ({ ...prev, totalAppointments: appointments.length }));
      }

      if (!medicinesResult.error) {
        const medicines = medicinesResult.data || [];
        const activeMeds = medicines.filter(m => m.active);
        setTodayMedicines(activeMeds);
        setStats(prev => ({ ...prev, activeMedicines: activeMeds.length }));
      }

      if (!symptomChecksResult.error) {
        const checks = symptomChecksResult.data || [];
        setRecentSymptomChecks(checks);
        
        // Get total count from the count query
        const totalCount = symptomChecksCountResult.data?.length || checks.length;
        setStats(prev => ({ ...prev, symptomsChecked: totalCount }));
      }

      setLoading(false);
    } catch (error) {
      console.error('[Dashboard] Error:', error);
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Symptom Checker',
      icon: 'activity',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'AI-powered diagnosis',
      action: () => onNavigate('symptomChecker')
    },
    {
      title: 'Find Doctors',
      icon: 'person-hearts',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      description: 'Book appointments',
      action: () => onNavigate('appointments')
    },
    {
      title: 'Medications',
      icon: 'capsule-pill',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      description: 'Manage reminders',
      action: () => onNavigate('medicineReminder')
    },
    {
      title: 'Health Records',
      icon: 'file-medical',
      gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      description: 'View history',
      action: () => onNavigate('userHistory')
    }
  ];

  return (
    <div className="modern-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero mb-4">
        <div className="hero-content">
          <h1 className="hero-title">Hello, {user?.name}! 👋</h1>
          <p className="hero-subtitle">Your health journey starts here</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <Row className="g-4 mb-4">
            <Col lg={4} md={6}>
              <div className="stat-card-modern stat-purple">
                <div className="stat-icon">
                  <i className="bi bi-calendar-check-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.totalAppointments}</h3>
                  <p className="stat-label">Appointments</p>
                </div>
                <div className="stat-trend">
                  <i className="bi bi-graph-up"></i>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className="stat-card-modern stat-blue">
                <div className="stat-icon">
                  <i className="bi bi-capsule-pill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.activeMedicines}</h3>
                  <p className="stat-label">Active Medicines</p>
                </div>
                <div className="stat-trend">
                  <i className="bi bi-graph-up"></i>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className="stat-card-modern stat-green">
                <div className="stat-icon">
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.symptomsChecked}</h3>
                  <p className="stat-label">Health Checks</p>
                </div>
                <div className="stat-trend">
                  <i className="bi bi-graph-up"></i>
                </div>
              </div>
            </Col>
          </Row>

          {/* Quick Actions */}
          <div className="section-header mb-4">
            <h4 className="section-title">Quick Actions</h4>
            <p className="section-subtitle">What would you like to do today?</p>
          </div>
          
          <Row className="g-4 mb-5">
            {quickActions.map((action, index) => (
              <Col xl={3} lg={6} md={6} key={index}>
                <div className="action-card" onClick={action.action}>
                  <div className="action-icon" style={{ background: action.gradient }}>
                    <i className={`bi bi-${action.icon}`}></i>
                  </div>
                  <h5 className="action-title">{action.title}</h5>
                  <p className="action-description">{action.description}</p>
                  <div className="action-arrow">
                    <i className="bi bi-arrow-right"></i>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Content Grid */}
          <Row className="g-4">
            {/* Upcoming Appointments */}
            <Col lg={6}>
              <Card className="modern-card">
                <Card.Body>
                  <div className="card-header-modern">
                    <div className="card-title-group">
                      <div className="card-icon-wrapper purple">
                        <i className="bi bi-calendar-event"></i>
                      </div>
                      <div>
                        <h5 className="card-title-modern">Upcoming Appointments</h5>
                        <p className="card-subtitle-modern">Your scheduled visits</p>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="view-all-btn"
                      onClick={() => onNavigate('appointments')}
                    >
                      View All <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </div>
                  
                  <div className="card-content-modern">
                    {upcomingAppointments.length === 0 ? (
                      <div className="empty-state">
                        <i className="bi bi-calendar-x"></i>
                        <p>No upcoming appointments</p>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => onNavigate('appointments')}
                        >
                          Book Now
                        </Button>
                      </div>
                    ) : (
                      <div className="appointment-list">
                        {upcomingAppointments.slice(0, 3).map((apt) => (
                          <div key={apt.id} className="appointment-item-modern">
                            <div className="appointment-date">
                              <div className="date-day">{new Date(apt.date).getDate()}</div>
                              <div className="date-month">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</div>
                            </div>
                            <div className="appointment-details">
                              <h6>{apt.doctor_name}</h6>
                              <p className="text-muted mb-1">
                                <i className="bi bi-clock me-1"></i>{apt.time}
                              </p>
                              <Badge bg={apt.status === 'Confirmed' ? 'success' : 'warning'}>
                                {apt.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Active Medicines */}
            <Col lg={6}>
              <Card className="modern-card">
                <Card.Body>
                  <div className="card-header-modern">
                    <div className="card-title-group">
                      <div className="card-icon-wrapper blue">
                        <i className="bi bi-capsule"></i>
                      </div>
                      <div>
                        <h5 className="card-title-modern">Active Medicines</h5>
                        <p className="card-subtitle-modern">Your medication schedule</p>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="view-all-btn"
                      onClick={() => onNavigate('medicineReminder')}
                    >
                      View All <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </div>
                  
                  <div className="card-content-modern">
                    {todayMedicines.length === 0 ? (
                      <div className="empty-state">
                        <i className="bi bi-capsule"></i>
                        <p>No active medicines</p>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => onNavigate('medicineReminder')}
                        >
                          Add Medicine
                        </Button>
                      </div>
                    ) : (
                      <div className="medicine-list">
                        {todayMedicines.slice(0, 3).map((med) => (
                          <div key={med.id} className="medicine-item-modern">
                            <div className="medicine-icon">
                              <i className="bi bi-capsule-pill"></i>
                            </div>
                            <div className="medicine-details">
                              <h6>{med.medicine_name}</h6>
                              <p className="text-muted mb-1">
                                <i className="bi bi-clock me-1"></i>{med.time} • {med.dosage}
                              </p>
                              <Badge bg="info">{med.frequency}</Badge>
                            </div>
                            <div className="medicine-status">
                              <Badge bg="success">Active</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Health Checks */}
            <Col lg={12}>
              <Card className="modern-card">
                <Card.Body>
                  <div className="card-header-modern">
                    <div className="card-title-group">
                      <div className="card-icon-wrapper green">
                        <i className="bi bi-activity"></i>
                      </div>
                      <div>
                        <h5 className="card-title-modern">Recent Health Checks</h5>
                        <p className="card-subtitle-modern">Your symptom analysis history</p>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="view-all-btn"
                      onClick={() => onNavigate('symptomChecker')}
                    >
                      Check Now <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </div>
                  
                  <div className="card-content-modern">
                    {recentSymptomChecks.length === 0 ? (
                      <div className="empty-state">
                        <i className="bi bi-clipboard2-pulse"></i>
                        <p>No health checks yet</p>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => onNavigate('symptomChecker')}
                        >
                          Start Check
                        </Button>
                      </div>
                    ) : (
                      <Row className="g-3">
                        {recentSymptomChecks.slice(0, 3).map((check) => (
                          <Col lg={4} md={6} key={check.id}>
                            <div className="health-check-card">
                              <div className="check-header">
                                <h6>{check.predicted_disease}</h6>
                                <Badge bg="primary">{check.recommended_specialization}</Badge>
                              </div>
                              <p className="check-date">
                                <i className="bi bi-calendar3 me-1"></i>
                                {new Date(check.created_at).toLocaleDateString()}
                              </p>
                              <div className="check-symptoms">
                                {check.symptoms && typeof check.symptoms === 'string' && 
                                  check.symptoms.split(',').slice(0, 2).map((symptom, idx) => (
                                    <Badge key={idx} bg="light" text="dark" className="me-1">
                                      {symptom.trim()}
                                    </Badge>
                                  ))
                                }
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Dashboard;
