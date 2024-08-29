// Students.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import SearchBar from '../studentsComponents/SearchBar';
import StudentTable from '../studentsComponents/StudentTable';
import ExportButton from '../studentsComponents/ExportButton';
import { students } from '../studentsComponents/data'; // Move the students data to a separate file

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [tableHeight, setTableHeight] = useState('400px');

  useEffect(() => {
    const updateTableHeight = () => {
      const windowHeight = window.innerHeight;
      const newTableHeight = windowHeight * 0.6;
      setTableHeight(`${newTableHeight}px`);
    };

    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    return () => window.removeEventListener('resize', updateTableHeight);
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(students.map((n) => n.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom>
        Students
      </Typography>
      <Paper sx={{ p: 1, mb: 1 }}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </Paper>
      <StudentTable
        students={students}
        selected={selected}
        tableHeight={tableHeight}
        handleSelectAllClick={handleSelectAllClick}
        handleClick={handleClick}
      />
      <ExportButton selected={selected} students={students} />
    </Container>
  );
};

export default Students;
