import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import classNames from 'classnames';

import companyData from './Data/CompanyData';
import "primeflex/primeflex.css";
import './Companies.css';

const Companies = () => {
    const emptyCompany = {
        company_id: null,
        company_name: '',
        email: '',
        phone_number: '',
        no_of_student_placed: 0,
        comp_category: ''
    };

    const [companies, setCompanies] = useState([]);
    const [companyDialog, setCompanyDialog] = useState(false);
    const [filterDialog, setFilterDialog] = useState(false);
    const [filter, setFilter] = useState({ 
        company_name: '', 
        email: '', 
        phone_number: '', 
        no_of_student_placed: null,
        comp_category: null
    }); // Filter criteria state

    const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
    const [deleteCompaniesDialog, setDeleteCompaniesDialog] = useState(false);
    const [company, setCompany] = useState(emptyCompany);
    const [selectedCompanies, setSelectedCompanies] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCompanies(companyData);
    }, []);

    // 'View Details' navigation 
    const handleViewDetails = (companyId, companyName) => {
        navigate(`/companies/${companyId}/MainCompany?companyName=${encodeURIComponent(companyName)}`);
    };


    // Dialog control methods
    const openNew = () => {
        setCompany(emptyCompany);
        setSubmitted(false);
        setCompanyDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCompanyDialog(false);
    };

    const hideDeleteCompanyDialog = () => setDeleteCompanyDialog(false);

    const hideDeleteCompaniesDialog = () => setDeleteCompaniesDialog(false);

    // for categry dropdown option in filter
    const categories = [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'D', value: 'D' }
    ];

    // CRUD operation
    const saveCompany = () => {
        setSubmitted(true);

        if (company.company_name.trim()) {
            let _companies = [...companies];
            let _company = {...company};

            if (company.company_id) {
                const index = findIndexById(company.company_id);
                _companies[index] = _company;
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Successful', 
                    detail: 'Company Details Updated', 
                    life: 3000 });
            } else {
                _company.company_id = createId();
                _companies.push(_company);
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Successful', 
                    detail: 'New Company Added', 
                    life: 3000 });
            }

            setCompanies(_companies);
            setCompanyDialog(false);
            setCompany(emptyCompany);
        }
    };

    const editCompany = (company) => {
        setCompany({...company});
        setCompanyDialog(true);
    };

    const confirmDeleteCompany = (company) => {
        setCompany(company);
        setDeleteCompanyDialog(true);
    };

    const deleteCompany = () => {
        setCompanies(companies.filter(val => val.company_id !== company.company_id));
        setDeleteCompanyDialog(false);
        setCompany(emptyCompany);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Successful', 
            detail: 'Company Deleted', 
            life: 3000 });
    };

    const findIndexById = (id) => companies.findIndex((comp) => comp.company_id === id);

    const createId = () => Math.floor(Math.random() * 1000);

    const exportCSV = () => dt.current.exportCSV();

    const confirmDeleteSelected = () => setDeleteCompaniesDialog(true);

    const deleteSelectedCompanies = () => {
        setCompanies(companies.filter((val) => !selectedCompanies.includes(val)));
        setDeleteCompaniesDialog(false);
        setSelectedCompanies(null);
        toast.current.show({ 
            severity: 'success', 
            summary: 'Successful', 
            detail: 'Companies Deleted', 
            life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = e.target.value || '';
        setCompany({ ...company, [name]: val });
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setCompany({ ...company, [name]: val });
    };

    const onCategoryChange = (e) => {
        setCompany({ ...company, comp_category: e.value });
    };
    

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" outlined onClick={() => editCompany(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" outlined onClick={() => confirmDeleteCompany(rowData)}/>
            </React.Fragment>
        );
    };

    const studentDetailsBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="View Details" icon="pi pi-eye" outlined onClick={() => handleViewDetails(rowData.company_id, rowData.company_name)} />
            </React.Fragment>
        );
    };

    const openFilterDialog = () => setFilterDialog(true);
    const hideFilterDialog = () => setFilterDialog(false);

    const header = (
        <div className="table-header" class="flex justify-content-between flex-wrap">
            <div class="flex flex-wrap">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" outlined onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger mr-2" outlined onClick={confirmDeleteSelected} disabled={!selectedCompanies || !selectedCompanies.length} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help mr-2" outlined onClick={exportCSV} />
            </div>
            <div class="flex align-items-center flex-wrap">
                <span className="p-input-icon-left">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{width:'500px'}}/>
                    </IconField>
                </span>
                <Button label="Filter" icon="pi pi-filter" className="p-button-secondary ml-2" outlined onClick={openFilterDialog} style={{alignItems:'flex-end'}}/>
            </div>
        </div>
    );

    const applyFilter = () => {
        // Apply filter for no_of_student_placed based on min and max range
        let filteredData = companyData.filter((comp) => {
            return (
                (filter.min_no_of_student_placed === null || comp.no_of_student_placed >= filter.min_no_of_student_placed) &&
                (filter.max_no_of_student_placed === null || comp.no_of_student_placed <= filter.max_no_of_student_placed) &&
                (filter.comp_category === null || comp.comp_category === filter.comp_category)

            );
        });
        setCompanies(filteredData);
        setFilterDialog(false);
    };

    const filterDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button" outlined onClick={hideFilterDialog} />
            <Button label="Apply" icon="pi pi-check" className="p-button" outlined onClick={applyFilter} />
        </React.Fragment>
    );

    const onFilterInputNumberChange = (e, name) => setFilter({ ...filter, [name]: e.value !== null ? e.value : null });

    const onFilterCategoryChange = (e) => {
        setFilter({ ...filter, comp_category: e.value || null });
    };

    const companyDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button" outlined  onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button" outlined onClick={saveCompany} />
        </React.Fragment>
    );

    const deleteCompanyDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button" outlined onClick={hideDeleteCompanyDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button" outlined onClick={deleteCompany} />
        </React.Fragment>
    );

    const deleteCompaniesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button" outlined onClick={hideDeleteCompaniesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button" outlined onClick={deleteSelectedCompanies} />
        </React.Fragment>
    );

    return (
        <div className="companies-page">
            <Toast ref={toast} />
            <h2 className="ml-5" >Manage Companies</h2>
            <div className="card">
                <DataTable
                  ref={dt}
                  value={companies}
                  selection={selectedCompanies}
                  onSelectionChange={(e) => setSelectedCompanies(e.value)}
                  dataKey="company_id" /*identify each row uniquely */
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
                  globalFilter={globalFilter}
                  header={header}
                  tableStyle={{ minWidth: '100%', width: '100%'}}
                  size='small'
                  showGridlines
              >
                  <Column selectionMode="multiple" exportable={false}></Column>
                  <Column field="company_name" header="Company Name" sortable style={{ minWidth: '16rem' }}></Column>
                  <Column field="email" header="Email" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column field="phone_number" header="Phone Number" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column field="comp_category" header="Category" sortable style={{ minWidth: '12rem' }}/>
                  <Column field="no_of_student_placed" header="Students Placed" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column body={studentDetailsBodyTemplate} header="Student Details" style={{ minWidth: '12rem' }}/>
                  <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
              </DataTable>
            </div>

            {/* Add/Edit Company Dialog */}
            <Dialog visible={companyDialog} style={{ width: '450px' }} header="Company Details" modal className="p-fluid" footer={companyDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="company_name">Name</label>
                    <InputText id="company_name" value={company.company_name} onChange={(e) => onInputChange(e, 'company_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !company.company_name })} />
                    {submitted && !company.company_name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={company.email} onChange={(e) => onInputChange(e, 'email')} />
                </div>
                <div className="field">
                    <label htmlFor="phone_number">Phone Number</label>
                    <InputText id="phone_number" value={company.phone_number} onChange={(e) => onInputChange(e, 'phone_number')} />
                </div>
                <div className="field">
                    <label htmlFor="no_of_student_placed">Students Placed</label>
                    <InputNumber id="no_of_student_placed" value={company.no_of_student_placed} onValueChange={(e) => onInputNumberChange(e, 'no_of_student_placed')} />
                </div>
                <div className="field">
                    <label htmlFor="comp_category">Category</label>
                    <Dropdown id="comp_category" value={company.comp_category} options={categories} onChange={onCategoryChange} placeholder="Select a Category" />
                </div>

            </Dialog>

            {/* Filter Dialog */}
            <Dialog visible={filterDialog} style={{ width: '450px' }} header="Filter Companies" modal className="p-fluid" footer={filterDialogFooter} onHide={hideFilterDialog}>
                <div className="field">
                    <label htmlFor="filter_min_students_placed">Min Students Placed</label>
                    <InputNumber
                        id="filter_min_students_placed"
                        value={filter.min_no_of_student_placed}
                        onValueChange={(e) => onFilterInputNumberChange(e, 'min_no_of_student_placed')}
                        useGrouping={false}
                    />
                </div>
                <div className="field">
                    <label htmlFor="filter_max_students_placed">Max Students Placed</label>
                    <InputNumber
                        id="filter_max_students_placed"
                        value={filter.max_no_of_student_placed}
                        onValueChange={(e) => onFilterInputNumberChange(e, 'max_no_of_student_placed')}
                        useGrouping={false}
                    />
                </div>
                <div className="field">
                    <label htmlFor="comp_category">Category</label>
                    <Dropdown 
                    id="comp_category" 
                    value={filter.comp_category} 
                    options={categories} 
                    onChange={(e) => onFilterCategoryChange(e, 'comp_category')} 
                    placeholder="Select a Category" 
                    showClear
                    />
                </div>

            </Dialog>


            {/* Delete single company dialog */}
            <Dialog visible={deleteCompanyDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCompanyDialogFooter} onHide={hideDeleteCompanyDialog}>
                <div className="confirmation-content flex">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem',color:'red'}} />
                    {company && <span  style={{color:'red'}}>Are you sure you want to delete <b>{company.company_name}</b>?</span>}
                </div>
            </Dialog>

            {/* Delete multiple companies dialog */}
            <Dialog visible={deleteCompaniesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCompaniesDialogFooter} onHide={hideDeleteCompaniesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem',color:'red'}} />
                    {company && <span style={{color:'red'}}>Are you sure you want to delete the selected companies?</span>}
                </div>
            </Dialog>

        </div>
    );
}

export default Companies;