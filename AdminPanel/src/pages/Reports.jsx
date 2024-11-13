import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Container, Grid } from '@mui/material';

const PlacementReport = () => {
    const [allPlacements, setAllPlacements] = useState([]);
    const [coreNonCoreData, setCoreNonCoreData] = useState([]);
    const [yearWiseData, setYearWiseData] = useState([]);
    const [departmentWiseData, setDepartmentWiseData] = useState([]);

    useEffect(() => {
        fetchAllPlacements();
        fetchCoreNonCoreData();
        fetchYearWiseData();
        fetchDepartmentWiseData();
    }, []);

    const fetchAllPlacements = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/api/placement/getAllPlacementDetails',
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                    },
                });
            setAllPlacements(response.data);
        } catch (error) {
            console.error('Failed to fetch all placements', error);
        }
    };

    const fetchCoreNonCoreData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/api/placement/getCoreNonCorePlacements',
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                    },
                });
            setCoreNonCoreData(response.data);
        } catch (error) {
            console.error('Failed to fetch core/non-core data', error);
        }
    };

    const fetchYearWiseData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/api/placement/getStudentsPlacedYearOfStudyWise',
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                    },
                });
            setYearWiseData(response.data);
        } catch (error) {
            console.error('Failed to fetch year-wise placement data', error);
        }
    };

    const fetchDepartmentWiseData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/api/placement/getPlacedDepartmentWise',
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                    },
                });
            setDepartmentWiseData(response.data);
        } catch (error) {
            console.error('Failed to fetch department-wise placement data', error);
        }
    };

    const coreNonCoreOptions = {
        labels: coreNonCoreData.map(data => data.core_non_core),
        datasets: [
            {
                data: coreNonCoreData.map(data => data.count),
                backgroundColor: ['#42A5F5', '#66BB6A'],
                hoverBackgroundColor: ['#64B5F6', '#81C784']
            }
        ]
    };

    const yearWiseOptions = {
        labels: yearWiseData.map(data => data.year),
        datasets: [
            {
                label: 'Number of Students Placed',
                data: yearWiseData.map(data => data.placed_students),
                backgroundColor: '#ffce56'
            }
        ]
    };

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card title="Placement Details">
                        <DataTable value={allPlacements}>
                            <Column field="student_name" header="Student Name"></Column>
                            <Column field="company_name" header="Company Name"></Column>
                            <Column field="position" header="Position"></Column>
                            <Column field="salary" header="Salary"></Column>
                            <Column field="placement_date" header="Placement Date"></Column>
                            <Column field="location" header="Location"></Column>
                            <Column field="core_non_core" header="Core/Non-Core"></Column>
                        </DataTable>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card title="Core vs Non-Core Placements">
                        <Chart type="pie" data={coreNonCoreOptions} />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card title="Year of Study Placement Stats">
                        <Chart type="bar" data={yearWiseOptions} />
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card title="Department Wise Placement Stats">
                        <DataTable value={departmentWiseData}>
                            <Column field="department" header="Department"></Column>
                            <Column field="placed_students" header="Placed Students"></Column>
                        </DataTable>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PlacementReport;