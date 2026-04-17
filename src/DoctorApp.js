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
import ToastNotification from './components/Toast/ToastNotification';

function DoctorApp({ onSwitchToPatient, darkMode, setDarkMode }) {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [viewHistory, setViewHistory] = useState(['login']);

  // Update view and manage history
  const navigateToView = (view) => {
    setCurrentView(view);
    setViewHistory(prev => [...prev, view]);
    window.history.pushState({ view }, '', window.location.href);
  };

  useEffect(() => {
    // Handle browser back button to navigate between tabs
    const handlePopState = (e) => {
      if (viewHistory.length > 1) {
        // Navigate to previous view
        const newHistory = [...viewHistory];
        newHistory.pop(); // Remove current view
        const previousView = newHistory[newHistory.length - 1] || 'dashboard';
        
        setViewHistory(newHistory);
        setCurrentView(previousView);
        
        // Push state back to prevent leaving the app
        window.history.pushState({ view: previousView }, '', window.location.href);
      } else {
        // If no history, stay on current view
        window.history.pushState({ view: currentView }, '', window.location.href);
      }
    };

    // Push initial state
    window.history.pushState({ view: currentView }, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [viewHistory, currentView]);

  useEffect(() => {
    // Navbar scroll behavior - show on scroll up, hide on scroll down
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show at top
        setShowNavbar(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setShowNavbar(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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
            setViewHistory(['dashboard']);
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
    navigateToView('dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('[DoctorApp] Logging out...');
      
      await doctorAuthService.logout();
      
      setDoctor(null);
      setIsAuthenticated(false);
      setCurrentView('login');
      setViewHistory(['login']);
      
      console.log('[DoctorApp] Logout complete');
    } catch (error) {
      console.error('[DoctorApp] Logout error:', error);
      
      setDoctor(null);
      setIsAuthenticated(false);
      setCurrentView('login');
      setViewHistory(['login']);
    }
  };

  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId);
    navigateToView('patientDetails');
  };

  return (
    <div className="App">
      <ToastNotification />
      <NetworkStatus />
      
      <Navbar 
        bg={darkMode ? 'dark' : 'success'} 
        variant="dark" 
        expand="lg" 
        className={`navbar-custom navbar-sticky ${showNavbar ? 'navbar-visible' : 'navbar-hidden'}`}
        fixed="top"
      >
        <Container>
          <Navbar.Brand 
            className="fw-bold" 
            style={{ cursor: 'pointer' }}
            onClick={() => isAuthenticated && navigateToView('dashboard')}
          >
            <i className="bi bi-hospital me-2"></i>
            Doctor Portal
          </Navbar.Brand>
          {isAuthenticated && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link onClick={() => navigateToView('dashboard')} active={currentView === 'dashboard'}>
                    <i className="bi bi-house-fill me-1"></i>Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={() => navigateToView('appointments')} active={currentView === 'appointments'}>
                    <i className="bi bi-calendar-check me-1"></i>Appointments
                  </Nav.Link>
                  <Nav.Link onClick={() => navigateToView('patients')} active={currentView === 'patients'}>
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
                    onClick={() => navigateToView('profile')}
                    title="View Profile"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    Dr. {doctor?.name}
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-3"
                    onClick={(e) => {
                      e.preventDefault();
                      onSwitchToPatient();
                    }}
                    title="Switch to Patient Portal"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Patient
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
            onSwitchToRegister={() => navigateToView('register')}
            onSwitchToPatient={onSwitchToPatient}
            darkMode={darkMode}
          />
        )}
        
        {!isAuthenticated && currentView === 'register' && (
          <DoctorRegister 
            onRegister={handleLogin} 
            onSwitchToLogin={() => navigateToView('login')}
            onSwitchToPatient={onSwitchToPatient}
            darkMode={darkMode}
          />
        )}

        {isAuthenticated && currentView === 'dashboard' && (
          <DoctorDashboard 
            doctor={doctor}
            onNavigate={navigateToView}
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
            onBack={() => navigateToView('patients')}
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
