import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext'; // For global search
import companyRoundData from './CompanyRoundData';
import roundStudentsData from './RoundStudentsData';
import getallStudent from '../Data/StudentsData';

const RoundWiseStudent = ({ companyId }) => {
    
    const [selectedRound, setSelectedRound] = useState(null); // State for selected round
    const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
    const [globalFilter, setGlobalFilter] = useState(''); 
    const filteredRounds = companyRoundData.filter((round) => round.company_id === companyId) 
    const roundOptions = filteredRounds.map((round) => ({
        label: round.round_name,
        value: round.round_id
    }));

    useEffect(() => {
        if (selectedRound) {
            const studentsInRound = roundStudentsData
                .filter((student) => student.round_id === selectedRound)
                .map((student) => student.student_id);

            const filteredStudents = getallStudent.filter((student) =>
                studentsInRound.includes(String(student.student_id))
            );
            setFilteredStudents(filteredStudents);
        } else {
            setFilteredStudents([]); // Clear students when no round is selected
        }
    }, [selectedRound]);

    return (
        <div>
            <div>
                <h2>Select a Round to View Students</h2>
                <Dropdown
                    value={selectedRound}
                    options={roundOptions}
                    onChange={(e) => setSelectedRound(e.value)}
                    placeholder="Select a Round"
                    style={{ marginBottom: '20px', width: '200px' }}
                />
            </div>

            {/* Global Search Input */}
            <div className="p-inputgroup" style={{ marginBottom: '20px' }}>
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                </span>
                <InputText 
                    value={globalFilter} 
                    onChange={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Global Search"
                    style={{ width: '300px' }}
                />
            </div>

            {/* DataTable with filtering */}
            <DataTable
                value={filteredStudents}
                paginator
                rows={10}
                globalFilter={globalFilter}
                emptyMessage="No students found for this round"
                responsiveLayout="scroll"
            >
                <Column field="student_id" header="Student ID" filter filterPlaceholder="Search by ID" />
                <Column field="name" header="Name" filter filterPlaceholder="Search by Name" />
                <Column field="rollNumber" header="Roll Number" filter filterPlaceholder="Search by Roll" />
                <Column field="gender" header="Gender" filter filterPlaceholder="Search by Gender" />
                <Column field="phone_number" header="Phone Number" filter filterPlaceholder="Search by Phone" />
            </DataTable>
        </div>
    );
};

export default RoundWiseStudent;

