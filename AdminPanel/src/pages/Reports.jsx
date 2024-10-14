import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

const Reports = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [placementStats, setPlacementStats] = useState({});
    const [companyChartData, setCompanyChartData] = useState({});
    const [salaryChartData, setSalaryChartData] = useState({});
    const [trendChartData, setTrendChartData] = useState({});
    const [selectedYear, setSelectedYear] = useState(null);
    const [chartOptions, setChartOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    });

    const yearOptions = [
        { label: 'All Years', value: null },
        { label: '2023', value: 2023 },
        { label: '2022', value: 2022 },
        { label: '2021', value: 2021 },
    ];

    // Dummy data with all columns
    const dummyStudents = [
        { id: 1, name: 'John Doe', rollNumber: 'A001', graduationYear: 2023, company: 'TechCorp', salary: 75000, placed: true, department: 'Computer Science', cgpa: 3.8, placementDate: '2023-03-15', jobRole: 'Software Engineer' },
        { id: 2, name: 'Jane Smith', rollNumber: 'A002', graduationYear: 2023, company: 'DataSoft', salary: 80000, placed: true, department: 'Information Technology', cgpa: 3.9, placementDate: '2023-03-20', jobRole: 'Data Analyst' },
        { id: 3, name: 'Bob Johnson', rollNumber: 'A003', graduationYear: 2022, company: 'WebTech', salary: 70000, placed: true, department: 'Computer Science', cgpa: 3.5, placementDate: '2022-04-10', jobRole: 'Frontend Developer' },
        { id: 4, name: 'Alice Brown', rollNumber: 'A004', graduationYear: 2022, company: null, salary: null, placed: false, department: 'Electronics', cgpa: 3.4, placementDate: null, jobRole: null },
        { id: 5, name: 'Charlie Davis', rollNumber: 'A005', graduationYear: 2021, company: 'TechCorp', salary: 90000, placed: true, department: 'Computer Science', cgpa: 3.7, placementDate: '2021-03-25', jobRole: 'Full Stack Developer' },
    ];

    useEffect(() => {
        // Fetch data from API or use dummy data
        setAllStudents(dummyStudents);
        setFilteredStudents(dummyStudents);
        calculatePlacementStats(dummyStudents);
        updateChartData(dummyStudents);
    }, []);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        let filtered = allStudents; // Use all students by default

        if (year !== null) {
            filtered = allStudents.filter(student => student.graduationYear === year);
        }

        setFilteredStudents(filtered);
        calculatePlacementStats(filtered);
        updateChartData(filtered);
    };

    const calculatePlacementStats = (data) => {
        const totalStudents = data.length;
        const placedStudents = data.filter(student => student.placed).length;
        const averageSalary = data.filter(student => student.salary)
            .reduce((sum, student) => sum + student.salary, 0) / placedStudents;
        const highestSalary = Math.max(...data.filter(student => student.salary).map(student => student.salary));

        setPlacementStats({
            totalStudents,
            placedStudents,
            placementPercentage: (placedStudents / totalStudents) * 100,
            averageSalary,
            highestSalary
        });
    };

    const updateChartData = (data) => {
        // Company chart data
        const companyCount = data.reduce((acc, student) => {
            if (student.company) {
                acc[student.company] = (acc[student.company] || 0) + 1;
            }
            return acc;
        }, {});

        setCompanyChartData({
            labels: Object.keys(companyCount),
            datasets: [{
                data: Object.values(companyCount),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
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

        // Department-wise placement data
        const deptData = data.reduce((acc, student) => {
            if (!acc[student.department]) {
                acc[student.department] = {
                    total: 0,
                    placed: 0
                };
            }
            acc[student.department].total++;
            if (student.placed) acc[student.department].placed++;
            return acc;
        }, {});

        setTrendChartData({
            labels: Object.keys(deptData),
            datasets: [{
                label: 'Total Students',
                data: Object.values(deptData).map(d => d.total),
                backgroundColor: '#FF6384'
            }, {
                label: 'Placed Students',
                data: Object.values(deptData).map(d => d.placed),
                backgroundColor: '#36A2EB'
            }]
        });
    };

    const salaryBodyTemplate = (rowData) => {
        return rowData.salary ? `$${rowData.salary.toLocaleString()}` : 'N/A';
    };

    const placedBodyTemplate = (rowData) => {
        return rowData.placed ? 'Yes' : 'No';
    };

    const dateBodyTemplate = (rowData) => {
        return rowData.placementDate ? new Date(rowData.placementDate).toLocaleDateString() : 'N/A';
    };

    return (
        <div className="p-4">
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="text-2xl font-bold m-0">Placement Reports</h2>
                <Dropdown 
                    value={selectedYear} 
                    options={yearOptions} 
                    onChange={(e) => handleYearChange(e.value)} 
                    placeholder="Select Year"
                    className="w-200px"
                />
            </div>
            
            {/* Stats Card - Single Row */}
            <div className="grid">
                <div className="col-6">
                    <Card className="shadow-1">
                        <div className="flex flex-row justify-content-between align-items-center">
                            <div className="text-center p-3">
                                <h3 className="text-sm mb-2">Total Students</h3>
                                <p className="text-2xl font-bold text-primary">{placementStats.totalStudents}</p>
                            </div>
                            <div className="text-center p-3">
                                <h3 className="text-sm mb-2">Placed Students</h3>
                                <p className="text-2xl font-bold text-green-500">{placementStats.placedStudents}</p>
                            </div>
                            <div className="text-center p-3">
                                <h3 className="text-sm mb-2">Placement %</h3>
                                <p className="text-2xl font-bold text-blue-500">
                                    {placementStats.placementPercentage?.toFixed(1)}%
                                </p>
                            </div>
                            <div className="text-center p-3">
                                <h3 className="text-sm mb-2">Avg. Salary</h3>
                                <p className="text-2xl font-bold text-orange-500">
                                    ${placementStats.averageSalary?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="text-center p-3">
                                <h3 className="text-sm mb-2">Highest Salary</h3>
                                <p className="text-2xl font-bold text-purple-500">
                                    ${placementStats.highestSalary?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid mt-4">
                <div className="col-12 lg:col-4">
                    <Card title="Company Distribution">
                        <Chart type="pie" data={companyChartData} options={chartOptions} style={{ height: '300px' }} />
                    </Card>
                </div>
                <div className="col-12 lg:col-4">
                    <Card title="Salary Distribution">
                        <Chart type="bar" data={salaryChartData} options={chartOptions} style={{ height: '300px' }} />
                    </Card>
                </div>
                <div className="col-12 lg:col-4">
                    <Card title="Department-wise Placement">
                        <Chart type="bar" data={trendChartData} options={chartOptions} style={{ height: '300px' }} />
                    </Card>
                </div>
            </div>

            {/* Data Table */}
            <div className="grid mt-4">
                <div className="col-12">
                    <Card title="Student Details">
                        <DataTable 
                            value={filteredStudents} 
                            paginator 
                            rows={10} 
                            dataKey="id" 
                            className="p-datatable-sm"
                            scrollable 
                            scrollHeight="400px"
                            stripedRows
                        >
                            <Column field="rollNumber" header="Roll Number" sortable />
                            <Column field="name" header="Name" sortable />
                            <Column field="department" header="Department" sortable />
                            <Column field="cgpa" header="CGPA" sortable />
                            <Column field="graduationYear" header="Grad. Year" sortable />
                            <Column field="company" header="Company" sortable />
                            <Column field="jobRole" header="Job Role" sortable />
                            <Column field="salary" header="Salary" body={salaryBodyTemplate} sortable />
                            <Column field="placed" header="Placed" body={placedBodyTemplate} sortable />
                            <Column field="placementDate" header="Placement Date" body={dateBodyTemplate} sortable />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;