import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import companyRoundData from './CompanyRoundData';

const CompanyRoundTable = ({ companyId }) => {
    const [filteredRounds, setFilteredRounds] = useState(companyRoundData.filter((round) => round.company_id === companyId));
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [round, setRound] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const openNewRoundDialog = () => {
        setRound({
            company_id: companyId,
            round_id: '',
            round_name: '',
            round_time: '',
            round_date: '',
            round_description: '',
            remarks: '',
        });
        setIsEditing(false);
        setIsDialogVisible(true);
    };

    const openEditRoundDialog = (roundData) => {
        setRound({ ...roundData });
        setIsEditing(true);
        setIsDialogVisible(true);
    };

    const saveRound = () => {
        if (isEditing) {
            const updatedRounds = filteredRounds.map((r) => (r.round_id === round.round_id ? round : r));
            setFilteredRounds(updatedRounds);
        } else {
            // Generating roundID for new round
            const newRound = { ...round, round_id: `R${filteredRounds.length + 1}` }; 
            setFilteredRounds([...filteredRounds, newRound]);
        }
        setIsDialogVisible(false);
    };

    const deleteRound = (roundId) => {
        const updatedRounds = filteredRounds.filter((r) => r.round_id !== roundId);
        setFilteredRounds(updatedRounds);
    };

    const onInputChange = (e, field) => {
        setRound({ ...round, [field]: e.target.value });
    };

    const deleteButtonTemplate = (rowData) => {
        return <Button icon="pi pi-trash" rounded className="p-button-danger" outlined onClick={() => deleteRound(rowData.round_id)} />;
    };

    const editButtonTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" rounded className="p-button-success" outlined onClick={() => openEditRoundDialog(rowData)} />;
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button" outlined onClick={() => setIsDialogVisible(false)}/>
            <Button label="Save" icon="pi pi-check" className="p-button" outlined onClick={saveRound}/>
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <Button label="Add New Round" size='small' icon="pi pi-plus" outlined onClick={openNewRoundDialog} />
            </div>

            <DataTable value={filteredRounds} emptyMessage="No rounds found for this company ID">
                <Column field="round_id" header="Round ID" />
                <Column field="round_name" header="Round Name" />
                <Column field="round_time" header="Round Time" />
                <Column field="round_date" header="Round Date" />
                <Column field="round_description" header="Round Description" />
                <Column field="remarks" header="Remarks" />
                <Column header="Edit" body={editButtonTemplate} />
                <Column header="Delete" body={deleteButtonTemplate} />
            </DataTable>

            <Dialog
                visible={isDialogVisible}
                style={{ width: '450px' }}
                header={isEditing ? 'Edit Round' : 'Create New Round'}
                modal
                footer={dialogFooter}
                onHide={() => setIsDialogVisible(false)}
            >
                <div className="p-field">
                    <label htmlFor="round_name">Round Name</label>
                    <InputText id="round_name" value={round?.round_name} onChange={(e) => onInputChange(e, 'round_name')} />
                </div>
                <div className="p-field">
                    <label htmlFor="round_time">Round Time</label>
                    <InputText id="round_time" value={round?.round_time} placeholder="Ex- 09:00 AM to 12:30 PM" onChange={(e) => onInputChange(e, 'round_time')} />
                </div>
                <div className="p-field">
                    <label htmlFor="round_date">Round Date</label>
                    <InputText id="round_date" value={round?.round_date} onChange={(e) => onInputChange(e, 'round_date')} />
                </div>
                <div className="p-field">
                    <label htmlFor="round_description">Round Description</label>
                    <InputTextarea id="round_description" rows={3} value={round?.round_description} onChange={(e) => onInputChange(e, 'round_description')} />
                </div>
                <div className="p-field">
                    <label htmlFor="remarks">Remarks</label>
                    <InputTextarea id="remarks" rows={2} value={round?.remarks} onChange={(e) => onInputChange(e, 'remarks')} />
                </div>
            </Dialog>
        </div>
    );
};

export default CompanyRoundTable;

