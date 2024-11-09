import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const RoundWiseStudent = ({ companyId }) => {
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null); // State for selected round
    const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
    const [globalFilter, setGlobalFilter] = useState('');

    const fetchRounds = async () => {
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
        } catch (error) {
            console.error("Error fetching rounds:", error);
        }
    };

    const fetchStudentsByRound = async (roundId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/api/roundParticipation/getStudentsByRoundId/${roundId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setFilteredStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
            setFilteredStudents([]); // Clear students on error
        }
    };

    useEffect(() => {
        fetchRounds();
    }, [companyId]);

    useEffect(() => {
        if (selectedRound) {
            fetchStudentsByRound(selectedRound);
        } else {
            setFilteredStudents([]); // Clear students when no round is selected
        }
    }, [selectedRound]);

    const roundOptions = rounds.map((round) => ({
        label: round.round_name,
        value: round.round_id
    }));

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
                rows={5}
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
