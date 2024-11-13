import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import SummaryCard from './dashboardComponents/SummaryCard';
import DepartmentWisePlacements from './dashboardComponents/DepartmentWisePlacements';
import PlacementTrend from './dashboardComponents/PlacementTrend';
import TopCompaniesByCTC from './dashboardComponents/TopCompaniesByCTC';
import CTCStats from './dashboardComponents/CTCStats';
import TopCompaniesByOffers from './dashboardComponents/TopCompaniesByOffers';
import { PrimeIcons } from 'primereact/api';
import axios from 'axios';

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState({
    studentCount: 0,
    companiesCount: 0,
    jobOffersCount: 0,
    placedStudentsCount: 0,
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [placementTrendData, setPlacementTrendData] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [ctcStats, setCtcStats] = useState({});
  const [topCompaniesByOffers, setTopCompaniesByOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await localStorage.getItem("token");
        const [placementsRes, studentsRes, departmentsRes, companiesRes] = await Promise.all([
          axios.get("http://localhost:3000/api/placement/getAllPlacements",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
              },
            }),
          axios.get("http://localhost:3000/api/student/getAllStudents",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
              },
            }),
          axios.get("http://localhost:3000/api/department/getAllDepartments",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
              },
            }),
          axios.get("http://localhost:3000/api/company/getAllCompanies",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
              },
            }),
        ]);

        const placements = placementsRes.data;
        const students = studentsRes.data;
        const departments = departmentsRes.data;
        const companies = companiesRes.data;

        // Compute summary data
        const placedStudents = new Set(placements.map(p => p.student_id)).size;
        const companiesCount = companies.length;

        setSummaryData({
          studentCount: students.length,
          companiesCount: companiesCount,
          jobOffersCount: placements.length,
          placedStudentsCount: placedStudents,
        });

        // Compute department-wise placements
        const departmentMap = {};
        students.forEach(student => {
          const department = departments.find(dep => dep.dep_id === student.dep_id)?.dep_name;
          if (department) {
            departmentMap[department] = (departmentMap[department] || 0) + 1;
          }
        });
        setDepartmentData(Object.entries(departmentMap).map(([name, value]) => ({ name, value })));

        // Compute placement trend data
        const placementTrend = departments.map(dep => {
          const studentsInDep = students.filter(student => student.dep_id === dep.dep_id).length;
          const placedInDep = placements.filter(p =>
            students.some(student => student.student_id === p.student_id && student.dep_id === dep.dep_id)
          ).length;
          return { name: dep.dep_name, Placed: placedInDep, Total: studentsInDep };
        });
        setPlacementTrendData(placementTrend);

        // Compute top companies by CTC
        const companiesCTC = placements.reduce((acc, p) => {
          acc[p.company_id] = Math.max(acc[p.company_id] || 0, p.salary);
          return acc;
        }, {});
        setTopCompanies(
          companies
            .map(company => ({
              name: company.company_name,
              ctc: companiesCTC[company.company_id] || 0,
            }))
            .sort((a, b) => b.ctc - a.ctc)
            .slice(0, 5)
        );

        // Compute CTC statistics
        const salaries = placements.map(p => p.salary);
        setCtcStats({
          max: Math.max(...salaries),
          avg: (salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length).toFixed(2),
          min: Math.min(...salaries),
        });

        // Compute top companies by offers
        const offersCount = placements.reduce((acc, p) => {
          acc[p.company_id] = (acc[p.company_id] || 0) + 1;
          return acc;
        }, {});
        setTopCompaniesByOffers(
          companies
            .map(company => ({
              name: company.company_name,
              offers: offersCount[company.company_id] || 0,
            }))
            .sort((a, b) => b.offers - a.offers)
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <SummaryCard title="Students" count={summaryData.studentCount} icon={PrimeIcons.USERS} />
          <SummaryCard title="Companies" count={summaryData.companiesCount} icon={PrimeIcons.BUILDING} />
          <SummaryCard title="Job Offers" count={summaryData.jobOffersCount} icon={PrimeIcons.BRIEFCASE} />
          <SummaryCard title="Placed Students" count={summaryData.placedStudentsCount} icon={PrimeIcons.CHECK} />
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
