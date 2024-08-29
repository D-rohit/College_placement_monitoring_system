// Companies.js (main component)
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import SearchBar from '../companiesComponents/SearchBar';
import CompanyTable from '../companiesComponents/CompanyTable';
import PlacedStudentsTable from '../companiesComponents/PlacedStudentsTable';

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companies = [
    { id: 1, name: 'TCS - Tata Consultancy Services...', industry: 'IT', openPositions: 16, status: 'In Progress' },
    // Add more companies here
  ];

  const placedStudents = [
    { id: 1, name: 'ABC', department: 'CE', campus: 'On Campus', ctc: '3 lac / annum', designation: 'Associate SD' },
    { id: 2, name: 'ABC', department: 'CE', campus: 'On Campus', ctc: '3 lac / annum', designation: 'Associate SD' },
    { id: 3, name: 'ABC', department: 'CE', campus: 'On Campus', ctc: '3 lac / annum', designation: 'Associate SD' },
    { id: 4, name: 'ABC', department: 'CE', campus: 'On Campus', ctc: '3 lac / annum', designation: 'Associate SD' },
    { id: 5, name: 'ABC', department: 'CE', campus: 'On Campus', ctc: '3 lac / annum', designation: 'Associate SD' },
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom>
        Companies
      </Typography>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <CompanyTable
        companies={companies}
        handleViewDetails={handleViewDetails}
      />
      {selectedCompany && (
        <PlacedStudentsTable
          selectedCompany={selectedCompany}
          placedStudents={placedStudents}
        />
      )}
    </Container>
  );
};

export default Companies;