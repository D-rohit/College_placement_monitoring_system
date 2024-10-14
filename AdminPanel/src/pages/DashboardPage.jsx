// DashboardPage.js
import React from 'react';
import { Container, Grid } from '@mui/material';
import SummaryCard from './dashboardComponents/SummaryCard';
import DepartmentWisePlacements from './dashboardComponents/DepartmentWisePlacements';
import PlacementTrend from './dashboardComponents/PlacementTrend';
import TopCompaniesByCTC from './dashboardComponents/TopCompaniesByCTC';
import CTCStats from './dashboardComponents/CTCStats';
import TopCompaniesByOffers from './dashboardComponents/TopCompaniesByOffers';
import { PrimeIcons } from 'primereact/api'; // Importing PrimeIcons

const DashboardPage = () => {
  const studentCount = 354;
  const companiesCount = 35;
  const jobOffersCount = 424;
  const placedStudentsCount = 242;

  const departmentData = [
    { name: 'CSE', value: 40 },
    { name: 'ECE', value: 30 },
    { name: 'ICT', value: 30 },
  ];

  const placementTrendData = [
    { name: 'CS', Placed: 50, Total: 60 },
    { name: 'ECE', Placed: 40, Total: 50 },
    { name: 'ME', Placed: 30, Total: 40 },
    { name: 'EE', Placed: 35, Total: 45 },
    { name: 'CVL', Placed: 25, Total: 35 },
  ];

  const topCompanies = [
    { name: 'Google', ctc: 45_00_000 },
    { name: 'Accenture', ctc: 32_00_000 },
    { name: 'Cisco', ctc: 24_00_000 },
    { name: 'TCS - Tata Consult...', ctc: 4_00_000 },
  ];

  const ctcStats = {
    max: 35_00_000,
    avg: 12_00_000,
    min: 3_00_000,
  };

  const topCompaniesByOffers = [
    { name: 'TCS - Tata Consult...', offers: 45 },
    { name: 'Accenture', offers: 32 },
    { name: 'Cisco', offers: 24 },
    { name: 'Google', offers: 4 },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <SummaryCard title="Students" count={studentCount} icon={PrimeIcons.USERS} />
          <SummaryCard title="Companies" count={companiesCount} icon={PrimeIcons.BUILDING} />
          <SummaryCard title="Job Offers" count={jobOffersCount} icon={PrimeIcons.BRIEFCASE} />
          <SummaryCard title="Placed Students" count={placedStudentsCount} icon={PrimeIcons.CHECK} />
          <DepartmentWisePlacements data={departmentData} />
          <PlacementTrend data={placementTrendData} />
          <TopCompaniesByCTC companies={topCompanies} />
          <CTCStats stats={ctcStats} />
          <TopCompaniesByOffers companies={topCompaniesByOffers} />
        </Grid>
      </Container>
    </>
  );
};

export default DashboardPage;
