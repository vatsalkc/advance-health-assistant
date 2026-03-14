import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import adminAPI from '../../utils/adminApi';

function AdminDashboard({ admin, onNavigate }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingDoctors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStatistics();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'bi-people-fill',
      color: '#3b82f6',
      action: () => onNavigate('users')
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: 'bi-person-badge-fill',
      color: '#06b6d4',
      action: () => onNavigate('doctors')
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: 'bi-calendar-check-fill',
      color: '#10b981',
      action: () => onNavigate('appointments')
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingDoctors,
      icon: 'bi-clock-history',
      color: '#f59e0b',
      action: () => onNavigate('pending-doctors'),
      badge: stats.pendingDoctors > 0
    }
  ];

  const quickActions = [
    {
      title: 'Approve Doctors',
      description: 'Review and approve pending doctor registrations',
      icon: 'bi-person-check-fill',
      color: '#10b981',
      action: () => onNavigate('pending-doctors')
    },
    {
      title: 'Manage Doctors',
      description: 'View, edit, and manage all doctors',
      icon: 'bi-person-gear',
      color: '#3b82f6',
      action: () => onNavigate('doctors')
    },
    {
      title: 'Manage Users',
      description: 'View and manage patient accounts',
      icon: 'bi-people',
      color: '#06b6d4',
      action: () => onNavigate('users')
    },
    {
      title: 'View Appointments',
      description: 'Monitor all appointments in the system',
      icon: 'bi-calendar3',
      color: '#8b5cf6',
      action: () => onNavigate('appointments')
    }
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero mb-4">
        <div className="hero-content">
          <h1 className="hero-title">
            <i className="bi bi-shield-check me-3"></i>
            Welcome, {admin?.name || 'Admin'}
          </h1>
          <p className="hero-subtitle">
            System Administration Dashboard
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} lg={3} md={6}>
            <Card 
              className="stat-card-modern stat-purple h-100"
              onClick={stat.action}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)` }}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-content">
                <h2 className="stat-number">
                  {stat.value}
                  {stat.badge && (
                    <Badge bg="warning" className="ms-2" style={{ fontSize: '0.7rem' }}>
                      New
                    </Badge>
                  )}
                </h2>
                <p className="stat-label">{stat.title}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div className="section-header mb-3">
        <h3 className="section-title">Quick Actions</h3>
        <p className="section-subtitle">Manage your system efficiently</p>
      </div>

      <Row className="g-4">
        {quickActions.map((action, index) => (
          <Col key={index} lg={3} md={6}>
            <Card 
              className="action-card"
              onClick={action.action}
            >
              <div 
                className="action-icon" 
                style={{ background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)` }}
              >
                <i className={action.icon}></i>
              </div>
              <h5 className="action-title">{action.title}</h5>
              <p className="action-description">{action.description}</p>
              <i className="bi bi-arrow-right action-arrow"></i>
            </Card>
          </Col>
        ))}
      </Row>

      {/* System Info */}
      <Card className="mt-4">
        <Card.Body>
          <h5>
            <i className="bi bi-info-circle me-2"></i>
            System Information
          </h5>
          <Row className="mt-3">
            <Col md={6}>
              <p className="mb-2">
                <strong>Admin Role:</strong> {admin?.role || 'Administrator'}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {admin?.email}
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <strong>Status:</strong>{' '}
                <Badge bg="success">Active</Badge>
              </p>
              <p className="mb-2">
                <strong>Last Login:</strong> {new Date().toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminDashboard;
