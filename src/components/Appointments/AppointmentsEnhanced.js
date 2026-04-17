import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Badge,
  Alert,
  Nav,
  Tab,
  Modal,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { appointmentsAPI, doctorsAPI } from '../../utils/api';
import authService from '../../services/authService';

// AppointmentsList Component
function AppointmentsList({ 
  appointments, 
  onModify, 
  onCancel, 
  onMarkStatus, 
  onAppointmentClick,
  showBookDoctors = false,
  doctors = [],
  onBookAppointment,
  searchQuery = '',
  setSearchQuery,
  loading = false,
  fetchDoctors,
  emptyMessage = "No appointments found",
  emptyIcon = "calendar-x",
  hideActions = false
}) {
  const today = new Date().toISOString().split('T')[0];

  if (showBookDoctors) {
    return (
      <div>
        {/* Doctor Search Section */}
        <div className="doctor-search-section mb-4">
          <h4>Book New Appointment</h4>
          <div className="doctor-search-bar">
            <div className="search-input-wrapper">
              <i className="bi bi-search search-icon"></i>
              <Form.Control
                type="text"
                placeholder="Search doctors by name, specialization, qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading doctors...</span>
              </div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-person-x"></i>
              <h5>No doctors found</h5>
              <Button variant="outline-primary" onClick={fetchDoctors}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Retry Loading
              </Button>
            </div>
          ) : (
            <Row className="g-3">
              {doctors.slice(0, 6).map((doctor) => (
                <Col lg={4} md={6} key={doctor.id}>
                  <div className="doctor-card-compact">
                    <div className="doctor-info">
                      <div className="doctor-avatar-small">
                        {doctor.name.charAt(0)}
                      </div>
                      <div>
                        <h6 className="mb-1">{doctor.name}</h6>
                        <Badge bg="primary" className="mb-2">{doctor.specialization}</Badge>
                        <div className="doctor-rating">
                          <i className="bi bi-star-fill text-warning"></i>
                          <span className="ms-1">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => onBookAppointment(doctor)}
                    >
                      <i className="bi bi-calendar-plus me-1"></i>
                      Book
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>

        <hr className="my-4" />
        
        {/* Appointments List */}
        <h4>Your Appointments</h4>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="empty-state">
        <i className={`bi bi-${emptyIcon}`}></i>
        <h5>{emptyMessage}</h5>
        <p>Your appointments will appear here</p>
      </div>
    );
  }

  return (
    <div className="appointments-list-enhanced">
      {appointments.map((appointment) => {
        const isToday = appointment.date === today;
        const isPast = new Date(appointment.date) < new Date(today);
        
        return (
          <div 
            key={appointment.id} 
            className={`appointment-card-enhanced ${isToday ? 'today' : ''} ${!hideActions ? 'clickable' : ''}`}
            onClick={() => !hideActions && onAppointmentClick && onAppointmentClick(appointment)}
            role={!hideActions ? "button" : undefined}
            tabIndex={!hideActions ? 0 : undefined}
          >
            <div className="appointment-header">
              <div className="appointment-doctor-section">
                <div className="doctor-avatar-appointment">
                  {appointment.doctor_name.charAt(0)}
                </div>
                <div className="appointment-details">
                  <h5 className="doctor-name">{appointment.doctor_name}</h5>
                  <Badge bg="secondary" className="specialization-badge">
                    {appointment.specialization}
                  </Badge>
                </div>
              </div>
              
              <div className="appointment-status-section">
                <Badge 
                  bg={
                    appointment.status === 'Confirmed' ? 'success' :
                    appointment.status === 'Pending' ? 'warning' :
                    appointment.status === 'Completed' ? 'info' :
                    'danger'
                  }
                  className="status-badge"
                >
                  {appointment.status}
                </Badge>
                {isToday && (
                  <Badge bg="primary" className="ms-2">
                    <i className="bi bi-calendar-day me-1"></i>
                    Today
                  </Badge>
                )}
              </div>
            </div>

            <div className="appointment-body">
              <Row>
                <Col md={6}>
                  <div className="appointment-info-grid">
                    <div className="info-item">
                      <i className="bi bi-calendar3"></i>
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <i className="bi bi-clock"></i>
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="appointment-reason">
                    <i className="bi bi-file-text me-2"></i>
                    <span>{appointment.reason}</span>
                  </div>
                </Col>
              </Row>

              {/* Additional Information */}
              {appointment.status === 'Rejected' && appointment.rejected_reason && (
                <Alert variant="danger" className="mt-3 mb-0">
                  <i className="bi bi-x-circle me-2"></i>
                  <strong>Rejection Reason:</strong> {appointment.rejected_reason}
                </Alert>
              )}
              
              {appointment.diagnosis && (
                <Alert variant="info" className="mt-3 mb-0">
                  <i className="bi bi-clipboard-pulse me-2"></i>
                  <strong>Diagnosis:</strong> {appointment.diagnosis}
                </Alert>
              )}
              
              {appointment.prescription && (
                <Alert variant="success" className="mt-3 mb-0">
                  <i className="bi bi-prescription2 me-2"></i>
                  <strong>Prescription:</strong> {appointment.prescription}
                </Alert>
              )}
            </div>

            {!hideActions && (
              <div className="appointment-actions" onClick={(e) => e.stopPropagation()}>
                {/* Status Actions for Today's Appointments */}
                {isToday && appointment.status === 'Confirmed' && (
                  <div className="status-actions me-3">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onMarkStatus(appointment.id, 'Completed')}
                      className="me-2"
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      Mark Completed
                    </Button>
                  </div>
                )}

                {/* Regular Actions */}
                {appointment.status !== 'Rejected' && appointment.status !== 'Completed' && !isPast && (
                  <div className="regular-actions">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onModify(appointment)}
                      className="me-2"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Modify
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onCancel(appointment)}
                    >
                      <i className="bi bi-x-lg me-1"></i>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
// Main Appointments Component
function AppointmentsEnhanced({ user, selectedDoctor: preSelectedDoctor, onClearSelection }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchAppointments();
      
      // Check for appointments today
      checkTodayAppointments();
      
      // Auto-cancel expired pending appointments
      autoCancelExpiredAppointments();
      
      // Set up interval to check appointments every minute
      const interval = setInterval(() => {
        checkTodayAppointments();
        autoCancelExpiredAppointments();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle pre-selected doctor from symptom checker
  useEffect(() => {
    if (preSelectedDoctor && doctors.length > 0) {
      setSelectedDoctor(preSelectedDoctor);
      setShowBookingModal(true);
      // Clear the selection after opening modal
      if (onClearSelection) {
        onClearSelection();
      }
    }
  }, [preSelectedDoctor, doctors]);

  const checkTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => {
      const aptDate = apt.date;
      return aptDate === today && apt.status === 'Confirmed';
    });

    if (todayAppointments.length > 0) {
      const apt = todayAppointments[0];
      showNotificationToast(
        `Reminder: You have an appointment with ${apt.doctor_name} today at ${apt.time}`,
        'info'
      );
    }
  };

  const showNotificationToast = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => setShowNotification(false), 5000);
  };

  const autoCancelExpiredAppointments = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiredAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return apt.status === 'Pending' && aptDate < today;
    });

    if (expiredAppointments.length > 0) {
      console.log(`[Appointments] Auto-cancelling ${expiredAppointments.length} expired pending appointments`);
      
      for (const apt of expiredAppointments) {
        try {
          await appointmentsAPI.update(apt.id, { status: 'Cancelled' });
        } catch (err) {
          console.error(`Failed to auto-cancel appointment ${apt.id}:`, err);
        }
      }
      
      // Refresh appointments after auto-cancellation
      fetchAppointments();
      
      if (expiredAppointments.length > 0) {
        showNotificationToast(
          `${expiredAppointments.length} expired pending appointment(s) have been automatically cancelled`,
          'info'
        );
      }
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      console.log('Doctors response:', response.data);
      setDoctors(response.data.doctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      const fetchedAppointments = response.data.appointments;
      
      // Check for newly confirmed appointments
      if (appointments.length > 0) {
        fetchedAppointments.forEach(newApt => {
          const oldApt = appointments.find(a => a.id === newApt.id);
          if (oldApt && oldApt.status === 'Pending' && newApt.status === 'Confirmed') {
            showNotificationToast(
              `Your appointment with ${newApt.doctor_name} on ${newApt.date} at ${newApt.time} has been confirmed!`,
              'success'
            );
          }
        });
      }
      
      setAppointments(fetchedAppointments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateDateTime = () => {
    const selectedDate = new Date(formData.date);
    const selectedTime = formData.time;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check if date is in the past
    if (selectedDate < today) {
      alert('Cannot book appointment for a past date');
      return false;
    }
    
    // If booking for today, check if time is in the past
    if (selectedDate.toDateString() === today.toDateString()) {
      const [hours, minutes] = selectedTime.split(':');
      const selectedDateTime = new Date();
      selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      if (selectedDateTime <= now) {
        alert('Cannot book appointment for a past time. Please select a future time.');
        return false;
      }
    }
    
    // Check if date is too far in the future (e.g., more than 3 months)
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    if (selectedDate > threeMonthsFromNow) {
      alert('Cannot book appointments more than 3 months in advance');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date and time
    if (!validateDateTime()) {
      return;
    }

    try {
      await appointmentsAPI.create({
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        patient_name: user.name,
        patient_phone: user.phone || 'Not provided',
        specialization: selectedDoctor.specialization,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: 'Pending'
      });

      setFormData({ date: '', time: '', reason: '' });
      setShowBookingModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      showNotificationToast(
        `Appointment request sent to ${selectedDoctor.name}. You'll be notified once confirmed.`,
        'success'
      );
      
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      console.error('[Appointments] Booking error:', err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await appointmentsAPI.delete(selectedAppointment.id);
      showNotificationToast('Appointment cancelled successfully', 'warning');
      setShowCancelModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel appointment');
    }
  };

  const handleModifyClick = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason
    });
    setShowModifyModal(true);
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();

    try {
      await appointmentsAPI.update(selectedAppointment.id, {
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: 'Pending' // Reset to pending when modified
      });

      setShowModifyModal(false);
      setSelectedAppointment(null);
      setFormData({ date: '', time: '', reason: '' });
      showNotificationToast('Appointment modified successfully. Waiting for doctor confirmation.', 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert('Failed to modify appointment');
    }
  };

  const markAppointmentStatus = async (appointmentId, status) => {
    try {
      await appointmentsAPI.update(appointmentId, { status });
      showNotificationToast(`Appointment marked as ${status.toLowerCase()}`, 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert(`Failed to mark appointment as ${status.toLowerCase()}`);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch = searchQuery === '' || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.qualification && d.qualification.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.license_number && d.license_number.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'today':
        return appointments.filter(apt => apt.date === today);
      case 'upcoming':
        return appointments.filter(apt => new Date(apt.date) > new Date(today));
      case 'completed':
        return appointments.filter(apt => apt.status === 'Completed');
      case 'cancelled':
        return appointments.filter(apt => apt.status === 'Cancelled' || apt.status === 'Rejected');
      default:
        return appointments;
    }
  };

  const getAppointmentCounts = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      all: appointments.length,
      today: appointments.filter(apt => apt.date === today).length,
      upcoming: appointments.filter(apt => new Date(apt.date) > new Date(today)).length,
      completed: appointments.filter(apt => apt.status === 'Completed').length,
      cancelled: appointments.filter(apt => apt.status === 'Cancelled' || apt.status === 'Rejected').length
    };
  };

  const counts = getAppointmentCounts();
  const filteredAppointments = getFilteredAppointments();

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsModal(true);
  };

  return (
    <div className="appointments-page-enhanced">
      {/* Notification Toast */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={showNotification} 
          onClose={() => setShowNotification(false)}
          bg={notificationType}
          autohide
          delay={5000}
        >
          <Toast.Header>
            <i className={`bi bi-${notificationType === 'success' ? 'check-circle' : notificationType === 'info' ? 'info-circle' : 'exclamation-triangle'} me-2`}></i>
            <strong className="me-auto">
              {notificationType === 'success' ? 'Success' : notificationType === 'info' ? 'Reminder' : 'Notice'}
            </strong>
          </Toast.Header>
          <Toast.Body className={notificationType === 'info' ? 'text-white' : ''}>
            {notificationMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {showSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccess(false)}
          className="appointment-success-alert mb-4"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Appointment booked successfully!
        </Alert>
      )}

      {/* Enhanced Tab Navigation */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Card className="appointments-main-card">
          <Card.Header className="appointments-header-enhanced">
            <div className="appointments-title-section">
              <h2>
                <i className="bi bi-calendar-check me-2"></i>
                Appointments
              </h2>
              <p className="text-muted mb-0">Manage your medical appointments</p>
            </div>
            
            <Nav variant="pills" className="appointments-nav-pills">
              <Nav.Item>
                <Nav.Link eventKey="all" className="nav-pill-custom">
                  <i className="bi bi-list-ul me-2"></i>
                  All
                  {counts.all > 0 && <Badge bg="primary" className="ms-2">{counts.all}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="today" className="nav-pill-custom">
                  <i className="bi bi-calendar-day me-2"></i>
                  Today
                  {counts.today > 0 && <Badge bg="success" className="ms-2">{counts.today}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="upcoming" className="nav-pill-custom">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Upcoming
                  {counts.upcoming > 0 && <Badge bg="info" className="ms-2">{counts.upcoming}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="completed" className="nav-pill-custom">
                  <i className="bi bi-check-circle me-2"></i>
                  Completed
                  {counts.completed > 0 && <Badge bg="success" className="ms-2">{counts.completed}</Badge>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cancelled" className="nav-pill-custom">
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelled
                  {counts.cancelled > 0 && <Badge bg="danger" className="ms-2">{counts.cancelled}</Badge>}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Tab.Content>
            <Tab.Pane eventKey="all">
              <Card.Body>
                <AppointmentsList 
                  appointments={filteredAppointments}
                  onModify={handleModifyClick}
                  onCancel={handleCancelClick}
                  onMarkStatus={markAppointmentStatus}
                  onAppointmentClick={handleAppointmentClick}
                  showBookDoctors={true}
                  doctors={filteredDoctors}
                  onBookAppointment={handleBookAppointment}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  loading={loading}
                  fetchDoctors={fetchDoctors}
                />
              </Card.Body>
            </Tab.Pane>
            
            <Tab.Pane eventKey="today">
              <Card.Body>
                <div className="tab-header mb-4">
                  <h4>Today's Appointments</h4>
                  <p className="text-muted">Appointments scheduled for today</p>
                </div>
                <AppointmentsList 
                  appointments={filteredAppointments}
                  onModify={handleModifyClick}
                  onCancel={handleCancelClick}
                  onMarkStatus={markAppointmentStatus}
                  onAppointmentClick={handleAppointmentClick}
                  showBookDoctors={false}
                  emptyMessage="No appointments scheduled for today"
                  emptyIcon="calendar-day"
                />
              </Card.Body>
            </Tab.Pane>
            
            <Tab.Pane eventKey="upcoming">
              <Card.Body>
                <div className="tab-header mb-4">
                  <h4>Upcoming Appointments</h4>
                  <p className="text-muted">Future appointments</p>
                </div>
                <AppointmentsList 
                  appointments={filteredAppointments}
                  onModify={handleModifyClick}
                  onCancel={handleCancelClick}
                  onMarkStatus={markAppointmentStatus}
                  onAppointmentClick={handleAppointmentClick}
                  showBookDoctors={false}
                  emptyMessage="No upcoming appointments"
                  emptyIcon="calendar-plus"
                />
              </Card.Body>
            </Tab.Pane>
            
            <Tab.Pane eventKey="completed">
              <Card.Body>
                <div className="tab-header mb-4">
                  <h4>Completed Appointments</h4>
                  <p className="text-muted">Your appointment history</p>
                </div>
                <AppointmentsList 
                  appointments={filteredAppointments}
                  onModify={handleModifyClick}
                  onCancel={handleCancelClick}
                  onMarkStatus={markAppointmentStatus}
                  onAppointmentClick={handleAppointmentClick}
                  showBookDoctors={false}
                  emptyMessage="No completed appointments"
                  emptyIcon="check-circle"
                  hideActions={true}
                />
              </Card.Body>
            </Tab.Pane>
            
            <Tab.Pane eventKey="cancelled">
              <Card.Body>
                <div className="tab-header mb-4">
                  <h4>Cancelled Appointments</h4>
                  <p className="text-muted">Cancelled or rejected appointments</p>
                </div>
                <AppointmentsList 
                  appointments={filteredAppointments}
                  onModify={handleModifyClick}
                  onCancel={handleCancelClick}
                  onMarkStatus={markAppointmentStatus}
                  onAppointmentClick={handleAppointmentClick}
                  showBookDoctors={false}
                  emptyMessage="No cancelled appointments"
                  emptyIcon="x-circle"
                  hideActions={true}
                />
              </Card.Body>
            </Tab.Pane>
          </Tab.Content>
        </Card>
      </Tab.Container>
      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        centered
        className="appointment-booking-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-plus me-2"></i>
            Book Appointment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedDoctor && (
            <div className="selected-doctor-info">
              <div className="doctor-avatar-modal">
                {selectedDoctor.name.charAt(0)}
              </div>
              <div>
                <h5>{selectedDoctor.name}</h5>
                <Badge bg="primary">{selectedDoctor.specialization}</Badge>
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-calendar3 me-2"></i>
                Date
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-clock me-2"></i>
                Time
              </Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-file-text me-2"></i>
                Reason for Visit
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for consultation..."
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowBookingModal(false)}
                className="flex-fill"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-fill">
                <i className="bi bi-check-lg me-2"></i>
                Confirm Booking
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modify Appointment Modal */}
      <Modal
        show={showModifyModal}
        onHide={() => {
          setShowModifyModal(false);
          setSelectedAppointment(null);
          setFormData({ date: '', time: '', reason: '' });
        }}
        centered
        className="appointment-booking-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Modify Appointment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedAppointment && (
            <div className="selected-doctor-info mb-3">
              <div className="doctor-avatar-modal">
                {selectedAppointment.doctor_name.charAt(0)}
              </div>
              <div>
                <h5>{selectedAppointment.doctor_name}</h5>
                <Badge bg="primary">{selectedAppointment.specialization}</Badge>
              </div>
            </div>
          )}

          <Alert variant="info" className="mb-3">
            <i className="bi bi-info-circle me-2"></i>
            Modifying this appointment will reset its status to "Pending" and require doctor confirmation again.
          </Alert>

          <Form onSubmit={handleModifySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-calendar3 me-2"></i>
                Date
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-clock me-2"></i>
                Time
              </Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-file-text me-2"></i>
                Reason for Visit
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for consultation..."
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowModifyModal(false);
                  setSelectedAppointment(null);
                  setFormData({ date: '', time: '', reason: '' });
                }}
                className="flex-fill"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-fill">
                <i className="bi bi-check-lg me-2"></i>
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => {
          setShowCancelModal(false);
          setSelectedAppointment(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
            Confirm Cancellation
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>Are you sure you want to cancel this appointment?</p>
              <div className="appointment-details-box p-3 rounded">
                <div className="mb-2">
                  <strong>Doctor:</strong> {selectedAppointment.doctor_name}
                </div>
                <div className="mb-2">
                  <strong>Specialization:</strong> {selectedAppointment.specialization}
                </div>
                <div className="mb-2">
                  <strong>Date:</strong> {selectedAppointment.date}
                </div>
                <div className="mb-2">
                  <strong>Time:</strong> {selectedAppointment.time}
                </div>
                <div>
                  <strong>Reason:</strong> {selectedAppointment.reason}
                </div>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                This action cannot be undone. You'll need to book a new appointment if you change your mind.
              </Alert>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowCancelModal(false);
              setSelectedAppointment(null);
            }}
          >
            Keep Appointment
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            <i className="bi bi-x-lg me-2"></i>
            Yes, Cancel Appointment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        show={showAppointmentDetailsModal}
        onHide={() => {
          setShowAppointmentDetailsModal(false);
          setSelectedAppointment(null);
        }}
        centered
        size="lg"
        className="appointment-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-event me-2"></i>
            Appointment Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedAppointment && (
            <div className="appointment-details-content">
              {/* Doctor Information */}
              <div className="details-section">
                <h5 className="section-title">
                  <i className="bi bi-person-badge me-2"></i>
                  Doctor Information
                </h5>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="doctor-avatar-large">
                      {selectedAppointment.doctor_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="mb-1">{selectedAppointment.doctor_name}</h4>
                      <Badge bg="primary" className="mb-2">{selectedAppointment.specialization}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="details-section">
                <h5 className="section-title">
                  <i className="bi bi-calendar-check me-2"></i>
                  Appointment Information
                </h5>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="bi bi-calendar3"></i>
                      Date
                    </div>
                    <div className="detail-value">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="bi bi-clock"></i>
                      Time
                    </div>
                    <div className="detail-value">{selectedAppointment.time}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="bi bi-info-circle"></i>
                      Status
                    </div>
                    <div className="detail-value">
                      <Badge 
                        bg={
                          selectedAppointment.status === 'Confirmed' ? 'success' :
                          selectedAppointment.status === 'Pending' ? 'warning' :
                          selectedAppointment.status === 'Completed' ? 'info' :
                          'danger'
                        }
                        className="status-badge-large"
                      >
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="detail-item full-width">
                    <div className="detail-label">
                      <i className="bi bi-file-text"></i>
                      Reason for Visit
                    </div>
                    <div className="detail-value">{selectedAppointment.reason}</div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              {selectedAppointment.patient_name && (
                <div className="details-section">
                  <h5 className="section-title">
                    <i className="bi bi-person me-2"></i>
                    Patient Information
                  </h5>
                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="detail-label">
                        <i className="bi bi-person"></i>
                        Name
                      </div>
                      <div className="detail-value">{selectedAppointment.patient_name}</div>
                    </div>
                    
                    {selectedAppointment.patient_phone && (
                      <div className="detail-item">
                        <div className="detail-label">
                          <i className="bi bi-telephone"></i>
                          Phone
                        </div>
                        <div className="detail-value">{selectedAppointment.patient_phone}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medical Information */}
              {(selectedAppointment.diagnosis || selectedAppointment.prescription) && (
                <div className="details-section">
                  <h5 className="section-title">
                    <i className="bi bi-clipboard-pulse me-2"></i>
                    Medical Information
                  </h5>
                  
                  {selectedAppointment.diagnosis && (
                    <Alert variant="info" className="mb-3">
                      <div className="alert-title">
                        <i className="bi bi-clipboard-pulse me-2"></i>
                        <strong>Diagnosis</strong>
                      </div>
                      <p className="mb-0 mt-2">{selectedAppointment.diagnosis}</p>
                    </Alert>
                  )}
                  
                  {selectedAppointment.prescription && (
                    <Alert variant="success" className="mb-0">
                      <div className="alert-title">
                        <i className="bi bi-prescription2 me-2"></i>
                        <strong>Prescription</strong>
                      </div>
                      <p className="mb-0 mt-2">{selectedAppointment.prescription}</p>
                    </Alert>
                  )}
                </div>
              )}

              {/* Rejection Reason */}
              {selectedAppointment.status === 'Rejected' && selectedAppointment.rejected_reason && (
                <div className="details-section">
                  <Alert variant="danger" className="mb-0">
                    <div className="alert-title">
                      <i className="bi bi-x-circle me-2"></i>
                      <strong>Rejection Reason</strong>
                    </div>
                    <p className="mb-0 mt-2">{selectedAppointment.rejected_reason}</p>
                  </Alert>
                </div>
              )}

              {/* Timestamps */}
              <div className="details-section">
                <div className="timestamp-info">
                  <small className="text-muted">
                    <i className="bi bi-clock-history me-1"></i>
                    Created: {new Date(selectedAppointment.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {selectedAppointment && selectedAppointment.status !== 'Rejected' && 
           selectedAppointment.status !== 'Completed' && 
           new Date(selectedAppointment.date) >= new Date(new Date().toISOString().split('T')[0]) && (
            <>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShowAppointmentDetailsModal(false);
                  handleModifyClick(selectedAppointment);
                }}
              >
                <i className="bi bi-pencil me-2"></i>
                Modify Appointment
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => {
                  setShowAppointmentDetailsModal(false);
                  handleCancelClick(selectedAppointment);
                }}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancel Appointment
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              setShowAppointmentDetailsModal(false);
              setSelectedAppointment(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AppointmentsEnhanced;