import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { InputNumber } from 'primereact/inputnumber';
import '../pages/JobPosting.css';
import axios from 'axios';

const JobPosting = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [students, setStudents] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const dataTableRef = useRef(null);
  const [selectedData, setSelectedData] = useState(null)

  const [emailDialogVisible, setEmailDialogVisible] = useState(false);
  const [emailData, setEmailData] = useState({
    recipients: '',
    subject: 'Job Opportunity',
    body: '',
    attachment: null,
  });

  // State for the application form
  const [applicationForm, setApplicationForm] = useState({
    companyName: '',
    gender: '',
    tenth_percentage: '',
    twelfth_percentage: '',
    cpi_after_7th_sem: '',
    no_of_active_backlog: ''
  });

  useEffect(() => {
    getData();
    getCompanies();
  }, []);
  // console.log("students", students)
  console.log("filteredStudents", filteredStudents)
  // console.log("companyData", companyData)

  async function getData() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/student/getAllStudents",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
        },
      }
    );
    const studentData = response.data;
    setStudents(studentData);
    setFilteredStudents(studentData);
  }

  async function getCompanies() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/company/getAllCompanies",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
        },
      }
    )
    const companyData = response.data;
    setCompanyData(companyData);
  }

  const handleExport = () => {
    if (dataTableRef.current) {
      dataTableRef.current.exportCSV();
    }
  };

  const handleCreateApplication = () => {
    const eligibleStudents = students.filter(student => {
      return (
        (applicationForm.gender === 'all' || (student.gender && student.gender.toLowerCase() === applicationForm.gender)) &&
        (student.tenth_percentage || 0) >= parseFloat(applicationForm.tenth_percentage || 0) &&
        (student.twelfth_percentage || 0) >= parseFloat(applicationForm.twelfth_percentage || 0) &&
        (student.cpi_after_7th_sem || 0) >= parseFloat(applicationForm.cpi_after_7th_sem || 0) &&
        (student.no_of_active_backlog !== null && student.no_of_active_backlog <= parseInt(applicationForm.no_of_active_backlog || 0))
      );
    });

    setFilteredStudents(eligibleStudents);
    // console.log("selectedData",selectedData)
    setIsDialogOpen(false);

    const newFilters = [];
    if (applicationForm.gender && applicationForm.gender !== 'all') {
      newFilters.push({ type: 'gender', value: applicationForm.gender, label: `Gender: ${applicationForm.gender}` });
    }
    if (applicationForm.tenth_percentage) {
      newFilters.push({ type: 'tenth_percentage', value: applicationForm.tenth_percentage, label: `10th %: ≥${applicationForm.tenth_percentage}%` });
    }
    if (applicationForm.twelfth_percentage) {
      newFilters.push({ type: 'twelfth_percentage', value: applicationForm.twelfth_percentage, label: `12th %: ≥${applicationForm.twelfth_percentage}%` });
    }
    if (applicationForm.cpi_after_7th_sem) {
      newFilters.push({ type: 'cpi_after_7th_sem', value: applicationForm.cpi_after_7th_sem, label: `CPI: ≥${applicationForm.cpi_after_7th_sem}` });
    }
    if (applicationForm.no_of_active_backlog) {
      newFilters.push({ type: 'no_of_active_backlog', value: applicationForm.no_of_active_backlog, label: `Backlogs: ≤${applicationForm.no_of_active_backlog}` });
    }

    // Add other filters similarly  
    setActiveFilters(newFilters);
  };

  const removeFilter = (filterToRemove) => {
    const updatedFilters = activeFilters.filter(filter => filter.label !== filterToRemove.label)
    setActiveFilters(updatedFilters);
    // Re-apply remaining filters
    handleCreateApplication();
  };

  const resetForm = () => {
    setApplicationForm({
      companyName: '',
      gender: '',
      tenth_percentage: '',
      twelfth_percentage: '',
      cpi_after_7th_sem: '',
      no_of_active_backlog: ''
    });
  };

  const resetFilters = () => {
    setFilteredStudents(students);
    setActiveFilters([]);
    resetForm();
  };

  const handleFileUpload = (e) => {
    setEmailData({ ...emailData, attachment: e.target.files[0] });
  };

  const handleSendEmail = async () => {

    const recipients = emailData.recipients.split(',').map(email => email.trim());

    // Prepare FormData with common fields
    const formData = new FormData();
    // formData.append('recipients', emailData.recipients);
    formData.append('subject', emailData.subject);
    formData.append('body', emailData.body);
    if (emailData.attachment) {
      formData.append('attachment', emailData.attachment);
    }

    for (const recipient of recipients) {
      try {
        formData.set('recipient', recipient);
        
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/api/send-email', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.data.success) {
          console.error(`Failed to send email to ${recipient}:`, response.data.message);
          alert(`Failed to send email to ${recipient}.`);
        } else {
          console.log(`Email sent successfully to ${recipient}`);
        }
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);
        alert(`An error occurred while sending the email to ${recipient}.`);
      }
    }

    setEmailDialogVisible(false);
    alert('Emails sent to all recipients!');
  };

  const openEmailDialog = () => {
    const recipients = (selectedData && selectedData.length > 0
      ? selectedData.map(student => student.college_email)
      : filteredStudents.map(student => student.college_email)
    );

    if (!recipients.length) {
      alert('No students available to send emails to.');
      return;
    }

    setEmailData({
      ...emailData,
      recipients: recipients.join(', '),
      body: `
        Dear Student,\n\n
        We are pleased to inform you about a job opportunity with ${applicationForm.companyName || 'our partner company'
        }. Please find the details below:\n\n
        Minimum Criteria:\n
        - 10th Percentage: ${applicationForm.tenth_percentage || 'N/A'}\n
        - 12th Percentage: ${applicationForm.twelfth_percentage || 'N/A'}\n
        - CPI (7th Sem): ${applicationForm.cpi_after_7th_sem || 'N/A'}\n
        - Active Backlogs Allowed: ${applicationForm.no_of_active_backlog || 'N/A'}\n\n
        We look forward to your participation.\n\nBest Regards,\nPlacement Team
      `,
    });

    setEmailDialogVisible(true);
  };


  // const handleSendEmail = () => {
  //   // Implement email sending logic here
  //   console.log('Sending emails to selected students');
  //   setFilteredStudents(selectedData && selectedData.length > 0 ? selectedData : filteredStudents);
  // };

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
        <Button label="Send Email" icon="pi pi-envelope" onClick={openEmailDialog} />
        <Button label="Export" icon="pi pi-upload" onClick={() => handleExport()} />
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

      <DataTable ref={dataTableRef} value={filteredStudents} paginator rows={10} dataKey='student_id' filters={{ 'global': { value: searchQuery, matchMode: 'contains' } }} globalFilterFields={['name', 'rollNumber']} emptyMessage="No eligible students found."
        selection={selectedData}
        onSelectionChange={(e) => setSelectedData(e.value)}
      >
        <Column selectionMode="multiple" exportable={false}></Column>
        <Column field="name" header="Name" body={(rowData) => rowData.name || 'N/A'} sortable />
        <Column field="rollNumber" header="Roll Number" sortable />
        <Column field="gender" header="Gender" sortable />
        <Column field="tenth_percentage" header="10th %" body={(rowData) => `${rowData.tenth_percentage}%`} sortable />
        <Column field="twelfth_percentage" header="12th %" body={(rowData) => `${rowData.twelfth_percentage}%`} sortable />
        <Column field="cpi_after_7th_sem" header="CPI 7th Sem" body={(rowData) => rowData.cpi_after_7th_sem} sortable />
        <Column field="no_of_active_backlog" header="Active Backlogs" sortable />
      </DataTable>

      <Dialog
        visible={isDialogOpen}
        onHide={() => setIsDialogOpen(false)}
        header="Create New Application"
        // className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 "
        // breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        style={{ width: '550px' }}
      >
        <div className="grid">
          <div className="field" style={{ marginRight: '3rem' }}>
            <Dropdown
              id="companyName"
              value={applicationForm.companyName}
              options={companyData.map(company => ({ label: company.company_name, value: company.company_id }))}
              onChange={(e) => setApplicationForm({
                ...applicationForm,
                companyName: e.value
              })}
              placeholder="Select Company"
              className="w-20"
              showClear
            />

          </div>

          <div className="field">
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
              className="w-20"
            />
          </div>

          <div className="field">
            <label htmlFor="tenth_percentage" className="font-bold block mb-2">10th Percentage</label>
            <InputNumber
              id="tenth_percentage"
              value={applicationForm.tenth_percentage}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                tenth_percentage: e.value
              })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              suffix="%"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="twelfth_percentage" className="font-bold block mb-2">12th Percentage</label>
            <InputNumber
              id="twelfth_percentage"
              value={applicationForm.twelfth_percentage}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                twelfth_percentage: e.value
              })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              suffix="%"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="cpi_after_7th_sem" className="font-bold block mb-2">Minimum CPI</label>
            <InputNumber
              id="cpi_after_7th_sem"
              value={applicationForm.cpi_after_7th_sem}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                cpi_after_7th_sem: e.value
              })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="no_of_active_backlog" className="font-bold block mb-2">Number of Backlogs</label>
            <InputNumber
              id="no_of_active_backlog"
              value={applicationForm.no_of_active_backlog}
              onValueChange={(e) => setApplicationForm({
                ...applicationForm,
                no_of_active_backlog: e.value
              })}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={0}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-row flex-end" style={{ width: '100%', borderTop: 'solid 1px grey', alignContent: 'end' }}>
          <Button label="Cancel" icon="pi pi-times" onClick={() => resetFilters()} outlined className="p-button-danger" style={{ marginRight: '16rem' }} />
          <Button label="Create" outlined icon="pi pi-check" onClick={handleCreateApplication} autoFocus />
        </div>
      </Dialog>

      {/* email dialog */}
      <Dialog
        visible={emailDialogVisible}
        onHide={() => setEmailDialogVisible(false)}
        header="Draft Email"
        style={{ width: '50vw' }}
      >
        <div className="field flex">
          <label htmlFor="recipients" className="font-bold block mb-2">To</label>
          <InputTextarea
            id="recipients"
            rows={2}
            value={emailData.recipients}
            readOnly
            className="w-full ml-6"
          />
        </div>

        <div className="field flex">
          <label htmlFor="subject" className="font-bold block mb-2">Subject</label>
          <InputText
            id="subject"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            className="w-full ml-2"
          />
        </div>

        <div className="field">
          <InputTextarea
            id="body"
            rows={10}
            value={emailData.body}
            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field">
          <label htmlFor="attachment" className="font-bold block mb-2">Attachments</label>
          <input type="file" id="attachment" onChange={handleFileUpload} />
        </div>

        <div className="flex justify-content-between mt-3">
          <Button label="Cancel" icon="pi pi-times" className="p-button-danger" outlined onClick={() => setEmailDialogVisible(false)} />
          <Button label="Send Email" icon="pi pi-check" className="p-button-success" outlined onClick={handleSendEmail} />
        </div>
      </Dialog>
    </div>
  );
};

export default JobPosting;