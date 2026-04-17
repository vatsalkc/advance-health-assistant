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
import './Appointments.css';

function Appointments({ user, selectedDoctor: preSelectedDoctor, onClearSelection }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
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
      
      // Auto-cancel expired appointments
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

  const autoCancelExpiredAppointments = async () => {
    const today = new Date().toISOString().split('T')[0];
    const expiredAppointments = appointments.filter(apt => {
      return apt.date < today && 
             (apt.status === 'Pending' || apt.status === 'Confirmed') &&
             apt.status !== 'Completed';
    });

    // Auto-cancel expired appointments
    for (const apt of expiredAppointments) {
      try {
        await appointmentsAPI.update(apt.id, { status: 'Cancelled' });
      } catch (err) {
        console.error('Error auto-cancelling appointment:', err);
      }
    }

    // Refresh if any were cancelled
    if (expiredAppointments.length > 0) {
      fetchAppointments();
    }
  };

  const showNotificationToast = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => setShowNotification(false), 5000);
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
      console.log('[Appointments] Creating appointment with data:', {
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

      await appointmentsAPI.create({
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        patient_name: user.name,
        patient_phone: user.phone || 'Not provided',
        specialization: selectedDoctor.specialization,
        doctor_address: selectedDoctor.address || 'Not provided',
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
      console.error('[Appointments] Error message:', err.message);
      console.error('[Appointments] Error details:', err);
      
      let errorMessage = 'Failed to book appointment. ';
      
      if (err.message) {
        if (err.message.includes('patient_name') || err.message.includes('patient_phone')) {
          errorMessage += 'Database columns missing. Please run the FIX_ALL_ISSUES.sql script in Supabase.';
        } else if (err.message.includes('RLS') || err.message.includes('policy')) {
          errorMessage += 'Permission denied. Please check RLS policies in Supabase.';
        } else if (err.message.includes('auth')) {
          errorMessage += 'Authentication error. Please logout and login again.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += 'Please check the COMPLETE_FIX_GUIDE.md file for solutions.';
      }
      
      alert(errorMessage);
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

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsModal(true);
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

  const handleMarkAttended = async (appointmentId) => {
    if (!window.confirm('Mark this appointment as attended? This will update the status to Completed.')) {
      return;
    }

    try {
      await appointmentsAPI.update(appointmentId, { 
        status: 'Completed'
      });
      
      showNotificationToast('Appointment marked as completed successfully!', 'success');
      fetchAppointments();
    } catch (err) {
      console.error('Error marking appointment as attended:', err);
      alert('Failed to mark appointment as attended');
    }
  };

  const getSpecializations = () => [
    ...new Set(doctors.map((d) => d.specialization))
  ];

  const filteredDoctors = doctors
    .filter((d) => {
      // Filter by specialization
      const matchesCategory = activeCategory === 'all' || d.specialization === activeCategory;
      
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.qualification && d.qualification.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.license_number && d.license_number.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="appointments-page">
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
          className="appointment-success-alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Appointment booked successfully!
        </Alert>
      )}

      <Row className="g-4">
        {/* Doctors Section */}
        <Col lg={8} md={12}>
          <Card className="appointments-doctors-card">
            <Card.Body>
              <div className="appointments-section-header">
                <div>
                  <h3>Available Doctors</h3>
                  <p className="text-muted">
                    Browse by specialization and book an appointment
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="doctor-search-bar">
                <div className="search-input-wrapper">
                  <i className="bi bi-search search-icon"></i>
                  <Form.Control
                    type="text"
                    placeholder="Search doctors by name, specialization, qualification, or license..."
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
                {searchQuery && (
                  <p className="search-results-text">
                    Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="specialization-filter">
                <h6>Filter by Specialization</h6>
                <div className="specialization-pills">
                  <button
                    className={`specialization-pill ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    All Doctors
                  </button>
                  {getSpecializations().map((spec) => (
                    <button
                      key={spec}
                      className={`specialization-pill ${activeCategory === spec ? 'active' : ''}`}
                      onClick={() => setActiveCategory(spec)}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="appointments-loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading doctors...</span>
                  </div>
                  <p className="mt-3">Loading doctors...</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="appointments-empty-state">
                  <i className="bi bi-person-x"></i>
                  <h5>No doctors found</h5>
                  <p>Please check your connection or try again later.</p>
                  <Button variant="outline-primary" onClick={fetchDoctors}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Retry Loading
                  </Button>
                </div>
              ) : (
                <div className="doctors-grid">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="doctor-card-modern">
                      <div className="doctor-card-top">
                        <div className="doctor-avatar-large">
                          {doctor.name.charAt(0)}
                        </div>
                        <div className="doctor-card-info">
                          <h5 className="doctor-name">{doctor.name}</h5>
                          <span className="doctor-spec-badge">{doctor.specialization}</span>
                          {doctor.is_verified && (
                            <span className="doctor-verified-badge">
                              <i className="bi bi-patch-check-fill"></i> Verified
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="doctor-card-details">
                        <div className="doctor-detail-row">
                          <i className="bi bi-star-fill"></i>
                          <span className="doctor-rating-stars">{doctor.rating}</span>
                        </div>
                        <div className="doctor-detail-row">
                          <i className="bi bi-briefcase"></i>
                          <span>{doctor.experience}</span>
                        </div>
                        <div className="doctor-detail-row">
                          <i className="bi bi-mortarboard"></i>
                          <span>{doctor.qualification}</span>
                        </div>
                        <div className="doctor-detail-row">
                          <i className="bi bi-card-text"></i>
                          <span className="doctor-license">License: {doctor.license_number}</span>
                        </div>
                        {doctor.phone && doctor.phone !== 'Not specified' && (
                          <div className="doctor-detail-row">
                            <i className="bi bi-telephone"></i>
                            <span>{doctor.phone}</span>
                          </div>
                        )}
                        <div className="doctor-detail-row">
                          <i className="bi bi-clock"></i>
                          <span className="doctor-availability-badge available">
                            <i className="bi bi-circle-fill"></i>
                            Available
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        className="book-btn-modern"
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        <i className="bi bi-calendar-plus me-2"></i>
                        Book Appointment
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Appointments Section */}
        <Col lg={4} md={12}>
          <Card className="your-appointments-section">
            <Card.Body>
              <div className="appointments-header">
                <h3>Your Appointments</h3>
                <span className="appointments-count">{appointments.length}</span>
              </div>
              
              {appointments.length === 0 ? (
                <div className="appointments-empty-state">
                  <i className="bi bi-calendar-x"></i>
                  <h5>No appointments yet</h5>
                  <p>Book your first appointment with a doctor</p>
                </div>
              ) : (
                <div className="appointments-list">
                  {appointments.map((a) => {
                    const isExpired = new Date(a.date) < new Date(new Date().toISOString().split('T')[0]) && 
                                     (a.status === 'Pending' || a.status === 'Confirmed');
                    const isToday = a.date === new Date().toISOString().split('T')[0];
                    const canMarkAttended = isToday && a.status === 'Confirmed';
                    
                    return (
                      <div 
                        key={a.id} 
                        className={`appointment-card clickable-appointment-card ${isExpired ? 'expired-appointment' : ''} ${isToday ? 'today-appointment' : ''}`}
                        onClick={() => handleAppointmentClick(a)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="appointment-card-header">
                          <div className="appointment-doctor-info">
                            <h5>{a.doctor_name}</h5>
                            <span className="appointment-spec">{a.specialization}</span>
                          </div>
                          <div className="appointment-status-badges">
                            {isToday && a.status !== 'Completed' && (
                              <Badge bg="primary" className="me-2">
                                <i className="bi bi-calendar-day me-1"></i>
                                Today
                              </Badge>
                            )}
                            {isExpired && (
                              <Badge bg="secondary" className="me-2">
                                <i className="bi bi-clock-history me-1"></i>
                                Expired
                              </Badge>
                            )}
                            <span className={`appointment-status ${a.status.toLowerCase()}`}>
                              {a.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="appointment-card-body">
                          <div className="appointment-info-item">
                            <i className="bi bi-calendar3"></i>
                            <span>{a.date}</span>
                          </div>
                          <div className="appointment-info-item">
                            <i className="bi bi-clock"></i>
                            <span>{a.time}</span>
                          </div>
                          <div className="appointment-info-item">
                            <i className="bi bi-file-text"></i>
                            <span>{a.reason}</span>
                          </div>
                          {a.doctor_address && a.doctor_address !== 'Not provided' && (
                            <div className="appointment-info-item">
                              <i className="bi bi-geo-alt-fill"></i>
                              <span>{a.doctor_address}</span>
                            </div>
                          )}
                        </div>
                        
                        {a.status === 'Rejected' && a.rejected_reason && (
                          <div className="appointment-alert danger">
                            <i className="bi bi-x-circle"></i>
                            <div>
                              <strong>Rejection Reason:</strong>
                              <p>{a.rejected_reason}</p>
                            </div>
                          </div>
                        )}
                        
                        {a.diagnosis && (
                          <div className="appointment-alert info">
                            <i className="bi bi-clipboard-pulse"></i>
                            <div>
                              <strong>Diagnosis:</strong>
                              <p>{a.diagnosis}</p>
                            </div>
                          </div>
                        )}
                        
                        {a.prescription && (
                          <div className="appointment-alert success">
                            <i className="bi bi-prescription2"></i>
                            <div>
                              <strong>Prescription:</strong>
                              <p>{a.prescription}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        {canMarkAttended && (
                          <div className="appointment-card-footer" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleMarkAttended(a.id)}
                              className="w-100"
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Mark as Attended
                            </Button>
                          </div>
                        )}
                        
                        {!isExpired && !canMarkAttended && a.status !== 'Rejected' && a.status !== 'Completed' && a.status !== 'Cancelled' && (
                          <div className="appointment-card-footer" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleModifyClick(a)}
                              className="me-2"
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Modify
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelClick(a)}
                            >
                              <i className="bi bi-x-lg me-1"></i>
                              Cancel
                            </Button>
                          </div>
                        )}
                        
                        {a.status === 'Cancelled' && (
                          <div className="appointment-alert danger">
                            <i className="bi bi-x-octagon"></i>
                            <div>
                              <strong>Appointment Cancelled</strong>
                              <p>This appointment has been cancelled by the doctor.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
                {selectedDoctor.address && (
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {selectedDoctor.address}
                    </small>
                  </div>
                )}
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
        size="md"
        className="appointment-details-modal-compact"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-calendar-event me-2"></i>
            Appointment Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
          {selectedAppointment && (
            <div className="appointment-details-compact">
              {/* Doctor Info - Compact */}
              <div className="doctor-info-compact mb-3">
                <div className="doctor-avatar-compact">
                  {selectedAppointment.doctor_name.charAt(0)}
                </div>
                <div className="doctor-text">
                  <h5 className="mb-1">{selectedAppointment.doctor_name}</h5>
                  <Badge bg="primary">{selectedAppointment.specialization}</Badge>
                </div>
              </div>

              {/* Appointment Info - Grid */}
              <div className="appointment-info-grid mb-3">
                <div className="info-box">
                  <div className="info-icon">
                    <i className="bi bi-calendar3"></i>
                  </div>
                  <div>
                    <small className="text-muted d-block">Date</small>
                    <strong>{new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</strong>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div>
                    <small className="text-muted d-block">Time</small>
                    <strong>{selectedAppointment.time}</strong>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <small className="text-muted d-block">Status</small>
                    <Badge 
                      bg={
                        selectedAppointment.status === 'Confirmed' ? 'success' :
                        selectedAppointment.status === 'Pending' ? 'warning' :
                        selectedAppointment.status === 'Completed' ? 'info' :
                        'danger'
                      }
                    >
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="reason-box mb-3">
                <small className="text-muted d-block mb-1">
                  <i className="bi bi-file-text me-1"></i>
                  Reason for Visit
                </small>
                <p className="mb-0">{selectedAppointment.reason}</p>
              </div>

              {/* Address */}
              {selectedAppointment.doctor_address && selectedAppointment.doctor_address !== 'Not provided' && (
                <div className="reason-box mb-3">
                  <small className="text-muted d-block mb-1">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    Clinic/Hospital Address
                  </small>
                  <p className="mb-0">{selectedAppointment.doctor_address}</p>
                </div>
              )}

              {/* Medical Info - Only if exists */}
              {selectedAppointment.diagnosis && (
                <Alert variant="info" className="py-2 mb-2">
                  <small><strong>Diagnosis:</strong> {selectedAppointment.diagnosis}</small>
                </Alert>
              )}
              
              {selectedAppointment.prescription && (
                <Alert variant="success" className="py-2 mb-2">
                  <small><strong>Prescription:</strong> {selectedAppointment.prescription}</small>
                </Alert>
              )}

              {/* Rejection Reason - Only if rejected */}
              {selectedAppointment.status === 'Rejected' && selectedAppointment.rejected_reason && (
                <Alert variant="danger" className="py-2 mb-0">
                  <small><strong>Rejection:</strong> {selectedAppointment.rejected_reason}</small>
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          {selectedAppointment && (
            <>
              {/* Mark as Attended - Only for today's confirmed appointments */}
              {selectedAppointment.date === new Date().toISOString().split('T')[0] && 
               selectedAppointment.status === 'Confirmed' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setShowAppointmentDetailsModal(false);
                    handleMarkAttended(selectedAppointment.id);
                  }}
                  className="me-auto"
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Mark as Attended
                </Button>
              )}
              
              {/* Modify/Cancel - Only for future appointments that are not rejected/completed/cancelled */}
              {selectedAppointment.status !== 'Rejected' && 
               selectedAppointment.status !== 'Completed' && 
               selectedAppointment.status !== 'Cancelled' &&
               new Date(selectedAppointment.date) >= new Date(new Date().toISOString().split('T')[0]) &&
               !(selectedAppointment.date === new Date().toISOString().split('T')[0] && selectedAppointment.status === 'Confirmed') && (
                <>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setShowAppointmentDetailsModal(false);
                      handleModifyClick(selectedAppointment);
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Modify
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setShowAppointmentDetailsModal(false);
                      handleCancelClick(selectedAppointment);
                    }}
                  >
                    <i className="bi bi-x-lg me-1"></i>
                    Cancel
                  </Button>
                </>
              )}
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
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

export default Appointments;
