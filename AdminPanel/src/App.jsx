import React, { useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme CSS
import 'primereact/resources/primereact.min.css';            // Core CSS
import 'primeicons/primeicons.css';    
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';
// import Students from './pages/Students';
import StudentsDemo from './pages/StudentsDemo';
import DashboardPage from './pages/DashboardPage';
import Companies from './pages/Companies'
// import SignUp from './pages/SignUp';
import './App.css';

function App() {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <div className="app-container">
        <div className='header-container'>
          <Header handleDrawerToggle={handleDrawerToggle} />
        </div>
        <div className='sidebar-container'>
          <Sidebar open={open} />
        </div>
        <div className='Content-container'>
          <Content open={open}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/companies" element={<Companies />} />
            {/* <Route path="/students" element={<Students />} /> */}
            <Route path="/students" element={<StudentsDemo />} />
            {/* <Route path="/sign-up" element={<SignUp />} /> */}
          </Routes>
          </Content>
        </div>
    </div>
    </Router>
    
  );
}

export default App;
