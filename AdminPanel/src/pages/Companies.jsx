import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import classNames from 'classnames';
import companyData from './Data/CompanyData';
import './Companies.css';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
    const emptyCompany = {
        company_id: null,
        company_name: '',
        email: '',
        phone_number: '',
        no_of_student_placed: 0
    };

    const [companies, setCompanies] = useState([]);
    const [companyDialog, setCompanyDialog] = useState(false);
    const [filterDialog, setFilterDialog] = useState(false); // Filter dialog state
    const [filter, setFilter] = useState({ company_name: '', email: '', phone_number: '', no_of_student_placed: null}); // Filter criteria state
    const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
    const [deleteCompaniesDialog, setDeleteCompaniesDialog] = useState(false);
    const [company, setCompany] = useState(emptyCompany);
    const [selectedCompanies, setSelectedCompanies] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const navigate = useNavigate();

    // const handleViewDetails = (companyId) => {
    //     navigate(`/companies/${companyId}/PlacedStudentsTable`);
    // }

    const handleViewDetails = (companyId, companyName) => {
        navigate(`/companies/${companyId}/MainCompany?companyName=${encodeURIComponent(companyName)}`);
    };
    

    useEffect(() => {
        setCompanies(companyData);
    }, []);

    const openNew = () => {
        setCompany(emptyCompany);
        setSubmitted(false);
        setCompanyDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCompanyDialog(false);
    };

    const hideDeleteCompanyDialog = () => {
        setDeleteCompanyDialog(false);
    };

    const hideDeleteCompaniesDialog = () => {
        setDeleteCompaniesDialog(false);
    };

    const saveCompany = () => {
        setSubmitted(true);

        if (company.company_name.trim()) {
            let _companies = [...companies];
            let _company = {...company};
            if (company.company_id) {
                const index = findIndexById(company.company_id);
                _companies[index] = _company;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
            } else {
                _company.company_id = createId();
                _companies.push(_company);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
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
        let _companies = companies.filter(val => val.company_id !== company.company_id);
        setCompanies(_companies);
        setDeleteCompanyDialog(false);
        setCompany(emptyCompany);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Company Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < companies.length; i++) {
            if (companies[i].company_id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        return Math.floor(Math.random() * 1000);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCompaniesDialog(true);
    };

    const deleteSelectedCompanies = () => {
        let _companies = companies.filter(val => !selectedCompanies.includes(val));
        setCompanies(_companies);
        setDeleteCompaniesDialog(false);
        setSelectedCompanies(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Companies Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _company = {...company};
        _company[`${name}`] = val;
        setCompany(_company);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _company = {...company};
        _company[`${name}`] = val;
        setCompany(_company);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCompanies || !selectedCompanies.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCompany(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCompany(rowData)} />
            </React.Fragment>
        );
    };

    const openFilterDialog = () => {
      setFilterDialog(true);
    };

    const hideFilterDialog = () => {
      setFilterDialog(false);
    };

    const applyFilter = () => {
        // Apply filter to company data
        let filteredData = companyData.filter((comp) => {
            return (
                (filter.company_name === '' || comp.company_name.toLowerCase().includes(filter.company_name.toLowerCase())) &&
                (filter.email === '' || comp.email.toLowerCase().includes(filter.email.toLowerCase())) &&
                (filter.phone_number === '' || comp.phone_number.includes(filter.phone_number)) &&
                (filter.no_of_student_placed === null || comp.no_of_student_placed === filter.no_of_student_placed)
            );
        });
        setCompanies(filteredData);
        setFilterDialog(false);
    };

    const onFilterInputChange = (e, name) => {
      const val = (e.target && e.target.value) || '';
      setFilter({ ...filter, [name]: val });
    };

    const onFilterInputNumberChange = (e, name) => {
      const val = e.value !== null ? e.value : null;
      setFilter({ ...filter, [name]: val });
    };

    const header = (
        <div className="table-header">
            <h2>Manage Companies</h2>
            <div className="search-filter-container">
                <div className="search-input-wrapper">
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search companies..."
                        className="search-input"
                    />
                    <i className="search-icon pi pi-search"></i>
                </div>
                <Button label="Filter" icon="pi pi-filter" className="filter-button" onClick={openFilterDialog} />
            </div>
            <div className="action-buttons">
                <Button label="New" icon="pi pi-plus" className="p-button-outlined p-button-success" onClick={openNew} />
                <Button label="Delete Selected" icon="pi pi-trash" className="p-button-outlined p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCompanies || !selectedCompanies.length} />
                <Button label="Export CSV" icon="pi pi-upload" className="p-button-outlined p-button-help" onClick={exportCSV} />
            </div>
        </div>
    );

    const filterDialogFooter = (
      <React.Fragment>
          <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideFilterDialog} />
          <Button label="Apply" icon="pi pi-check" className="p-button-text" onClick={applyFilter} />
      </React.Fragment>
    );

    const companyDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCompany} />
        </React.Fragment>
    );

    const deleteCompanyDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCompanyDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCompany} />
        </React.Fragment>
    );

    const deleteCompaniesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCompaniesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCompanies} />
        </React.Fragment>
    );

    const studentDetailsBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="View Details" icon="pi pi-eye"  onClick={() => handleViewDetails(rowData.company_id, rowData.company_name)} />
            </React.Fragment>
        );
    };

    return (
        <div className="companies-page">
            <Toast ref={toast} />
            <div className="card">
                {header}
                <div className="table-container">
                    <DataTable
                        ref={dt}
                        value={companies}
                        selection={selectedCompanies}
                        onSelectionChange={(e) => setSelectedCompanies(e.value)}
                        dataKey="company_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
                        globalFilter={globalFilter}
                        responsiveLayout="scroll"
                        emptyMessage="No companies found."
                        className="p-datatable-companies"
                        scrollable
                        scrollHeight="flex"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column field="company_name" header="Name" sortable style={{ minWidth: '150px' }} />
                        <Column field="email" header="Email" sortable style={{ minWidth: '200px' }} />
                        <Column field="phone_number" header="Phone Number" sortable style={{ minWidth: '150px' }} />
                        <Column field="no_of_student_placed" header="Students Placed" sortable style={{ minWidth: '150px' }} />
                        <Column body={studentDetailsBodyTemplate} header="Student Details" />
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '120px' }} />
                    </DataTable>
                </div>
            </div>

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
            </Dialog>

            {/* Filter Dialog */}
            <Dialog visible={filterDialog} style={{ width: '450px' }} header="Filter Companies" modal className="p-fluid" footer={filterDialogFooter} onHide={hideFilterDialog}>
                <div className="field">
                    <label htmlFor="filter_company_name">Company Name</label>
                    <InputText id="filter_company_name" value={filter.company_name} onChange={(e) => onFilterInputChange(e, 'company_name')} />
                </div>
                <div className="field">
                    <label htmlFor="filter_email">Email</label>
                    <InputText id="filter_email" value={filter.email} onChange={(e) => onFilterInputChange(e, 'email')} />
                </div>
                <div className="field">
                    <label htmlFor="filter_phone_number">Phone Number</label>
                    <InputText id="filter_phone_number" value={filter.phone_number} onChange={(e) => onFilterInputChange(e, 'phone_number')} />
                </div>
                <div className="field">
                    <label htmlFor="filter_no_of_student_placed">Students Placed</label>
                    <InputNumber
                        id="filter_no_of_student_placed"
                        value={filter.no_of_student_placed}
                        onValueChange={(e) => onFilterInputNumberChange(e, 'no_of_student_placed')}
                        useGrouping={false}
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteCompanyDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCompanyDialogFooter} onHide={hideDeleteCompanyDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {company && <span>Are you sure you want to delete <b>{company.company_name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCompaniesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCompaniesDialogFooter} onHide={hideDeleteCompaniesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {company && <span>Are you sure you want to delete the selected companies?</span>}
                </div>
            </Dialog>

        </div>
    );
}

export default Companies;