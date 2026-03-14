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
import OTPVerification from './OTPVerification';

function Appointments({ user, selectedDoctor: preSelectedDoctor, onClearSelection }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
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
  const [pendingBookingData, setPendingBookingData] = useState(null);

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
      
      // Set up interval to check appointments every minute
      const interval = setInterval(checkTodayAppointments, 60000);
      
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

    // Check if user has phone number
    if (!user.phone) {
      alert('Please add your phone number in your profile before booking an appointment');
      return;
    }

    // Store booking data and show OTP modal
    setPendingBookingData({
      doctor_id: selectedDoctor.id,
      doctor_name: selectedDoctor.name,
      patient_name: user.name, // Include patient name
      patient_phone: user.phone, // Include patient phone
      specialization: selectedDoctor.specialization,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'Pending'
    });
    
    setShowBookingModal(false);
    setShowOTPModal(true);
  };

  const handleOTPVerified = async (verified) => {
    if (verified && pendingBookingData) {
      try {
        await appointmentsAPI.create(pendingBookingData);

        setFormData({ date: '', time: '', reason: '' });
        setShowOTPModal(false);
        setPendingBookingData(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        showNotificationToast(
          `Appointment request sent to ${selectedDoctor.name}. You'll be notified once confirmed.`,
          'success'
        );
        
        // Refresh appointments
        fetchAppointments();
      } catch (err) {
        console.error(err);
        alert('Failed to book appointment');
        setShowOTPModal(false);
      }
    }
  };
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
      console.error(err);
      alert('Failed to book appointment');
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
                  {appointments.map((a) => (
                    <div key={a.id} className="appointment-card">
                      <div className="appointment-card-header">
                        <div className="appointment-doctor-info">
                          <h5>{a.doctor_name}</h5>
                          <span className="appointment-spec">{a.specialization}</span>
                        </div>
                        <span className={`appointment-status ${a.status.toLowerCase()}`}>
                          {a.status}
                        </span>
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
                      
                      {a.status !== 'Rejected' && a.status !== 'Completed' && (
                        <div className="appointment-card-footer">
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
                    </div>
                  ))}
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
              <div className="appointment-details-box p-3 bg-light rounded">
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

      {/* OTP Verification Modal */}
      <OTPVerification
        show={showOTPModal}
        onHide={() => {
          setShowOTPModal(false);
          setPendingBookingData(null);
          setShowBookingModal(true); // Reopen booking modal if OTP is cancelled
        }}
        phoneNumber={user?.phone}
        onVerify={handleOTPVerified}
      />
    </div>
  );
}

export default Appointments;
