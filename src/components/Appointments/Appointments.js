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
import {
  createAppointment,
  subscribeToAppointments,
  deleteAppointment,
  getAllDoctors
} from '../../firebase/firebaseService';

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
    if (!user?.uid) return;

    fetchDoctors();

    const unsubscribe = subscribeToAppointments(user.uid, (data) => {
      setAppointments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const list = await getAllDoctors();
      setDoctors(list);
    } catch (err) {
      console.error('Error fetching doctors:', err);
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
      await createAppointment(user.uid, {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
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
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      await deleteAppointment(id);
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
        <Col lg={8}>
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
                  <p>Loading doctors...</p>
                ) : (
                  <Row>
                    {filteredDoctors.map((doctor) => (
                      <Col md={6} key={doctor.id} className="mb-3">
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
                              <Badge
                                bg={doctor.available ? 'success' : 'secondary'}
                              >
                                {doctor.available
                                  ? 'Available'
                                  : 'Unavailable'}
                              </Badge>

                              <Button
                                size="sm"
                                disabled={!doctor.available}
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
        <Col lg={4}>
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
                          <strong>{a.doctorName}</strong>
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
