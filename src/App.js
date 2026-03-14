import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import authService from './services/authService';
import doctorAuthService from './services/doctorAuthService';
import adminAuthService from './services/adminAuthService';
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
import AIChatbot from './components/AIChatbot/AIChatbot';
import DoctorApp from './DoctorApp';
import AdminApp from './AdminApp';

function App() {
  const [appMode, setAppMode] = useState('patient'); // 'patient', 'doctor', or 'admin'
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [symptomCheckTrigger, setSymptomCheckTrigger] = useState(0);
  const [chatbotOpen, setChatbotOpen] = useState(false);
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
    } else if (userRole === 'admin') {
      setAppMode('admin');
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
    setSymptomCheckTrigger(prev => prev + 1); // Trigger dashboard refresh
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
    // Clear doctor/admin auth
    doctorAuthService.logout();
    adminAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('patient');
    setCurrentView('login');
  };

  const handleSwitchToAdmin = () => {
    // Clear patient auth
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('admin');
    setCurrentView('login');
  };

  // If in admin mode, render AdminApp
  if (appMode === 'admin') {
    return (
      <AdminApp 
        onSwitchToPatient={handleSwitchToPatient}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

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
      
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home">
            <i className="bi bi-heart-pulse-fill"></i>
            Health Assistant
          </Navbar.Brand>
          {isAuthenticated && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <i className="bi bi-list" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}></i>
              </Navbar.Toggle>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto ms-lg-4">
                  <Nav.Link onClick={() => setCurrentView('dashboard')} active={currentView === 'dashboard'}>
                    <i className="bi bi-grid-fill me-2"></i>Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('symptomChecker')} active={currentView === 'symptomChecker'}>
                    <i className="bi bi-activity me-2"></i>Symptom Checker
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('appointments')} active={currentView === 'appointments'}>
                    <i className="bi bi-calendar-check me-2"></i>Appointments
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('medicineReminder')} active={currentView === 'medicineReminder'}>
                    <i className="bi bi-capsule me-2"></i>Medicines
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('userHistory')} active={currentView === 'userHistory'}>
                    <i className="bi bi-clock-history me-2"></i>History
                  </Nav.Link>
                </Nav>
                <Nav className="align-items-lg-center">
                  <Button 
                    variant="link" 
                    className="nav-theme-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                    title={darkMode ? 'Light Mode' : 'Dark Mode'}
                  >
                    <i className={`bi bi-${darkMode ? 'sun' : 'moon'}-fill`}></i>
                  </Button>
                  <Button 
                    variant="link" 
                    className="nav-ai-chatbot"
                    onClick={() => setChatbotOpen(true)}
                    title="AI Health Assistant"
                  >
                    <i className="bi bi-robot"></i>
                  </Button>
                  <Button
                    variant="link"
                    className="nav-profile-btn"
                    onClick={() => setCurrentView('profile')}
                    title="View Profile"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    <span>{user?.name}</span>
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="nav-logout-btn"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </Button>
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
            onSwitchToAdmin={handleSwitchToAdmin}
            darkMode={darkMode} 
          />
        )}
        
        {!isAuthenticated && currentView === 'register' && (
          <Register 
            onRegister={handleLogin} 
            onSwitchToLogin={() => setCurrentView('login')} 
            onSwitchToDoctor={handleSwitchToDoctor}
            onSwitchToAdmin={handleSwitchToAdmin}
            darkMode={darkMode} 
          />
        )}

        {isAuthenticated && currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onNavigate={setCurrentView}
            onSymptomResult={handleSymptomResult}
            symptomCheckTrigger={symptomCheckTrigger}
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

      {/* AI Chatbot - Full Screen */}
      {isAuthenticated && (
        <AIChatbot 
          user={user} 
          isOpen={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
