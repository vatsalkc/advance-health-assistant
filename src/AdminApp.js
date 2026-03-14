import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import adminAuthService from './services/adminAuthService';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import DoctorApproval from './components/Admin/DoctorApproval';
import DoctorManagement from './components/Admin/DoctorManagement';
import UserManagement from './components/Admin/UserManagement';
import AppointmentManagement from './components/Admin/AppointmentManagement';

function AdminApp({ onSwitchToPatient, darkMode, setDarkMode }) {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[AdminApp] Initializing auth...');
      
      try {
        if (adminAuthService.isAuthenticated()) {
          console.log('[AdminApp] Found existing session, validating...');
          
          const isValid = await adminAuthService.validateToken();
          
          if (isValid) {
            const currentAdmin = adminAuthService.getCurrentAdmin();
            console.log('[AdminApp] Session valid, admin:', currentAdmin?.email);
            setAdmin(currentAdmin);
            setIsAuthenticated(true);
            setCurrentView('dashboard');
          } else {
            console.log('[AdminApp] Session invalid, showing login');
            setAdmin(null);
            setIsAuthenticated(false);
            setCurrentView('login');
          }
        } else {
          console.log('[AdminApp] No session found, showing login');
          setAdmin(null);
          setIsAuthenticated(false);
          setCurrentView('login');
        }
      } catch (error) {
        console.error('[AdminApp] Auth initialization error:', error);
        setAdmin(null);
        setIsAuthenticated(false);
        setCurrentView('login');
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('[AdminApp] Logging out...');
      
      await adminAuthService.logout();
      
      // Clear all state
      setAdmin(null);
      setIsAuthenticated(false);
      setCurrentView('login');
      
      console.log('[AdminApp] Logout complete');
    } catch (error) {
      console.error('[AdminApp] Logout error:', error);
      
      // Force clear state even if there's an error
      setAdmin(null);
      setIsAuthenticated(false);
      setCurrentView('login');
    }
  };

  return (
    <div className="App">
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home">
            <i className="bi bi-shield-lock-fill"></i>
            Admin Portal
          </Navbar.Brand>
          {isAuthenticated && (
            <>
              <Navbar.Toggle aria-controls="admin-navbar-nav">
                <i className="bi bi-list" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}></i>
              </Navbar.Toggle>
              <Navbar.Collapse id="admin-navbar-nav">
                <Nav className="me-auto ms-lg-4">
                  <Nav.Link onClick={() => setCurrentView('dashboard')} active={currentView === 'dashboard'}>
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('pending-doctors')} active={currentView === 'pending-doctors'}>
                    <i className="bi bi-person-check me-2"></i>Approvals
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('doctors')} active={currentView === 'doctors'}>
                    <i className="bi bi-person-gear me-2"></i>Doctors
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('users')} active={currentView === 'users'}>
                    <i className="bi bi-people me-2"></i>Users
                  </Nav.Link>
                  <Nav.Link onClick={() => setCurrentView('appointments')} active={currentView === 'appointments'}>
                    <i className="bi bi-calendar3 me-2"></i>Appointments
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
                    className="nav-profile-btn"
                    title="Admin Profile"
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    <span>{admin?.name}</span>
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
          <AdminLogin 
            onLogin={handleLogin} 
            onSwitchToPatient={onSwitchToPatient}
            darkMode={darkMode} 
          />
        )}

        {isAuthenticated && currentView === 'dashboard' && (
          <AdminDashboard 
            admin={admin}
            onNavigate={setCurrentView}
          />
        )}

        {isAuthenticated && currentView === 'pending-doctors' && (
          <DoctorApproval />
        )}

        {isAuthenticated && currentView === 'doctors' && (
          <DoctorManagement />
        )}

        {isAuthenticated && currentView === 'users' && (
          <UserManagement />
        )}

        {isAuthenticated && currentView === 'appointments' && (
          <AppointmentManagement />
        )}
      </Container>
    </div>
  );
}

export default AdminApp;
