import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import "../../../node_modules/primeflex/primeflex.css";

const CompanyRoundTable = ({ companyId }) => {
    const [rounds, setRounds] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [round, setRound] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchRounds();
    }, [companyId]);

    const fetchRounds = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/interviewRound/getByCompanyId/${companyId}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                },
            });
            setRounds(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch rounds.', life: 3000 });
            console.error('Error fetching rounds:', error);
        }
    };

    const openNewRoundDialog = () => {
        setRound({ company_id: companyId,round_name: '', round_date: '', description: '',round_number:0 });
        setIsEditing(false);
        setIsDialogVisible(true);
    };

    const openEditRoundDialog = (roundData) => {
        setRound({ ...roundData });
        setIsEditing(true);
        setIsDialogVisible(true);
    };

    const saveRound = async () => {
        try {
            const token = localStorage.getItem("token");
            if (isEditing) {
                await axios.put(`http://localhost:3000/api/interviewRound/update/${round.round_id}`, round,{
                    headers: {
                        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                    },
                });
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Round updated successfully.', life: 3000 });
            } else {
                await axios.post(`http://localhost:3000/api/interviewRound/insert`, { ...round, company_id: companyId },{
                    headers: {
                        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                    },
                });
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'New round created successfully.', life: 3000 });
            }
            fetchRounds();
            setIsDialogVisible(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save the round.', life: 3000 });
            console.error('Error saving round:', error);
        }
    };

    const deleteRound = async (roundId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/interviewRound/delete/${roundId}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
                },
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Round deleted successfully.', life: 3000 });
            fetchRounds();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete round.', life: 3000 });
            console.error('Error deleting round:', error);
        }
    };

    const onInputNumberChange = (e, name) => {
   

        const val = e.value;
        

        setRound((round) => ({ ...round, [name]: val }));
    };
    const onInputChange = (e, name) => {
        const val =  e.target.value;
 
        setRound((round) => ({ ...round, [name]: val }));
    };


    const deleteButtonTemplate = (rowData) => {
        return <Button icon="pi pi-trash" rounded className="p-button-danger" outlined onClick={() => deleteRound(rowData.round_id)} />;
    };

    const editButtonTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" rounded className="p-button-success" outlined onClick={() => openEditRoundDialog(rowData)} />;
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button" outlined onClick={() => setIsDialogVisible(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button" outlined onClick={saveRound} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div style={{ marginBottom: '10px' }}>
                <Button label="Add New Round" size='small' icon="pi pi-plus" outlined onClick={openNewRoundDialog} />
            </div>

            <DataTable value={rounds} emptyMessage="No rounds found for this company ">
                <Column field="round_number" header="Round Number" />
                <Column field="round_name" header="Round Name" />
                <Column field="round_date" header="Round Date" />
                <Column field="description" header="Round Description" />
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
                        <label htmlFor="round_number">Round Number</label>
                        <InputNumber 
                        id="round_number" value={round?.round_number} onChange={(e) => onInputNumberChange(e, 'round_number')} 
                        />
                    </div>
                <div className="p-field">
                    <label htmlFor="round_name">Round Name</label>
                    <InputText id="round_name" value={round?.round_name} onChange={(e) => onInputChange(e, 'round_name')} />
                </div>
                
                <div className="p-field">
                <label htmlFor="round_date">Round Date</label>
                        <Calendar
                            id="round_date"
                            value={round?.round_date} onChange={(e) => onInputChange(e, 'round_date')} 
                        />
                    </div>
                
                <div className="p-field">
                    <label htmlFor="description">Round Description</label>
                    <InputTextarea id="description" rows={3} value={round?.description} onChange={(e) => onInputChange(e, 'description')} />
                </div>
              
            </Dialog>
        </div>
    );
};

export default CompanyRoundTable;