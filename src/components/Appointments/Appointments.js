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
  Modal
} from 'react-bootstrap';
import { appointmentsAPI, doctorsAPI } from '../../utils/api';
import authService from '../../services/authService';

function Appointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchAppointments();
    }
  }, [user]);

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
      setAppointments(response.data.appointments);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await appointmentsAPI.create({
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
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
      
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      await appointmentsAPI.delete(id);
      fetchAppointments(); // Refresh appointments
    } catch (err) {
      console.error(err);
      alert('Failed to cancel appointment');
    }
  };

  const getSpecializations = () => [
    ...new Set(doctors.map((d) => d.specialization))
  ];

  const filteredDoctors =
    activeCategory === 'all'
      ? doctors
      : doctors.filter((d) => d.specialization === activeCategory);

  return (
    <div>
      {showSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccess(false)}
        >
          Appointment booked successfully!
        </Alert>
      )}

      <Row>
        {/* Doctors Section */}
        <Col lg={8} md={12} className="mb-4">
          <Card className="mb-4">
            <Card.Body>
              <h4>Available Doctors</h4>
              <p className="text-muted">
                Browse by specialization and book an appointment
              </p>

              <Tab.Container
                activeKey={activeCategory}
                onSelect={(k) => setActiveCategory(k)}
              >
                <Nav variant="pills" className="mb-3 flex-wrap">
                  <Nav.Item>
                    <Nav.Link eventKey="all">All</Nav.Link>
                  </Nav.Item>
                  {getSpecializations().map((spec) => (
                    <Nav.Item key={spec}>
                      <Nav.Link eventKey={spec}>{spec}</Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading doctors...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading doctors...</p>
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No doctors found. Please check your connection.</p>
                    <Button variant="outline-primary" onClick={fetchDoctors}>
                      Retry Loading Doctors
                    </Button>
                  </div>
                ) : (
                  <Row>
                    {filteredDoctors.map((doctor) => (
                      <Col lg={6} md={6} sm={12} key={doctor.id} className="mb-3">
                        <Card className="h-100">
                          <Card.Body>
                            <h5>{doctor.name}</h5>
                            <Badge bg="primary" className="mb-2">
                              {doctor.specialization}
                            </Badge>
                            <p className="text-muted">
                              ⭐ {doctor.rating} | {doctor.experience}
                            </p>

                            <div className="d-flex justify-content-between">
                              <Badge bg="success">
                                Available
                              </Badge>

                              <Button
                                size="sm"
                                onClick={() =>
                                  handleBookAppointment(doctor)
                                }
                              >
                                Book
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>

        {/* Appointments Section */}
        <Col lg={4} md={12}>
          <Card>
            <Card.Body>
              <h5>Your Appointments</h5>
              <ListGroup variant="flush">
                {appointments.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No appointments scheduled</p>
                  </div>
                ) : (
                  appointments.map((a) => (
                    <ListGroup.Item key={a.id}>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between">
                          <strong>{a.doctor_name}</strong>
                          <Badge
                            bg={
                              a.status === 'Confirmed'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {a.status}
                          </Badge>
                        </div>
                        <Badge bg="info">{a.specialization}</Badge>
                        <p className="small mb-1">
                          {a.date} • {a.time}
                        </p>
                        <p className="small text-muted">{a.reason}</p>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="w-100"
                        onClick={() =>
                          handleDeleteAppointment(a.id)
                        }
                      >
                        Cancel Appointment
                      </Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedDoctor && (
            <div className="mb-3">
              <h5>{selectedDoctor.name}</h5>
              <Badge bg="primary">{selectedDoctor.specialization}</Badge>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
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
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Appointments;
