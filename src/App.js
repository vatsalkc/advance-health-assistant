import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Alert } from 'react-bootstrap';
import authService from './services/authService';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import SymptomChecker from './components/SymptomChecker/SymptomChecker';
import DoctorRecommendation from './components/DoctorRecommendation/DoctorRecommendation';
import Appointments from './components/Appointments/Appointments';
import MedicineReminder from './components/MedicineReminder/MedicineReminder';
import UserHistory from './components/UserHistory/UserHistory';
import NetworkStatus from './components/NetworkStatus/NetworkStatus';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    // Check if user is already authenticated and validate token
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // Check if we're in demo mode
          if (authService.isDemoMode()) {
            setShowDemoAlert(true);
          }
          
          // Validate token if it's been a while
          if (authService.shouldValidateToken()) {
            const isValid = await authService.validateToken();
            if (isValid) {
              setUser(authService.getCurrentUser());
              setIsAuthenticated(true);
              setCurrentView('dashboard');
              if (authService.isDemoMode()) {
                setShowDemoAlert(true);
              }
            } else {
              // Token invalid, stay on login
              setCurrentView('login');
            }
          } else {
            // Token is recent, trust it
            setUser(currentUser);
            setIsAuthenticated(true);
            setCurrentView('dashboard');
            if (authService.isDemoMode()) {
              setShowDemoAlert(true);
            }
          }
        }
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    
    // Check if we're in demo mode after login
    if (authService.isDemoMode()) {
      setShowDemoAlert(true);
    }
  };

  const handleLogout = async () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setCurrentView('login');
      setPredictionResult(null);
      setShowDemoAlert(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSymptomResult = (disease, specialization, fullResult) => {
    // If fullResult is not provided, create it from the disease and specialization
    const result = fullResult || { disease, specialization };
    setPredictionResult(result);
    setCurrentView('doctorRecommendation');
  };

  return (
    <div className="App">
      <NetworkStatus />
      
      {/* Demo Mode Alert */}
      {showDemoAlert && (
        <Alert variant="info" dismissible onClose={() => setShowDemoAlert(false)} className="mb-0">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            <div>
              <strong>Demo Mode Active</strong> - You're using sample data. 
              For full functionality with AI predictions, follow the 
              <a href="https://github.com/vatsalkc/advance-health-assistant#-quick-start" target="_blank" rel="noopener noreferrer" className="ms-1">
                setup guide
              </a>.
            </div>
          </div>
        </Alert>
      )}
      
      <Navbar bg={darkMode ? 'dark' : 'primary'} variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Health Assistant
            {authService.isDemoMode() && (
              <span className="badge bg-warning text-dark ms-2">DEMO</span>
            )}
          </Navbar.Brand>
          {isAuthenticated && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link onClick={() => setCurrentView('dashboard')} active={currentView === 'dashboard'}>
                    <i className="bi bi-house-fill me-1"></i>Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('symptomChecker')} active={currentView === 'symptomChecker'}>
                    <i className="bi bi-clipboard2-pulse me-1"></i>Symptom Checker
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('appointments')} active={currentView === 'appointments'}>
                    <i className="bi bi-calendar-check me-1"></i>Appointments
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('medicineReminder')} active={currentView === 'medicineReminder'}>
                    <i className="bi bi-alarm me-1"></i>Medicines
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('userHistory')} active={currentView === 'userHistory'}>
                    <i className="bi bi-clock-history me-1"></i>History
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
                  <Navbar.Text className="me-3">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name}
                  </Navbar.Text>
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
          <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} darkMode={darkMode} />
        )}
        
        {!isAuthenticated && currentView === 'register' && (
          <Register onRegister={handleLogin} onSwitchToLogin={() => setCurrentView('login')} darkMode={darkMode} />
        )}

        {isAuthenticated && currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onNavigate={setCurrentView}
            onSymptomResult={handleSymptomResult}
          />
        )}

        {isAuthenticated && currentView === 'symptomChecker' && (
          <SymptomChecker onResult={handleSymptomResult} user={user} />
        )}

        {isAuthenticated && currentView === 'doctorRecommendation' && (
          <DoctorRecommendation 
            predictionResult={predictionResult}
            onBookAppointment={() => setCurrentView('appointments')}
          />
        )}

        {isAuthenticated && currentView === 'appointments' && (
          <Appointments user={user} />
        )}

        {isAuthenticated && currentView === 'medicineReminder' && (
          <MedicineReminder user={user} />
        )}

        {isAuthenticated && currentView === 'userHistory' && (
          <UserHistory user={user} />
        )}
      </Container>
    </div>
  );
}

export default App;
