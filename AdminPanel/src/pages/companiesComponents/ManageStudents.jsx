import React, { useState,useRef,useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown'; 
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import * as XLSX from 'xlsx';

import getallStudent from '../Data/StudentsData';
import roundStudentsData from './RoundStudentsData'; // the data where student-rounds are tracked
import companyRoundData from './CompanyRoundData'; // Assuming this holds the round details

const ManageStudents = () => {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(''); // For search functionality

    const [filteredStudents, setFilteredStudents] = useState(getallStudent);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null); // To reset file input

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

            // Extract and normalize roll numbers
            const extractedRollNumbers = jsonData.map((row) =>
                String(row['Roll No.']).trim().toLowerCase()
            ).filter(Boolean);
            console.log(extractedRollNumbers)
            console.log(getallStudent)

            // Filter getallStudent based on the roll numbers
            const matchedStudents = getallStudent.filter((student) =>
                extractedRollNumbers.includes(String(student.rollNumber).trim().toLowerCase())
            );
            if (matchedStudents.length === 0) {
                setErrorMessage('No matching students found.');
            }
            

            // Show matched students or reset to all students if no match
            setFilteredStudents(matchedStudents.length === 0 ? setErrorMessage('No matching students found.') : matchedStudents);
            // setErrorMessage('');

            // Reset file input to allow re-upload
            fileInputRef.current.value = '';
            setLoading(false); // Turn off loading once file is processed
        };

        reader.readAsBinaryString(file);
    };

    // Reset the table and the file input
    const resetTable = () => {
        setFilteredStudents(getallStudent);
        setErrorMessage('');
        fileInputRef.current.value = ''; // Reset file input
    };

    useEffect(() => {
        const latestRound = companyRoundData.reduce((latest, current) => {
            return current.round_id > latest ? current.round_id : latest;
        }, "R000"); // Start with an initial value to compare
        setSelectedRound(latestRound); // Set default as the latest round
    }, []);

    const roundOptions = companyRoundData.map((round) => ({
        label: round.round_name,
        value: round.round_id
    }));

    const onStudentSelect = (e, studentId) => {
        let _selectedStudents = [...selectedStudents];

        if (e.checked) {
            _selectedStudents.push(studentId); // Add student to selection
        } else {
            _selectedStudents = _selectedStudents.filter(id => id !== studentId); // Remove student from selection
        }

        setSelectedStudents(_selectedStudents);
    };

    const addStudentsToSelectedRound = () => {
        const newEntries = selectedStudents.filter((studentId) => {
            return !roundStudentsData.some((entry) => entry.round_id === selectedRound && entry.student_id === studentId);
        }).map((studentId) => ({
            round_id: selectedRound,
            student_id: studentId
        }));

        if (newEntries.length === 0) {
            console.log("No new students to add, all are already in this round.");
        } else {
            console.log("Students added to round:", newEntries);
            roundStudentsData.push(...newEntries);
        }

        setSelectedStudents([]);
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

            {/* Dropdown for selecting round */}
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

            {/* DataTable to show the list of students */}
            <DataTable value={filteredStudents} header={header} globalFilter={globalFilter} paginator rows={5} sortField="name" sortOrder={1}>
                {/* Checkbox column */}
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

            {/* Button to add selected students to the selected round */}
            <Button
                label={`Add Selected Students to ${selectedRound || 'Latest Round'}`}
                onClick={addStudentsToSelectedRound}
                disabled={selectedStudents.length === 0}
                style={{ marginTop: '20px' }}
            />
        </div>
    );
};

export default ManageStudents;
