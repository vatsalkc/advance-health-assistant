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
import Reports from './components/Reports/Reports';
import UserHistory from './components/UserHistory/UserHistoryEnhanced';
import Profile from './components/Profile/Profile';
import NetworkStatus from './components/NetworkStatus/NetworkStatus';
import AIChatbot from './components/AIChatbot/AIChatbot';
import ToastNotification from './components/Toast/ToastNotification';
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
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [viewHistory, setViewHistory] = useState(['login']);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Update view and manage history
  const navigateToView = (view) => {
    setCurrentView(view);
    setViewHistory(prev => [...prev, view]);
    window.history.pushState({ view }, '', window.location.href);
  };

  useEffect(() => {
    // Apply dark mode to body and save preference
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
    // Navbar scroll behavior - show on scroll up
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
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
            setViewHistory(['dashboard']);
            setCurrentView('dashboard');
          } else {
            console.log('[App] Session invalid, showing login');
            setUser(null);
            setIsAuthenticated(false);
            setViewHistory(['login']);
            setCurrentView('login');
          }
        } else {
          console.log('[App] No session found, showing login');
          setUser(null);
          setIsAuthenticated(false);
          setViewHistory(['login']);
          setCurrentView('login');
        }
      } catch (error) {
        console.error('[App] Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
        setViewHistory(['login']);
        setCurrentView('login');
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setViewHistory(['dashboard']);
    navigateToView('dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('[App] Logging out...');
      
      window.isLoggingOut = true;
      
      await authService.logout();
      
      // Clear all state
      setUser(null);
      setIsAuthenticated(false);
      setPredictionResult(null);
      setSelectedDoctor(null);
      setViewHistory(['login']);
      setCurrentView('login');
      
      setTimeout(() => {
        window.isLoggingOut = false;
      }, 100);
      
      console.log('[App] Logout complete');
    } catch (error) {
      console.error('[App] Logout error:', error);
      
      window.isLoggingOut = false;
      
      // Force clear state even if there's an error
      setUser(null);
      setIsAuthenticated(false);
      setPredictionResult(null);
      setSelectedDoctor(null);
      setViewHistory(['login']);
      setCurrentView('login');
    }
  };

  const handleSymptomResult = (disease, specialization, fullResult) => {
    const result = fullResult || { disease, specialization };
    setPredictionResult(result);
    setSymptomCheckTrigger(prev => prev + 1); // Trigger dashboard refresh
    navigateToView('doctorRecommendation');
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    navigateToView('appointments');
  };

  const handleSwitchToDoctor = () => {
    // Clear patient auth
    authService.logout();
    localStorage.removeItem('user_role');
    localStorage.setItem('user_role', 'doctor');
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('doctor');
    setViewHistory(['login']);
    setCurrentView('login');
  };

  const handleSwitchToPatient = () => {
    // Clear doctor/admin auth
    doctorAuthService.logout();
    adminAuthService.logout();
    localStorage.removeItem('user_role');
    localStorage.setItem('user_role', 'patient');
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('patient');
    setViewHistory(['login']);
    setCurrentView('login');
  };

  const handleSwitchToAdmin = () => {
    // Clear patient auth
    authService.logout();
    localStorage.removeItem('user_role');
    localStorage.setItem('user_role', 'admin');
    setUser(null);
    setIsAuthenticated(false);
    setAppMode('admin');
    setViewHistory(['login']);
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
      <ToastNotification />
      <NetworkStatus />
      
      <Navbar 
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
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Health Assistant
          </Navbar.Brand>
          
          {isAuthenticated && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <i className="bi bi-list" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}></i>
              </Navbar.Toggle>
              
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto ms-lg-3">
                  <Nav.Link 
                    onClick={() => navigateToView('dashboard')} 
                    active={currentView === 'dashboard'}
                    className="nav-item-custom"
                  >
                    <i className="bi bi-grid-fill me-2"></i>
                    <span>Dashboard</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => navigateToView('symptomChecker')} 
                    active={currentView === 'symptomChecker'}
                    className="nav-item-custom"
                  >
                    <i className="bi bi-activity me-2"></i>
                    <span>Symptom Checker</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => navigateToView('appointments')} 
                    active={currentView === 'appointments'}
                    className="nav-item-custom"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    <span>Appointments</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => navigateToView('medicineReminder')} 
                    active={currentView === 'medicineReminder'}
                    className="nav-item-custom"
                  >
                    <i className="bi bi-capsule me-2"></i>
                    <span>Medicines</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => navigateToView('reports')} 
                    active={currentView === 'reports'}
                    className="nav-item-custom"
                  >
                    <i className="bi bi-file-medical me-2"></i>
                    <span>Reports</span>
                  </Nav.Link>
                  
                  <Nav.Link 
                    onClick={() => navigateToView('userHistory')} 
                    active={currentView === 'userHistory'}
                    className="nav-item-custom"
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    <span>History</span>
                  </Nav.Link>
                </Nav>
                
                <Nav className="navbar-actions">
                  <Button 
                    variant="link" 
                    className="nav-action-btn"
                    onClick={() => setDarkMode(!darkMode)}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    <i className={`bi bi-${darkMode ? 'sun' : 'moon'}-fill`}></i>
                  </Button>
                  
                  <Button 
                    variant="link" 
                    className="nav-action-btn"
                    onClick={() => setChatbotOpen(true)}
                    title="AI Health Assistant"
                  >
                    <i className="bi bi-robot"></i>
                  </Button>
                  
                  <div className="navbar-divider d-none d-lg-block"></div>
                  
                  <Button
                    variant="link"
                    className="nav-profile-btn"
                    onClick={() => navigateToView('profile')}
                    title="View Profile"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    <span className="d-none d-md-inline">{user?.name}</span>
                  </Button>
                  
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="nav-logout-btn"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    <span className="d-none d-sm-inline">Logout</span>
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
            onSwitchToRegister={() => navigateToView('register')} 
            onSwitchToDoctor={handleSwitchToDoctor}
            onSwitchToAdmin={handleSwitchToAdmin}
            darkMode={darkMode} 
          />
        )}
        
        {!isAuthenticated && currentView === 'register' && (
          <Register 
            onRegister={handleLogin} 
            onSwitchToLogin={() => navigateToView('login')} 
            onSwitchToDoctor={handleSwitchToDoctor}
            onSwitchToAdmin={handleSwitchToAdmin}
            darkMode={darkMode} 
          />
        )}

        {isAuthenticated && currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onNavigate={navigateToView}
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

        {isAuthenticated && currentView === 'reports' && (
          <Reports />
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
