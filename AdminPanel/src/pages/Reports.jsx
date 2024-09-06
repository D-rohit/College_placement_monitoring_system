import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import previousStudentData from './studentsComponents/PreviousData.jsx';

const Reports = () => {
    const [students, setStudents] = useState([]);
    const [placementStats, setPlacementStats] = useState({});
    const [companyChartData, setCompanyChartData] = useState({});
    const [salaryChartData, setSalaryChartData] = useState({});
    const [trendChartData, setTrendChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        setStudents(previousStudentData);
        calculatePlacementStats(previousStudentData);
    }, []);

    useEffect(() => {
        if (selectedYear) {
            const filteredStudents = previousStudentData.filter(student => student.graduationYear === selectedYear);
            setStudents(filteredStudents);
            calculatePlacementStats(filteredStudents);
        } else {
            setStudents(previousStudentData);
            calculatePlacementStats(previousStudentData);
        }
    }, [selectedYear]);

    const calculatePlacementStats = (data) => {
        const totalStudents = data.length;
        const placedStudents = data.filter(student => student.placed).length;
        const averageSalary = data.reduce((sum, student) => sum + (student.salary || 0), 0) / placedStudents;

        setPlacementStats({
            totalStudents,
            placedStudents,
            placementPercentage: (placedStudents / totalStudents) * 100,
            averageSalary
        });

        // Company chart data
        const companyData = data.reduce((acc, student) => {
            if (student.company) {
                acc[student.company] = (acc[student.company] || 0) + 1;
            }
            return acc;
        }, {});

        setCompanyChartData({
            labels: Object.keys(companyData),
            datasets: [{
                data: Object.values(companyData),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                ]
            }]
        });

        // Salary distribution chart data
        const salaryRanges = {
            '0-50k': 0,
            '50k-100k': 0,
            '100k-150k': 0,
            '150k+': 0
        };

        data.forEach(student => {
            if (student.salary) {
                if (student.salary < 50000) salaryRanges['0-50k']++;
                else if (student.salary < 100000) salaryRanges['50k-100k']++;
                else if (student.salary < 150000) salaryRanges['100k-150k']++;
                else salaryRanges['150k+']++;
            }
        });

        setSalaryChartData({
            labels: Object.keys(salaryRanges),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(salaryRanges),
                backgroundColor: '#36A2EB'
            }]
        });

        // Placement trend chart data
        const yearlyTrend = data.reduce((acc, student) => {
            if (student.graduationYear) {
                acc[student.graduationYear] = acc[student.graduationYear] || { total: 0, placed: 0 };
                acc[student.graduationYear].total++;
                if (student.placed) acc[student.graduationYear].placed++;
            }
            return acc;
        }, {});

        const years = Object.keys(yearlyTrend).sort();
        setTrendChartData({
            labels: years,
            datasets: [{
                label: 'Placement Percentage',
                data: years.map(year => (yearlyTrend[year].placed / yearlyTrend[year].total) * 100),
                borderColor: '#4BC0C0',
                tension: 0.4
            }]
        });

        setChartOptions({
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                },
                title: {
                    display: true,
                    text: 'Students Placed by Company',
                    fontSize: 16
                }
            }
        });
    };

    const yearOptions = [
        { label: 'All Years', value: null },
        { label: '2023', value: 2023 },
        { label: '2022', value: 2022 },
        { label: '2021', value: 2021 },
    ];

    const salaryBodyTemplate = (rowData) => {
        return rowData.salary ? `$${rowData.salary.toLocaleString()}` : 'N/A';
    };

    const placedBodyTemplate = (rowData) => {
        return rowData.placed ? 'Yes' : 'No';
    };

    return (
        <div>
            <h2>Placement Reports</h2>
            
            <Panel header="Placement Statistics" className="mb-3">
                <div className="grid">
                    <div className="col-12 md:col-3">
                        <h3>Total Students</h3>
                        <p>{placementStats.totalStudents}</p>
                    </div>
                    <div className="col-12 md:col-3">
                        <h3>Placed Students</h3>
                        <p>{placementStats.placedStudents}</p>
                    </div>
                    <div className="col-12 md:col-3">
                        <h3>Placement Percentage</h3>
                        <p>{placementStats.placementPercentage?.toFixed(2)}%</p>
                    </div>
                    <div className="col-12 md:col-3">
                        <h3>Average Salary</h3>
                        <p>${placementStats.averageSalary?.toLocaleString()}</p>
                    </div>
                </div>
            </Panel>

            <div className="grid">
                <div className="col-12 md:col-4">
                    <h3>Students Placed by Company</h3>
                    <Chart type="pie" data={companyChartData} options={chartOptions} />
                </div>
                <div className="col-12 md:col-4">
                    <h3>Salary Distribution</h3>
                    <Chart type="bar" data={salaryChartData} />
                </div>
                <div className="col-12 md:col-4">
                    <h3>Placement Trend</h3>
                    <Chart type="line" data={trendChartData} />
                </div>
            </div>

            <div className="card flex justify-content-end mb-3">
                <Dropdown 
                    value={selectedYear} 
                    options={yearOptions} 
                    onChange={(e) => setSelectedYear(e.value)} 
                    placeholder="Select Year"
                />
            </div>

            <DataTable value={students} paginator rows={10} dataKey="id" className="p-datatable-students">
                <Column field="name" header="Name" sortable />
                <Column field="rollNumber" header="Roll Number" sortable />
                <Column field="graduationYear" header="Graduation Year" sortable />
                <Column field="company" header="Company" sortable />
                <Column field="salary" header="Salary" body={salaryBodyTemplate} sortable />
                <Column field="placed" header="Placed" body={placedBodyTemplate} sortable />
            </DataTable>
        </div>
    );
};

export default Reports;