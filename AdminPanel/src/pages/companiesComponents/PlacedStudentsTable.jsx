import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import placementData from '../Data/PlacementData'; // Data of Placement (company + student)
import getallStudent from '../Data/StudentsData';  // Students details
import companyData from '../Data/CompanyData';
import './PlacedStudentsTable';
import { useParams, useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css';  // PrimeIcons CSS for icons
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // PrimeReact theme
import 'primereact/resources/primereact.min.css';  // PrimeReact CSS



const PlacedStudentsTable = () => {

    const emptyPlacement = {
        placement_id: null,
        student_id: null,
        company_id: null,
        position: '',
        location: '',
        salary: null,
        placement_date: null,
        offer_type: '',
        offer_letter: false,
        core_non_core: ''
    };

    const { companyId } = useParams();
    const company_Id= Number(companyId);
    const navigate = useNavigate();
    const Company = companyData.find(comp => comp.company_id === company_Id)
    const CompanyName = Company ? Company.company_name : 'Unknown Company';

    const [placements, setPlacements] = useState([]); // placement records
    const [selectedPlacements, setSelectedPlacements] = useState([]); //selected placement records for bulk actions
    const [placementDialog, setPlacementDialog] = useState(false); // visibility of dialog for adding/editing placements
    const [deletePlacementDialog, setDeletePlacementDialog] = useState(false); // visibility of dialog for deleting placements
    const [placement, setPlacement] = useState(emptyPlacement); // holds the current placement object being added or edited.
    const [submitted, setSubmitted] = useState(false); // Tracks if form has been submitted, used for validation.
    const [globalFilter, setGlobalFilter] = useState(''); // Storing value to filter table globally.
    const toast = useRef(null); // showing notifications
    const dt = useRef(null); // access of 'DataTable'
    
    // Initial data load
    useEffect(() => {
        // fetching this data from an API (getallplacement)
        setPlacements(placementData);
        // console.log("Company ID:", companyId);
    }, []);

    // to navigate back at previous page(companies page)
    const handleBack = () => {
        navigate(-1);
    }

    // Filtering records by companyID (to show it in student tabel for specific company)
    const filteredPlacements = placementData.filter(
        placement => placement.company_id === company_Id
    );

    // Map through the filtered placements and join them with the student data
    const joinedData = filteredPlacements.map(placement => {
        const studentDetails = getallStudent.find(student => student.student_id === placement.student_id);
        return {
            ...placement,
            ...studentDetails
        };
    });

    // Adding new placement (Opens dialog to add new placement, reset form with empty placement object)
    const openNew = () => {
        setPlacement(emptyPlacement);
        setSubmitted(false);
        setPlacementDialog(true);
    };

    // Save/Edit placement
    const savePlacement = () => {
        setSubmitted(true);

        if (placement.position.trim()) {
            let _placements = [...placements];
            let _placement = { ...placement };
            if (placement.placement_id) {
                // Updates an existing record
                const index = findIndexById(placement.placement_id);
                _placements[index] = _placement;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Placement Updated', life: 3000 });
            } else {
                // Creates a new record with random placementID
                _placement.placement_id = createId();
                _placements.push(_placement);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Placement Created', life: 3000 });
            }
            setPlacements(_placements);
            setPlacementDialog(false);
            setPlacement(emptyPlacement);
        }
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < placements.length; i++) {
            if (placements[i].placement_id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPlacementDialog(false);
    };

    // New/Edit dialog footer
    const placementDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePlacement} />
        </React.Fragment>
    );

    // Deletes selected placement from 'placements' array , then shows a success toast.
    const deletePlacement = () => {
        let _placements = placements.filter((val) => val.placement_id !== placement.placement_id);
        setPlacements(_placements);
        setDeletePlacementDialog(false);
        setPlacement(emptyPlacement);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Placement Deleted', life: 3000 });
    };

    const hideDeletePlacementDialog = () => {
        setDeletePlacementDialog(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _placement = { ...placement };
        _placement[`${name}`] = val;
        setPlacement(_placement);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _placement = { ...placement };
        _placement[`${name}`] = val;
        setPlacement(_placement);
    };

    // Toolbar with 'New' and 'Export button'
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" style={{marginRight:'5px'}} onClick={() => editPlacement(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePlacement(rowData)} />
            </React.Fragment>
        );
    };

    // Edit through button
    const editPlacement = (placement) => {
        setPlacement({ ...placement });
        setPlacementDialog(true);
    };

    // delete thorugh button
    const confirmDeletePlacement = (placement) => {
        setPlacement(placement);
        setDeletePlacementDialog(true);
    };

    // Header of student tabel
    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Placements</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deletePlacementDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePlacementDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePlacement} />
        </React.Fragment>
    );

    return (
        
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            
            <div>
                <Button 
                onClick={handleBack}
                className="p-button-primary"
                label="Back to Companies"
                icon="pi pi-arrow-left"
                size="small"
                />
                <h1>{CompanyName}</h1>
            </div>

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={joinedData} selection={selectedPlacements} onSelectionChange={(e) => setSelectedPlacements(e.value)}
                    dataKey="placement_id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} placements"
                    globalFilter={globalFilter} header={header}
                    scrollable scrollDirection="horizontal"
                    size="small"
                    resizableColumns
                    // tableStyle={{ minWidth: '60rem' }}
                    tableStyle={{ minWidth: '100%', width: '100%' }}
                    showGridlines
                    >

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    {/* <Column field="placement_id" header="ID" sortable style={{ minWidth: '30%' }}></Column> */}
                    <Column field="student_id" header="Student ID" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="name" header="Student Name" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="position" header="Position" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="location" header="Location" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="salary" header="Salary" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="placement_date" header="Placement Date" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="offer_type" header="Offer Type" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="offer_letter" header="Offer Letter" sortable style={{ minWidth: '30%' }}></Column>
                    <Column field="core_non_core" header="Core/Non-Core" sortable style={{ minWidth: '30%' }}></Column>
                    <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '30%'}}></Column>
                </DataTable>
            </div>

            {/* Adding/Editing placement dialog */}
            <Dialog visible={placementDialog} style={{ width: '450px' }} header="Placement Details" modal className="p-fluid" footer={placementDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="student_id">Student ID</label>
                    <InputNumber id="student_id" value={placement.student_id} onValueChange={(e) => onInputNumberChange(e, 'student_id')} required autoFocus className={classNames({ 'p-invalid': submitted && !placement.student_id })} />
                    {submitted && !placement.student_id && <small className="p-error">Student ID is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="company_id">Company ID</label>
                    <InputNumber id="company_id" value={placement.company_id} disabled/>
                </div>
                <div className="field">
                    <label htmlFor="position">Position</label>
                    <InputText id="position" value={placement.position} onChange={(e) => onInputChange(e, 'position')} required className={classNames({ 'p-invalid': submitted && !placement.position })} />
                    {submitted && !placement.position && <small className="p-error">Position is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="location">Location</label>
                    <InputText id="location" value={placement.location} onChange={(e) => onInputChange(e, 'location')} required className={classNames({ 'p-invalid': submitted && !placement.location })} />
                    {submitted && !placement.location && <small className="p-error">Location is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="salary">Salary</label>
                    <InputNumber id="salary" value={placement.salary} onValueChange={(e) => onInputNumberChange(e, 'salary')} mode="currency" currency="USD" locale="en-US" />
                </div>
                <div className="field">
                    <label htmlFor="placement_date">Placement Date</label>
                    <Calendar id="placement_date" value={placement.placement_date} onChange={(e) => onInputChange(e, 'placement_date')} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                </div>
                <div className="field">
                    <label htmlFor="offer_type">Offer Type</label>
                    <Dropdown id="offer_type" value={placement.offer_type} onChange={(e) => onInputChange(e, 'offer_type')} options={['Full-Time', 'Part-Time', 'Internship']} placeholder="Select Offer Type" />
                </div>
                <div className="field-checkbox">
                    <Checkbox inputId="offer_letter" checked={placement.offer_letter} onChange={(e) => onInputChange(e, 'offer_letter')} />
                    <label htmlFor="offer_letter">Offer Letter Received</label>
                </div>
                <div className="field">
                    <label htmlFor="core_non_core">Core/Non-Core</label>
                    <Dropdown id="core_non_core" value={placement.core_non_core} onChange={(e) => onInputChange(e, 'core_non_core')} options={['core', 'non-core']} placeholder="Select Core/Non-Core" />
                </div>
            </Dialog>

            <Dialog visible={deletePlacementDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePlacementDialogFooter} onHide={hideDeletePlacementDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {placement && <span>Are you sure you want to delete this placement record?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default PlacedStudentsTable;