import React, { useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Students from './pages/Students';
import DashboardPage from './pages/DashboardPage';
import Companies from './pages/Companies'
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
            <Route path="/students" element={<Students />} />
          </Routes>
          </Content>
        </div>
    </div>
    </Router>
  );
}

export default App;
