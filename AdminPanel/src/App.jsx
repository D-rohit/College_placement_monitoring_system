import React, { useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Students from './pages/Students';

import './App.css';

function App() {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <div className="App">
      <Header handleDrawerToggle={handleDrawerToggle} />
      
      <Sidebar open={open} />
     
      <Content open={open}>
        <Routes>
          <Route path="/Students" element={<Students />} />
        </Routes>
      </Content>
    </div>
    </Router>
  );
}

export default App;
