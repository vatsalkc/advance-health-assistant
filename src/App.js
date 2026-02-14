import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import authService from './services/authService';
import doctorAuthService from './services/doctorAuthService';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import SymptomChecker from './components/SymptomChecker/SymptomChecker';
import DoctorRecommendation from './components/DoctorRecommendation/DoctorRecommendation';
import Appointments from './components/Appointments/Appointments';
import MedicineReminder from './components/MedicineReminder/MedicineReminder';
import UserHistory from './components/UserHistory/UserHistory';
import Profile from './components/Profile/Profile';
import NetworkStatus from './components/NetworkStatus/NetworkStatus';
import DoctorApp from './DoctorApp';

function App() {
  const [appMode, setAppMode] = useState('patient'); // 'patient' or 'doctor'
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  useEffect(() => {
    // Apply dark mode to body and save preference
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Check which mode to use based on stored data
    const userRole = localStorage.getItem('user_role');
    if (userRole === 'doctor') {
      setAppMode('doctor');
    } else {
      setAppMode('patient');
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[App] Initializing auth...');
      
      try {
        if (authService.isAuthenticated()) {
          console.log('[App] Found existing session, validating...');
          
          const isValid = await authService.validateToken();
          
          if (isValid) {
            const currentUser = authService.getCurrentUser();
            console.log('[App] Session valid, user:', currentUser?.email);
            setUser(currentUser);
            setIsAuthenticated(true);
            setCurrentView('dashboard');
          } else {
            console.log('[App] Session invalid, showing login');
            setUser(null);
            setIsAuthenticated(false);
            setCurrentView('login');
          }
        } else {
          console.log('[App] No session found, showing login');
          setUser(null);
          setIsAuthenticated(false);
          setCurrentView('login');
        }
      } catch (error) {
        console.error('[App] Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
        setCurrentView('login');
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('[App] Logging out...');
      
      await authService.logout();
      
      // Clear all state
      setUser(null);
      setIsAuthenticated(false);
      setPredictionResult(null);
      setSelectedDoctor(null);
      setCurrentView('login');
      
      console.log('[App] Logout complete');
    } catch (error) {
      console.error('[App] Logout error:', error);
      
      // Force clear state even if there's an error
      setUser(null);
      setIsAuthenticated(false);
      setPredictionResult(null);
      setSelectedDoctor(null);
      setCurrentView('login');
    }
  };

  const handleSymptomResult = (disease, specialization, fullResult) => {
    const result = fullResult || { disease, specialization };
    setPredictionResult(result);
    setCurrentView('doctorRecommendation');
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView('appointments');
  };

  const handleSwitchToDoctor = () => {
    // Clear patient auth
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('doctor');
    setCurrentView('login');
  };

  const handleSwitchToPatient = () => {
    // Clear doctor auth
    doctorAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('patient');
    setCurrentView('login');
  };

  // If in doctor mode, render DoctorApp
  if (appMode === 'doctor') {
    return (
      <DoctorApp 
        onSwitchToPatient={handleSwitchToPatient}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  // Patient mode (default)
  return (
    <div className="App">
      <NetworkStatus />
      
      <Navbar bg={darkMode ? 'dark' : 'primary'} variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Health Assistant
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
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-3"
                    onClick={() => setCurrentView('profile')}
                    title="View Profile"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name}
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
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setCurrentView('register')} 
            onSwitchToDoctor={handleSwitchToDoctor}
            darkMode={darkMode} 
          />
        )}
        
        {!isAuthenticated && currentView === 'register' && (
          <Register 
            onRegister={handleLogin} 
            onSwitchToLogin={() => setCurrentView('login')} 
            onSwitchToDoctor={handleSwitchToDoctor}
            darkMode={darkMode} 
          />
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
            onBookAppointment={handleBookAppointment}
          />
        )}

        {isAuthenticated && currentView === 'appointments' && (
          <Appointments 
            user={user} 
            selectedDoctor={selectedDoctor}
            onClearSelection={() => setSelectedDoctor(null)}
          />
        )}

        {isAuthenticated && currentView === 'medicineReminder' && (
          <MedicineReminder user={user} />
        )}

        {isAuthenticated && currentView === 'userHistory' && (
          <UserHistory user={user} />
        )}

        {isAuthenticated && currentView === 'profile' && (
          <Profile 
            user={user} 
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('user_data', JSON.stringify(updatedUser));
            }}
            onLogout={handleLogout}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
