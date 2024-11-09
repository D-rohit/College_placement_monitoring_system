import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown'; 
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import * as XLSX from 'xlsx';

// Assuming roundStudentsData is still being imported
import roundStudentsData from './RoundStudentsData';

const ManageStudents = ({ companyId }) => {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch students from API
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:3000/api/student/getAllStudents",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const studentData = response.data;
            setStudents(studentData);
            setFilteredStudents(studentData);
        } catch (error) {
            console.error("Error fetching students:", error);
            setErrorMessage("Failed to fetch student data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch rounds from API
    const fetchRounds = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/api/interviewRound/getByCompanyId/${companyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRounds(response.data);
            // Set the latest round by default
            
        } catch (error) {
            console.error("Error fetching rounds:", error);
            setErrorMessage("Failed to fetch round data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchRounds();
        console.log(selectedRound)
    }, [companyId]);

    const handleFileUpload = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (!jsonData.length) {
                setErrorMessage('The Excel file is empty or invalid.');
                return;
            }

            if (!jsonData[0] || !jsonData[0]['Roll No.']) {
                setErrorMessage('The Excel file must contain a column named "Roll No."');
                return;
            }

            const extractedRollNumbers = jsonData.map((row) =>
                String(row['Roll No.']).trim().toLowerCase()
            ).filter(Boolean);

            const matchedStudents = students.filter((student) =>
                extractedRollNumbers.includes(String(student.rollNumber).trim().toLowerCase())
            );

            if (matchedStudents.length === 0) {
                setErrorMessage('No matching students found.');
            }

            setFilteredStudents(matchedStudents.length === 0 ? students : matchedStudents);
            fileInputRef.current.value = '';
            setLoading(false);
        };

        reader.readAsBinaryString(file);
    };

    const resetTable = () => {
        setFilteredStudents(students);
        setErrorMessage('');
        fileInputRef.current.value = '';
    };

    const roundOptions = rounds.map((round) => ({
        label: round.round_name,
        value: round.round_id
    }));

    const onStudentSelect = (e, studentId) => {
        let _selectedStudents = [...selectedStudents];
        if (e.checked) {
            _selectedStudents.push(studentId);
        } else {
            _selectedStudents = _selectedStudents.filter(id => id !== studentId);
        }
        setSelectedStudents(_selectedStudents);
    };

    const addStudentsToSelectedRound = async () => {
        if (selectedStudents.length === 0) {
            console.error("No students selected to add.");
            return;
        }
    
        const token = localStorage.getItem("token");
    
        try {
            for (const studentId of selectedStudents) {
                const data = {
                    round_id: selectedRound,
                    student_id: studentId,
                };
    
                const response = await axios.post(
                    `http://localhost:3000/api/roundParticipation/insert`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                        },
                    }
                );
    
                console.log(`Student ${studentId} added to round ${selectedRound}:`, response.data);
            }
    
            console.log("All students have been added to the selected round.");
            setSelectedStudents([]); // Clear selected students after successful additions
        } catch (error) {
            console.error("Error adding students to the round:", error);
            setErrorMessage("Failed to add some or all students to the round. Please try again later.");
        }
    };
    
    const header = (
        <div className="table-header">
            <h2>Manage Students for Round</h2>
            <span className="p-input-icon-left">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </IconField>
            </span>
                <Button label="Import Excel" icon="pi pi-upload" className="p-button-outlined" onClick={() => fileInputRef.current.click()} />
                <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                    ref={fileInputRef}
                />
                <Button label="Reset Table" icon="pi pi-refresh" className="p-button-outlined" onClick={resetTable} style={{ marginLeft: '10px' }} />
        </div>
    );

    return (
        <div>
            <h2>Add Students to Round</h2>

            <div style={{ marginBottom: '20px' }}>
                <Dropdown
                    value={selectedRound}
                    options={roundOptions}
                    onChange={(e) => setSelectedRound(e.value)}
                    placeholder="Select a Round"
                    style={{ width: '250px' }}
                />
            </div>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {selectedRound!=null && (
                <>
                    <DataTable value={filteredStudents} header={header} globalFilter={globalFilter} paginator rows={5} sortField="name" sortOrder={1}>
                        <Column
                            header="Select"
                            body={(rowData) => (
                                <Checkbox
                                    onChange={(e) => onStudentSelect(e, rowData.student_id)}
                                    checked={selectedStudents.includes(rowData.student_id)}
                                />
                            )}
                            style={{ width: '50px' }}
                        />
                        <Column field="rollNumber" header="Student ID" filter filterPlaceholder="Search by ID" style={{ minWidth: '150px' }} />
                        <Column field="name" header="Student Name" filter filterPlaceholder="Search by Name" style={{ minWidth: '200px' }} />
                        <Column field="phone_number" header="Phone Number" filter filterPlaceholder="Search" style={{ minWidth: '200px' }} />
                        <Column field="college_email" header="Email" filter filterPlaceholder="Search" style={{ minWidth: '200px' }} />
                    </DataTable>

                    <Button
                        label={`Add Selected Students to Round`}
                        onClick={addStudentsToSelectedRound}
                        disabled={selectedStudents.length === 0}
                        style={{ marginTop: '20px' }}
                    />
                </>
            )}
        </div>
    );
};

export default ManageStudents;
