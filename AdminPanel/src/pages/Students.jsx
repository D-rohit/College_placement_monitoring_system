import  { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Checkbox } from 'primereact/checkbox';
// import studentData from './studentsComponents/Data.jsx';
import './Students.css'; // Import custom CSS

const Students = () => {
    const emptyStudent = {
        student_id: null,
        name: '',
        rollNumber: '',
        personal_email: '',
        college_email: '',
        phone_number: '',
        date_of_birth: null,
        gender: null,
        city: '',
        state: '',
        tenth_percentage: null,
        twelfth_percentage: null,
        cpi_after_8th_sem: null,
        category: null,
        no_of_backlog: null,
        no_of_active_backlog: null,
        remark: '',
        optout: false,
    };
    let studentData={};
    const [students, setStudents] = useState([]);
    const [studentDialog, setStudentDialog] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [deleteStudentsDialog, setDeleteStudentsDialog] = useState(false);
    const [student, setStudent] = useState(emptyStudent);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const tableContainer = useRef(null);
    const [filterDialog, setFilterDialog] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        rollNumber: '',
        gender: null,
        category: null,
        city: '',
        state: '',
        minCPI: null,
        maxCPI: null,
        optout: null
    });
    
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const categoryOptions = [
        { label: 'General', value: 'General' },
        { label: 'OBC', value: 'OBC' },
        { label: 'SC', value: 'SC' },
        { label: 'ST', value: 'ST' },
    ];

    async function getData(){
        
        const token = localStorage.getItem("token");
        studentData=await axios.get(
            "http://localhost:3000/api/student/getAllStudents",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
              },
            }
          )
        studentData=studentData.data
        setStudents(studentData)
    }
    useEffect( () => {
        getData();
    }, []);

    const openNew = () => {
        setStudent(emptyStudent);
        setSubmitted(false);
        setStudentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
    };

    const hideDeleteStudentDialog = () => {
        setDeleteStudentDialog(false);
    };

    const hideDeleteStudentsDialog = () => {
        setDeleteStudentsDialog(false);
    };

    const saveStudent = () => {
        setSubmitted(true);

        if (student.name.trim() && student.rollNumber.trim()) {
            let _students = [...students];
            let _student = { ...student };

            if (student.student_id) {
                const index = findIndexById(student.student_id);
                _students[index] = _student;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
            } else {
                _student.student_id = createId();
                _students.push(_student);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
            }

            setStudents(_students);
            setStudentDialog(false);
            setStudent(emptyStudent);
        }
    };

    const editStudent = (student) => {
        setStudent({ ...student });
        setStudentDialog(true);
    };

    const confirmDeleteStudent = (student) => {
        setStudent(student);
        setDeleteStudentDialog(true);
    };

    const deleteStudent = () => {
        let _students = students.filter((val) => val.student_id !== student.student_id);
        setStudents(_students);
        setDeleteStudentDialog(false);
        setStudent(emptyStudent);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        return students.findIndex((student) => student.student_id === id);
    };

    const createId = () => {
        return students.length ? Math.max(students.map((student) => student.student_id)) + 1 : 1;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteStudentsDialog(true);
    };

    const deleteSelectedStudents = () => {
        let _students = students.filter((val) => !selectedStudents.includes(val));
        setStudents(_students);
        setDeleteStudentsDialog(false);
        setSelectedStudents([]);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        setStudent(prevStudent => ({ ...prevStudent, [name]: val }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value;
        setStudent(prevStudent => ({ ...prevStudent, [name]: val }));
    };

    const onCheckboxChange = (e, student) => {
        const { checked } = e.target;
        setSelectedStudents(prev => checked ? [...prev, student] : prev.filter(s => s !== student));
    };

    const applyFilters = () => {
        let filteredStudents = studentData.filter(student => {
            return (
                (filters.name ? student.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                (filters.rollNumber ? student.rollNumber.includes(filters.rollNumber) : true) &&
                (filters.gender ? student.gender === filters.gender : true) &&
                (filters.category ? student.category === filters.category : true) &&
                (filters.city ? student.city.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
                (filters.state ? student.state.toLowerCase().includes(filters.state.toLowerCase()) : true) &&
                (filters.minCPI ? student.cpi_after_8th_sem >= filters.minCPI : true) &&
                (filters.maxCPI ? student.cpi_after_8th_sem <= filters.maxCPI : true) &&
                (filters.optout !== null ? student.optout === filters.optout : true)
            );
        });
        setStudents(filteredStudents);
        setFilterDialog(false);
    };
    const resetFilters = () => {
        setFilters({
            name: '',
            rollNumber: '',
            gender: null,
            category: null,
            city: '',
            state: '',
            minCPI: null,
            maxCPI: null,
            optout: null
        });
        setStudents(studentData);
        setFilterDialog(false);
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-3">Manage Students</h4>
            <span className="p-input-icon-left">
                
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    style={{ width: '500px'}}
                />
                <Button 
                    icon="pi pi-filter" 
                    className="p-button-rounded p-button-info ml-2" 
                    onClick={() => setFilterDialog(true)}
                />
            </span>
        </div>
    );
    const filterDialogFooter = (
        <>
            <Button label="Apply" icon="pi pi-check" onClick={applyFilters} />
            <Button label="Reset" icon="pi pi-times" onClick={resetFilters} className="p-button-secondary" />
        </>
    );
    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedStudents.length}
                />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </>
        );
    };


    const dobBodyTemplate = (rowData) => {
        return new Date(rowData.date_of_birth).toLocaleDateString();
    };

    const percentageBodyTemplate = (rowData, field) => {
        return `${rowData[field]}%`;
    };

    const optoutBodyTemplate = (rowData) => {
        return (
            <Tag
                value={rowData.optout ? 'Opted Out' : 'Available'}
                severity={rowData.optout ? 'danger' : 'success'}
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editStudent(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteStudent(rowData)} />
            </>
        );
    };

   
    const studentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveStudent} />
        </>
    );

    const deleteStudentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStudentDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteStudent} />
        </>
    );

    const deleteStudentsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStudentsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedStudents} />
        </>
    );
    
    return (
        <div>
            <h2>Students</h2>
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} />
            {/* <div className="p-d-flex p-jc-between">
                <Button icon="pi pi-chevron-left" className="p-button-rounded p-button-info" onClick={scrollLeft} />
                <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" onClick={scrollRight} />
            </div> */}
            <div ref={tableContainer} className="table-container">
                <DataTable
                    ref={dt}
                    value={students}
                    selection={selectedStudents}
                    onSelectionChange={(e) => setSelectedStudents(e.value)}
                    dataKey="student_id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    className="datatable-scroll"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="name" header="Name" />
                    <Column field="rollNumber" header="Roll Number" />
                    <Column field="personal_email" header="Personal Email" />
                    <Column field="college_email" header="College Email" />
                    <Column field="phone_number" header="Phone Number" />
                    <Column field="date_of_birth" header="Date of Birth" body={dobBodyTemplate} />
                    <Column field="gender" header="Gender" body={(rowData) => rowData.gender} />
                    <Column field="city" header="City" />
                    <Column field="state" header="State" />
                    <Column field="tenth_percentage" header="10th Percentage" body={(rowData) => percentageBodyTemplate(rowData, 'tenth_percentage')} />
                    <Column field="twelfth_percentage" header="12th Percentage" body={(rowData) => percentageBodyTemplate(rowData, 'twelfth_percentage')} />
                    <Column field="cpi_after_8th_sem" header="CPI after 8th Sem" body={(rowData) => percentageBodyTemplate(rowData, 'cpi_after_8th_sem')} />
                    <Column field="category" header="Category" body={(rowData) => rowData.category} />
                    <Column field="no_of_backlog" header="No of Backlogs" body={(rowData) => rowData.no_of_backlog} />
                    <Column field="no_of_active_backlog" header="No of Active Backlogs" body={(rowData) => rowData.no_of_active_backlog} />
                    <Column field="remark" header="Remark" />
                    <Column field="optout" header="Optout" body={optoutBodyTemplate} />
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
            </div>
            <Dialog visible={studentDialog} style={{ width: '450px' }} header="Student Details" modal footer={studentDialogFooter} onHide={hideDialog}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={student.name} onChange={(e) => onInputChange(e, 'name')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="rollNumber">Roll Number</label>
                        <InputText id="rollNumber" value={student.rollNumber} onChange={(e) => onInputChange(e, 'rollNumber')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="personal_email">Personal Email</label>
                        <InputText id="personal_email" value={student.personal_email} onChange={(e) => onInputChange(e, 'personal_email')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="college_email">College Email</label>
                        <InputText id="college_email" value={student.college_email} onChange={(e) => onInputChange(e, 'college_email')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="phone_number">Phone Number</label>
                        <InputText id="phone_number" value={student.phone_number} onChange={(e) => onInputChange(e, 'phone_number')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="date_of_birth">Date of Birth</label>
                        <Calendar id="date_of_birth" value={student.date_of_birth} onChange={(e) => onInputChange(e, 'date_of_birth')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="gender">Gender</label>
                        <Dropdown id="gender" value={student.gender} options={genderOptions} onChange={(e) => onInputChange(e, 'gender')} placeholder="Select Gender" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="city">City</label>
                        <InputText id="city" value={student.city} onChange={(e) => onInputChange(e, 'city')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="state">State</label>
                        <InputText id="state" value={student.state} onChange={(e) => onInputChange(e, 'state')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="tenth_percentage">10th Percentage</label>
                        <InputNumber id="tenth_percentage" value={student.tenth_percentage} onValueChange={(e) => onInputNumberChange(e, 'tenth_percentage')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="twelfth_percentage">12th Percentage</label>
                        <InputNumber id="twelfth_percentage" value={student.twelfth_percentage} onValueChange={(e) => onInputNumberChange(e, 'twelfth_percentage')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="cpi_after_8th_sem">CPI after 8th Sem</label>
                        <InputNumber id="cpi_after_8th_sem" value={student.cpi_after_8th_sem} onValueChange={(e) => onInputNumberChange(e, 'cpi_after_8th_sem')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="category">Category</label>
                        <Dropdown id="category" value={student.category} options={categoryOptions} onChange={(e) => onInputChange(e, 'category')} placeholder="Select Category" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="no_of_backlog">No of Backlogs</label>
                        <InputNumber id="no_of_backlog" value={student.no_of_backlog} onValueChange={(e) => onInputNumberChange(e, 'no_of_backlog')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="no_of_active_backlog">No of Active Backlogs</label>
                        <InputNumber id="no_of_active_backlog" value={student.no_of_active_backlog} onValueChange={(e) => onInputNumberChange(e, 'no_of_active_backlog')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="remark">Remark</label>
                        <InputText id="remark" value={student.remark} onChange={(e) => onInputChange(e, 'remark')} />
                    </div>
                    <div className="p-field">
                        <Checkbox id="optout" checked={student.optout} onChange={(e) => onInputChange(e, 'optout')} />
                        <label htmlFor="optout">Optout</label>
                    </div>
                </div>
            </Dialog>
            <Dialog visible={deleteStudentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentDialogFooter} onHide={hideDeleteStudentDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {student && <span>Are you sure you want to delete <b>{student.name}</b>?</span>}
                </div>
            </Dialog>
            <Dialog visible={deleteStudentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentsDialogFooter} onHide={hideDeleteStudentsDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedStudents.length > 0 && <span>Are you sure you want to delete the selected students?</span>}
                </div>
            </Dialog>
            <Dialog 
                header="Filter Students" 
                visible={filterDialog} 
                style={{ width: '30vw' }} 
                onHide={() => setFilterDialog(false)}
                footer={filterDialogFooter}
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText 
                            id="name" 
                            value={filters.name} 
                            onChange={(e) => setFilters({...filters, name: e.target.value})} 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="rollNumber">Roll Number</label>
                        <InputText 
                            id="rollNumber" 
                            value={filters.rollNumber} 
                            onChange={(e) => setFilters({...filters, rollNumber: e.target.value})} 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="gender">Gender</label>
                        <Dropdown 
                            id="gender" 
                            value={filters.gender} 
                            options={genderOptions} 
                            onChange={(e) => setFilters({...filters, gender: e.value})} 
                            placeholder="Select Gender" 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="category">Category</label>
                        <Dropdown 
                            id="category" 
                            value={filters.category} 
                            options={categoryOptions} 
                            onChange={(e) => setFilters({...filters, category: e.value})} 
                            placeholder="Select Category" 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="city">City</label>
                        <InputText 
                            id="city" 
                            value={filters.city} 
                            onChange={(e) => setFilters({...filters, city: e.target.value})} 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="state">State</label>
                        <InputText 
                            id="state" 
                            value={filters.state} 
                            onChange={(e) => setFilters({...filters, state: e.target.value})} 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="minCPI">Minimum CPI</label>
                        <InputNumber 
                            id="minCPI" 
                            value={filters.minCPI} 
                            onValueChange={(e) => setFilters({...filters, minCPI: e.value})} 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="maxCPI">Maximum CPI</label>
                        <InputNumber 
                            id="maxCPI" 
                            value={filters.maxCPI} 
                            onValueChange={(e) => setFilters({...filters, maxCPI: e.value})} 
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="optout">Optout</label>
                        <Dropdown 
                            id="optout" 
                            value={filters.optout} 
                            options={[
                                {label: 'Yes', value: true},
                                {label: 'No', value: false}
                            ]} 
                            onChange={(e) => setFilters({...filters, optout: e.value})} 
                            placeholder="Select Optout Status" 
                        />
                    </div>
                </div>
            </Dialog>

        </div>
        
    );
};

export default Students;

