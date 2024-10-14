import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { InputNumber } from 'primereact/inputnumber';
import '../pages/JobPosting.css';

const JobPosting = () => {
  // State for managing the application dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // State for the application form
  const [applicationForm, setApplicationForm] = useState({
    companyName: '',
    gender: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    minimumCPI: '',
    numberOfBacklogs: ''
  });

  // Mock student data - replace with your actual data source
  useEffect(() => {
    // Mock data - replace this with your actual API call
    const mockStudents = [
      {
        id: 1,
        name: 'John Doe',
        rollNumber: '2021001',
        gender: 'Male',
        tenthPercentage: 85.5,
        twelfthPercentage: 88.0,
        cpi: 8.5,
        backlogs: 0,
      },
      {
        id: 2,
        name: 'Jane Smith',
        rollNumber: '2021002',
        gender: 'Female',
        tenthPercentage: 90.0,
        twelfthPercentage: 92.5,
        cpi: 9.0,
        backlogs: 0,
      },
      // Add more mock data as needed
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  const handleCreateApplication = () => {
    const eligibleStudents = students.filter(student => {
      return (
        (applicationForm.gender === 'all' || student.gender.toLowerCase() === applicationForm.gender) &&
        student.tenthPercentage >= parseFloat(applicationForm.tenthPercentage || 0) &&
        student.twelfthPercentage >= parseFloat(applicationForm.twelfthPercentage || 0) &&
        student.cpi >= parseFloat(applicationForm.minimumCPI || 0) &&
        student.backlogs <= parseInt(applicationForm.numberOfBacklogs || 0)
      );
    });

    setFilteredStudents(eligibleStudents);
    setIsDialogOpen(false);

    const newFilters = [];
    if (applicationForm.gender && applicationForm.gender !== 'all') {
      newFilters.push({ type: 'gender', value: applicationForm.gender, label: `Gender: ${applicationForm.gender}` });
    }
    if (applicationForm.tenthPercentage) {
      newFilters.push({ type: 'tenthPercentage', value: applicationForm.tenthPercentage, label: `10th %: ≥${applicationForm.tenthPercentage}%` });
    }
    if (applicationForm.twelfthPercentage) {
      newFilters.push({ type: 'twelfthPercentage', value: applicationForm.twelfthPercentage, label: `12th %: ≥${applicationForm.twelfthPercentage}%` });
    }
    if (applicationForm.minimumCPI) {
      newFilters.push({ type: 'minimumCPI', value: applicationForm.minimumCPI, label: `CPI: ≥${applicationForm.minimumCPI}` });
    }
    if (applicationForm.numberOfBacklogs) {
      newFilters.push({ type: 'numberOfBacklogs', value: applicationForm.numberOfBacklogs, label: `Backlogs: ≤${applicationForm.numberOfBacklogs}` });
    }

    // Add other filters similarly  
    setActiveFilters(newFilters);
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(filters => filters.filter(filter => filter.label !== filterToRemove.label));
    // Re-apply remaining filters
    handleCreateApplication();
  };

  const resetForm = () => {
    setApplicationForm({
      companyName: '',
      gender: '',
      tenthPercentage: '',
      twelfthPercentage: '',
      minimumCPI: '',
      numberOfBacklogs: ''
    });
  };

  const handleSendEmail = () => {
    // Implement email sending logic here
    console.log('Sending emails to selected students');
  };

  return (
    <div className="job-posting-page">
      <h2>Job Posting</h2>
      <div className="search-filter-container">
        <div className="search-input-wrapper">
          <InputText
            type="search"
            placeholder="Search students..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="search-icon pi pi-search"></i>
        </div>
        <Button label="Create Application" icon="pi pi-plus" className="filter-button" onClick={() => setIsDialogOpen(true)} />
      </div>
      <div className="action-buttons">
        <Button label="Send Email" icon="pi pi-envelope" onClick={handleSendEmail} />
        <Button label="Export" icon="pi pi-upload" />
      </div>

      {activeFilters.length > 0 && (
        <div className="applied-filters flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary">
              {filter.label}
              <button
                className="ml-2"
                onClick={() => removeFilter(filter)}
              >
                <i className="pi pi-times"></i>
              </button>
            </Badge>
          ))}
        </div>
      )}

      <DataTable value={filteredStudents} paginator rows={10} dataKey="id"
        filters={{ 'global': { value: searchQuery, matchMode: 'contains' } }}
        globalFilterFields={['name', 'rollNumber']} emptyMessage="No eligible students found.">
        <Column field="name" header="Name" sortable />
        <Column field="rollNumber" header="Roll Number" sortable />
        <Column field="gender" header="Gender" sortable />
        <Column field="tenthPercentage" header="10th %" body={(rowData) => `${rowData.tenthPercentage}%`} sortable />
        <Column field="twelfthPercentage" header="12th %" body={(rowData) => `${rowData.twelfthPercentage}%`} sortable />
        <Column field="cpi" header="CPI" body={(rowData) => rowData.cpi.toFixed(2)} sortable />
        <Column field="backlogs" header="Backlogs" sortable />
      </DataTable>

      <Dialog
        visible={isDialogOpen}
        onHide={() => setIsDialogOpen(false)}
        header="Create New Application"
        className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5"
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        style={{ maxWidth: '550px' }}
      >
        <div className="grid grid-cols-1 gap-4 p-4">
          <div className="field">
            <label htmlFor="companyName" className="font-bold block mb-2">Company Name</label>
            <InputText
              id="companyName"
              value={applicationForm.companyName}
              onChange={(e) => setApplicationForm({
                ...applicationForm,
                companyName: e.target.value
              })}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="gender" className="font-bold block mb-2">Gender</label>
            <Dropdown
              id="gender"
              value={applicationForm.gender}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'All', value: 'all' }
              ]}
              onChange={(e) => setApplicationForm({
                ...applicationForm,
                gender: e.value
              })}
              placeholder="Select gender"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="tenthPercentage" className="font-bold block mb-2">10th Percentage</label>
            <InputNumber
              id="tenthPercentage"
              value={applicationForm.tenthPercentage}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                tenthPercentage: e.value
              })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              suffix="%"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="twelfthPercentage" className="font-bold block mb-2">12th Percentage</label>
            <InputNumber
              id="twelfthPercentage"
              value={applicationForm.twelfthPercentage}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                twelfthPercentage: e.value
              })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              suffix="%"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="minimumCPI" className="font-bold block mb-2">Minimum CPI</label>
            <InputNumber
              id="minimumCPI"
              value={applicationForm.minimumCPI}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                minimumCPI: e.value
              })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="numberOfBacklogs" className="font-bold block mb-2">Number of Backlogs</label>
            <InputNumber
              id="numberOfBacklogs"
              value={applicationForm.numberOfBacklogs}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                numberOfBacklogs: e.value
              })}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={0}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 p-4 border-t border-gray-200">
          <Button label="Cancel" icon="pi pi-times" onClick={() => setIsDialogOpen(false)} className="p-button-text" />
          <Button label="Create" icon="pi pi-check" onClick={handleCreateApplication} autoFocus />
        </div>
      </Dialog>
    </div>
  );
};

export default JobPosting;