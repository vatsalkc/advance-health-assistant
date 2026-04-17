import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert, Tab, Nav, Button, Modal } from 'react-bootstrap';
import { appointmentsAPI, medicinesAPI } from '../../utils/api';
import { supabase } from '../../config/supabase';

function UserHistoryEnhanced({ user }) {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [symptomChecks, setSymptomChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

      // Fetch symptom checks from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      let symptomChecksData = [];
      
      if (session) {
        const { data: checks, error: checksError } = await supabase
          .from('symptom_checks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (!checksError && checks) {
          symptomChecksData = checks;
          setSymptomChecks(checks);
        }
      }

      // Combine and format logs
      const logs = [];

      // Add appointments to logs
      appointments.forEach(apt => {
        logs.push({
          id: `apt-${apt.id}`,
          type: 'Appointment',
          category: 'appointment',
          title: apt.doctor_name,
          subtitle: apt.specialization,
          details: apt.reason,
          date: apt.date,
          time: apt.time,
          status: apt.status,
          created_at: apt.created_at,
          icon: 'calendar-check',
          color: 'primary',
          fullData: apt
        });
      });

      // Add medicines to logs
      medicines.forEach(med => {
        logs.push({
          id: `med-${med.id}`,
          type: 'Medicine',
          category: 'medicine',
          title: med.medicine_name,
          subtitle: med.dosage,
          details: `${med.time} - ${med.frequency}`,
          status: med.active ? 'Active' : 'Inactive',
          created_at: med.created_at,
          icon: 'capsule',
          color: 'success',
          fullData: med
        });
      });

      // Add symptom checks to logs
      symptomChecksData.forEach(check => {
        logs.push({
          id: `check-${check.id}`,
          type: 'Health Check',
          category: 'symptom',
          title: check.predicted_disease || 'Symptom Analysis',
          subtitle: check.recommended_specialization || 'General',
          details: check.symptoms || '',
          status: 'Completed',
          created_at: check.created_at,
          icon: 'activity',
          color: 'info',
          fullData: check
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
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
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
        'Completed': 'info',
        'Cancelled': 'danger',
        'Rejected': 'danger',
        'Pending': 'warning'
      };
      return <Badge bg={statusColors[log.status] || 'secondary'}>{log.status}</Badge>;
    } else if (log.type === 'Medicine') {
      return <Badge bg={log.status === 'Active' ? 'success' : 'secondary'}>{log.status}</Badge>;
    } else {
      return <Badge bg="info">{log.status}</Badge>;
    }
  };

  const getFilteredLogs = () => {
    switch (activeTab) {
      case 'appointments':
        return historyLogs.filter(log => log.category === 'appointment');
      case 'medicines':
        return historyLogs.filter(log => log.category === 'medicine');
      case 'symptoms':
        return historyLogs.filter(log => log.category === 'symptom');
      default:
        return historyLogs;
    }
  };

  const getCounts = () => {
    return {
      all: historyLogs.length,
      appointments: historyLogs.filter(log => log.category === 'appointment').length,
      medicines: historyLogs.filter(log => log.category === 'medicine').length,
      symptoms: historyLogs.filter(log => log.category === 'symptom').length
    };
  };

  const handleItemClick = (log) => {
    setSelectedItem(log);
    setShowDetailsModal(true);
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

  const counts = getCounts();
  const filteredLogs = getFilteredLogs();
  const appointmentCount = historyLogs.filter(log => log.type === 'Appointment').length;
  const medicineCount = historyLogs.filter(log => log.type === 'Medicine').length;
  const symptomCheckCount = historyLogs.filter(log => log.type === 'Health Check').length;

  return (
    <div className="user-history-enhanced">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Header Section */}
      <div className="history-header mb-4">
        <h2>
          <i className="bi bi-clock-history me-2"></i>
          Your Health History
        </h2>
        <p className="text-muted">Complete timeline of your health journey</p>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} md={6}>
          <div className="stat-card-history stat-purple">
            <div className="stat-icon">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{appointmentCount}</h3>
              <p className="stat-label">Appointments</p>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6}>
          <div className="stat-card-history stat-green">
            <div className="stat-icon">
              <i className="bi bi-capsule-pill"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{medicineCount}</h3>
              <p className="stat-label">Medicines</p>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6}>
          <div className="stat-card-history stat-blue">
            <div className="stat-icon">
              <i className="bi bi-activity"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{symptomCheckCount}</h3>
              <p className="stat-label">Health Checks</p>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6}>
          <div className="stat-card-history stat-orange">
            <div className="stat-icon">
              <i className="bi bi-graph-up"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{historyLogs.length}</h3>
              <p className="stat-label">Total Records</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Tab Navigation */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Card className="history-main-card">
          <Card.Header className="history-header-tabs">
            <Nav variant="pills" className="history-nav-pills">
              <Nav.Item>
                <Nav.Link eventKey="all" className="nav-pill-history">
                  <i className="bi bi-list-ul me-2"></i>
                  All Activity
                  {counts.all > 0 && <Badge bg="primary" className="ms-2">{counts.all}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="appointments" className="nav-pill-history">
                  <i className="bi bi-calendar-check me-2"></i>
                  Appointments
                  {counts.appointments > 0 && <Badge bg="primary" className="ms-2">{counts.appointments}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="medicines" className="nav-pill-history">
                  <i className="bi bi-capsule me-2"></i>
                  Medicines
                  {counts.medicines > 0 && <Badge bg="success" className="ms-2">{counts.medicines}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="symptoms" className="nav-pill-history">
                  <i className="bi bi-activity me-2"></i>
                  Health Checks
                  {counts.symptoms > 0 && <Badge bg="info" className="ms-2">{counts.symptoms}</Badge>}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body>
            {filteredLogs.length === 0 ? (
              <div className="empty-state-history">
                <i className="bi bi-inbox"></i>
                <h5>No records found</h5>
                <p>Your activity will appear here</p>
              </div>
            ) : (
              <div className="timeline-container">
                {filteredLogs.map((log, index) => (
                  <div 
                    key={log.id} 
                    className="timeline-item"
                    onClick={() => handleItemClick(log)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="timeline-marker" style={{ background: `var(--${log.color}-color)` }}>
                      <i className={`bi bi-${log.icon}`}></i>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div className="timeline-title-section">
                          <Badge bg={log.color} className="me-2">{log.type}</Badge>
                          <h5 className="timeline-title">{log.title}</h5>
                        </div>
                        <div className="timeline-status">
                          {getStatusBadge(log)}
                        </div>
                      </div>
                      
                      <div className="timeline-body">
                        <p className="timeline-subtitle">
                          <i className="bi bi-info-circle me-1"></i>
                          {log.subtitle}
                        </p>
                        <p className="timeline-details">{log.details}</p>
                        
                        {log.date && (
                          <div className="timeline-date-info">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(log.date)}
                            {log.time && <span className="ms-2"><i className="bi bi-clock me-1"></i>{log.time}</span>}
                          </div>
                        )}
                      </div>
                      
                      <div className="timeline-footer">
                        <small className="text-muted">
                          <i className="bi bi-clock-history me-1"></i>
                          {formatDateTime(log.created_at)}
                        </small>
                        <Button variant="link" size="sm" className="view-details-btn">
                          View Details <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Tab.Container>

      {/* Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => {
          setShowDetailsModal(false);
          setSelectedItem(null);
        }}
        centered
        size="lg"
        className="history-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi bi-${selectedItem?.icon} me-2`}></i>
            {selectedItem?.type} Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedItem && (
            <div className="history-details-content">
              {/* Appointment Details */}
              {selectedItem.category === 'appointment' && (
                <>
                  <div className="details-section">
                    <h5 className="section-title">
                      <i className="bi bi-person-badge me-2"></i>
                      Doctor Information
                    </h5>
                    <div className="details-grid">
                      <div className="detail-item">
                        <div className="detail-label">Doctor Name</div>
                        <div className="detail-value">{selectedItem.fullData.doctor_name}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Specialization</div>
                        <div className="detail-value">{selectedItem.fullData.specialization}</div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h5 className="section-title">
                      <i className="bi bi-calendar-check me-2"></i>
                      Appointment Details
                    </h5>
                    <div className="details-grid">
                      <div className="detail-item">
                        <div className="detail-label">Date</div>
                        <div className="detail-value">{formatDate(selectedItem.fullData.date)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Time</div>
                        <div className="detail-value">{selectedItem.fullData.time}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Status</div>
                        <div className="detail-value">{getStatusBadge(selectedItem)}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">Reason</div>
                        <div className="detail-value">{selectedItem.fullData.reason}</div>
                      </div>
                    </div>
                  </div>

                  {(selectedItem.fullData.diagnosis || selectedItem.fullData.prescription) && (
                    <div className="details-section">
                      <h5 className="section-title">
                        <i className="bi bi-clipboard-pulse me-2"></i>
                        Medical Information
                      </h5>
                      {selectedItem.fullData.diagnosis && (
                        <Alert variant="info">
                          <strong>Diagnosis:</strong> {selectedItem.fullData.diagnosis}
                        </Alert>
                      )}
                      {selectedItem.fullData.prescription && (
                        <Alert variant="success">
                          <strong>Prescription:</strong> {selectedItem.fullData.prescription}
                        </Alert>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Medicine Details */}
              {selectedItem.category === 'medicine' && (
                <div className="details-section">
                  <h5 className="section-title">
                    <i className="bi bi-capsule me-2"></i>
                    Medicine Information
                  </h5>
                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="detail-label">Medicine Name</div>
                      <div className="detail-value">{selectedItem.fullData.medicine_name}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Dosage</div>
                      <div className="detail-value">{selectedItem.fullData.dosage}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Time</div>
                      <div className="detail-value">{selectedItem.fullData.time}</div>
                    </div>
                    {selectedItem.fullData.time2 && (
                      <div className="detail-item">
                        <div className="detail-label">Second Time</div>
                        <div className="detail-value">{selectedItem.fullData.time2}</div>
                      </div>
                    )}
                    <div className="detail-item">
                      <div className="detail-label">Frequency</div>
                      <div className="detail-value">{selectedItem.fullData.frequency}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Status</div>
                      <div className="detail-value">{getStatusBadge(selectedItem)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Symptom Check Details */}
              {selectedItem.category === 'symptom' && (
                <>
                  <div className="details-section">
                    <h5 className="section-title">
                      <i className="bi bi-activity me-2"></i>
                      Analysis Results
                    </h5>
                    <div className="details-grid">
                      <div className="detail-item">
                        <div className="detail-label">Predicted Condition</div>
                        <div className="detail-value">{selectedItem.fullData.predicted_disease}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Recommended Specialist</div>
                        <div className="detail-value">
                          <Badge bg="primary">{selectedItem.fullData.recommended_specialization}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h5 className="section-title">
                      <i className="bi bi-list-check me-2"></i>
                      Symptoms Reported
                    </h5>
                    <div className="symptoms-list">
                      {selectedItem.fullData.symptoms && 
                        selectedItem.fullData.symptoms.split(',').map((symptom, idx) => (
                          <Badge key={idx} bg="light" text="dark" className="me-2 mb-2">
                            {symptom.trim()}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                </>
              )}

              {/* Timestamp */}
              <div className="details-section">
                <div className="timestamp-info">
                  <small className="text-muted">
                    <i className="bi bi-clock-history me-1"></i>
                    Created: {formatDateTime(selectedItem.created_at)}
                  </small>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedItem(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserHistoryEnhanced;