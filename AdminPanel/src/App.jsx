import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';    
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';
import Students from './pages/Students';
import Reports from './pages/Reports';
import DashboardPage from './pages/DashboardPage';
import Companies from './pages/Companies';
import SignUp from './pages/SignUp'; // Import the AuthForm component we created earlier
import './App.css';

function App() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <>
            <div className='header-container'>
              <Header handleDrawerToggle={handleDrawerToggle} onLogout={handleLogout} />
            </div>
            <div className='sidebar-container'>
              <Sidebar open={open} />
            </div>
          </>
        )}
        <div className='Content-container'>
          {isAuthenticated ? (
            <Content open={open}>
              <Routes>
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Content>
          ) : (
            <Routes>
              <Route path="/auth" element={<SignUp onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
