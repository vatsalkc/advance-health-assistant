import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Row, Col, Container } from 'react-bootstrap';
import { doctorPatientsAPI } from '../../utils/doctorApi';
import { supabase } from '../../config/supabase';

function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorPatientsAPI.getAll();
      const patientsData = response.data.patients || [];
      
      // Fetch appointment counts for each patient
      const doctorId = JSON.parse(localStorage.getItem('doctor_data')).id;
      const patientsWithStats = await Promise.all(
        patientsData.map(async (patient) => {
          try {
            const { data: appointments } = await supabase
              .from('appointments')
              .select('id, date, status')
              .eq('user_id', patient.id)
              .eq('doctor_id', doctorId)
              .order('date', { ascending: false });
            
            const completedAppointments = appointments?.filter(a => a.status === 'Completed') || [];
            const lastAppointment = completedAppointments[0];
            
            return {
              ...patient,
              total_appointments: appointments?.length || 0,
              last_appointment_date: lastAppointment?.date || 'N/A'
            };
          } catch (err) {
            console.error('Error fetching patient stats:', err);
            return {
              ...patient,
              total_appointments: 0,
              last_appointment_date: 'N/A'
            };
          }
        })
      );
      
      setPatients(patientsWithStats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setLoading(false);
    }
  };

  const handleViewHistory = async (patient) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
    
    // Fetch patient's appointment history
    try {
      const response = await doctorPatientsAPI.getPatientDetails(patient.id);
      const appointments = response.data.appointments || [];
      
      // Sort by date descending (most recent first)
      const sortedAppointments = appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
      });
      
      setPatientHistory(sortedAppointments);
    } catch (err) {
      console.error('Error fetching patient history:', err);
      setPatientHistory([]);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="patients-page-new">
      {/* Header */}
      <div className="page-header-new mb-4">
        <h2><i className="bi bi-people me-2"></i>My Patients</h2>
        <p className="text-muted">View all your patients and their medical history</p>
      </div>

      {/* Stats */}
      <Card className="stats-card-new mb-4">
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="mb-0">{patients.length}</h3>
            <p className="text-muted mb-0">Total Patients</p>
          </div>
          <div className="stats-icon">
            <i className="bi bi-people-fill"></i>
          </div>
        </Card.Body>
      </Card>

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <Card className="empty-state-card-new">
          <Card.Body className="text-center py-5">
            <i className="bi bi-people" style={{ fontSize: '4rem', color: '#94a3b8' }}></i>
            <h4 className="text-muted mt-3">No patients yet</h4>
            <p className="text-muted">Patients will appear here after appointments</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {patients.map(patient => (
            <Col lg={6} xl={4} key={patient.id} className="mb-4">
              <Card className="patient-card-new">
                <Card.Body>
                  <div className="patient-header-new">
                    <div className="patient-avatar-new">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="patient-name-new">{patient.name}</h5>
                      <div className="patient-badges">
                        {patient.age && (
                          <Badge bg="light" text="dark" className="me-2">
                            <i className="bi bi-calendar3 me-1"></i>
                            {patient.age} yrs
                          </Badge>
                        )}
                        {patient.gender && (
                          <Badge 
                            bg={patient.gender.toLowerCase() === 'male' ? 'primary' : 'danger'}
                          >
                            <i className={`bi bi-gender-${patient.gender.toLowerCase() === 'male' ? 'male' : 'female'} me-1`}></i>
                            {patient.gender}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="patient-contact-new mt-3">
                    <div className="contact-item-new">
                      <i className="bi bi-envelope"></i>
                      <span>{patient.email}</span>
                    </div>
                    {patient.phone && (
                      <div className="contact-item-new">
                        <i className="bi bi-telephone"></i>
                        <span>{patient.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="patient-stats-new mt-3">
                    <div className="stat-item-new">
                      <i className="bi bi-calendar-check text-success"></i>
                      <span>{patient.total_appointments || 0} Appointments</span>
                    </div>
                    <div className="stat-item-new">
                      <i className="bi bi-clock-history text-primary"></i>
                      <span>Last: {patient.last_appointment_date || 'N/A'}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={() => handleViewHistory(patient)}
                  >
                    <i className="bi bi-file-medical me-2"></i>
                    View Medical History
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Patient History Modal */}
      <Modal 
        show={showHistoryModal} 
        onHide={() => setShowHistoryModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton className="patient-history-modal-header">
          <Modal.Title>
            <i className="bi bi-file-medical me-2"></i>
            Medical History - {selectedPatient?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div className="patient-info-summary mb-4">
              <Row>
                <Col md={6}>
                  <div className="info-item-summary">
                    <strong>Email:</strong> {selectedPatient.email}
                  </div>
                  <div className="info-item-summary">
                    <strong>Phone:</strong> {selectedPatient.phone || 'N/A'}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item-summary">
                    <strong>Age:</strong> {selectedPatient.age || 'N/A'} years
                  </div>
                  <div className="info-item-summary">
                    <strong>Gender:</strong> {selectedPatient.gender || 'N/A'}
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <h5 className="mb-3">
            <i className="bi bi-clock-history me-2"></i>
            Appointment History
          </h5>

          {patientHistory.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
              <p className="text-muted mt-3">No appointment history found</p>
            </div>
          ) : (
            <div className="history-timeline">
              {patientHistory.map((appointment, index) => (
                <div key={appointment.id} className="history-item-new">
                  <div className="history-marker"></div>
                  <div className="history-content">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">
                          <i className="bi bi-calendar3 me-2"></i>
                          {appointment.date} at {appointment.time}
                        </h6>
                        <Badge bg={
                          appointment.status === 'Completed' ? 'success' :
                          appointment.status === 'Confirmed' ? 'info' :
                          appointment.status === 'Pending' ? 'warning' :
                          appointment.status === 'Rejected' ? 'danger' : 'secondary'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="history-details">
                      <div className="detail-row-history">
                        <strong>Reason:</strong>
                        <span>{appointment.reason}</span>
                      </div>

                      {appointment.diagnosis && (
                        <div className="detail-row-history">
                          <strong>Diagnosis:</strong>
                          <span className="diagnosis-text">{appointment.diagnosis}</span>
                        </div>
                      )}

                      {appointment.prescription && (
                        <div className="detail-row-history">
                          <strong>Prescription:</strong>
                          <span className="prescription-text">{appointment.prescription}</span>
                        </div>
                      )}

                      {!appointment.diagnosis && !appointment.prescription && appointment.status === 'Completed' && (
                        <div className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          No diagnosis or prescription recorded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DoctorPatients;
