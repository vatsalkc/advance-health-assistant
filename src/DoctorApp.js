import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import doctorAuthService from './services/doctorAuthService';
import DoctorLogin from './components/Doctor/DoctorLogin';
import DoctorRegister from './components/Doctor/DoctorRegister';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import DoctorAppointments from './components/Doctor/DoctorAppointments';
import DoctorPatients from './components/Doctor/DoctorPatients';
import PatientDetails from './components/Doctor/PatientDetails';
import DoctorProfile from './components/Doctor/DoctorProfile';
import NetworkStatus from './components/NetworkStatus/NetworkStatus';

function DoctorApp({ onSwitchToPatient, darkMode, setDarkMode }) {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[DoctorApp] Initializing auth...');
      
      try {
        if (doctorAuthService.isAuthenticated()) {
          console.log('[DoctorApp] Found existing session, validating...');
          
          const isValid = await doctorAuthService.validateToken();
          
          if (isValid) {
            const currentDoctor = doctorAuthService.getCurrentDoctor();
            console.log('[DoctorApp] Session valid, doctor:', currentDoctor?.email);
            setDoctor(currentDoctor);
            setIsAuthenticated(true);
            setCurrentView('dashboard');
          } else {
            console.log('[DoctorApp] Session invalid, showing login');
            setDoctor(null);
            setIsAuthenticated(false);
            setCurrentView('login');
          }
        } else {
          console.log('[DoctorApp] No session found, showing login');
          setDoctor(null);
          setIsAuthenticated(false);
          setCurrentView('login');
        }
      } catch (error) {
        console.error('[DoctorApp] Auth initialization error:', error);
        setDoctor(null);
        setIsAuthenticated(false);
        setCurrentView('login');
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (doctorData) => {
    setDoctor(doctorData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('[DoctorApp] Logging out...');
      
      await doctorAuthService.logout();
      
      setDoctor(null);
      setIsAuthenticated(false);
      setCurrentView('login');
      
      console.log('[DoctorApp] Logout complete');
    } catch (error) {
      console.error('[DoctorApp] Logout error:', error);
      
      setDoctor(null);
      setIsAuthenticated(false);
      setCurrentView('login');
    }
  };

  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentView('patientDetails');
  };

  return (
    <div className="App">
      <NetworkStatus />
      
      <Navbar bg={darkMode ? 'dark' : 'success'} variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="bi bi-hospital me-2"></i>
            Doctor Portal
          </Navbar.Brand>
          {isAuthenticated && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link onClick={() => setCurrentView('dashboard')} active={currentView === 'dashboard'}>
                    <i className="bi bi-house-fill me-1"></i>Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('appointments')} active={currentView === 'appointments'}>
                    <i className="bi bi-calendar-check me-1"></i>Appointments
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('patients')} active={currentView === 'patients'}>
                    <i className="bi bi-people me-1"></i>Patients
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="me-3"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <i className={`bi bi-${darkMode ? 'sun' : 'moon'}-fill`}></i>
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-3"
                    onClick={() => setCurrentView('profile')}
                    title="View Profile"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    Dr. {doctor?.name}
                  </Button>
                  <Nav.Link onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>

      <Container className="mt-4 mb-5">
        {!isAuthenticated && currentView === 'login' && (
          <DoctorLogin 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToPatient={onSwitchToPatient}
            darkMode={darkMode}
          />
        )}
        
        {!isAuthenticated && currentView === 'register' && (
          <DoctorRegister 
            onRegister={handleLogin} 
            onSwitchToLogin={() => setCurrentView('login')}
            onSwitchToPatient={onSwitchToPatient}
            darkMode={darkMode}
          />
        )}

        {isAuthenticated && currentView === 'dashboard' && (
          <DoctorDashboard 
            doctor={doctor}
            onNavigate={setCurrentView}
          />
        )}

        {isAuthenticated && currentView === 'appointments' && (
          <DoctorAppointments />
        )}

        {isAuthenticated && currentView === 'patients' && (
          <DoctorPatients onViewPatient={handleViewPatient} />
        )}

        {isAuthenticated && currentView === 'patientDetails' && (
          <PatientDetails 
            patientId={selectedPatientId}
            onBack={() => setCurrentView('patients')}
          />
        )}

        {isAuthenticated && currentView === 'profile' && (
          <DoctorProfile 
            doctor={doctor}
            onUpdateDoctor={(updatedDoctor) => {
              setDoctor(updatedDoctor);
              localStorage.setItem('doctor_data', JSON.stringify(updatedDoctor));
            }}
            onLogout={handleLogout}
          />
        )}
      </Container>
    </div>
  );
}

export default DoctorApp;
