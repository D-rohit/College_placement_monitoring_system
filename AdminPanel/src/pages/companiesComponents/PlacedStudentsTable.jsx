import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";

import "primereact/resources/themes/lara-light-indigo/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS for icons
// import './PlacedStudentsTable.css';

const PlacedStudentsTable = ({ companyId, companyName }) => {
  const emptyPlacement = {
    placement_id: null,
    student_id: null,
    company_id: companyId,
    position: "",
    location: "",
    salary: null,
    placement_date: null,
    offer_type: "",
    offer_letter: false,
    core_non_core: "",
  };

  const company_Id = Number(companyId);
  const [originalPlacementsData, setOriginalPlacementsData] = useState([]);
  const [placements, setPlacements] = useState([]); // placements data
  const [students, setStudents] = useState([]); // student data
  const [joinedData, setJoinedData] = useState([]); // Joined data of placements and students
  const [selectedPlacements, setSelectedPlacements] = useState([]); //selected placement records for bulk actions
  const [placementDialog, setPlacementDialog] = useState(false); // visibility of dialog for adding/editing placements
  const [deletePlacementDialog, setDeletePlacementDialog] = useState(false); // visibility of dialog for deleting placements
  const [placement, setPlacement] = useState(emptyPlacement); // holds the current placement object being added or edited.
  const [rollNumberOptions, setRollNumberOptions] = useState([]); // Dropdown options for roll numbers
  const [submitted, setSubmitted] = useState(false); // Tracks if form has been submitted, used for validation.
  const [globalFilter, setGlobalFilter] = useState(""); // Storing value to filter table globally.
  const toast = useRef(null); // showing notifications
  const dt = useRef(null); // access of 'DataTable'

  // Initial data load
  useEffect(() => {
    // setPlacements(placementData);
    getPlacementData();
    getAllStudentData();
  }, []);

  async function getPlacementData() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/placement/getAllPlacements",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
        },
      }
    );

    const placementsData = response.data;
    // console.log(placementsData)
    setPlacements(placementsData);
    setOriginalPlacementsData(placementsData); // Storing original data saparate for letter use
  }
  async function getAllStudentData() {
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
    // console.log(studentData)
    setStudents(studentData);
  }

  // Updates joinedData when placements or company_Id changes
  useEffect(() => {
    // Finding students placed in perticular company
    const filteredPlacements = placements.filter(
      (placement) => placement.company_id === company_Id
    );

    // Join (filteredPlacements + their other details from main student detail tabel)
    const updatedJoinedData = filteredPlacements.map((placement) => {
      const studentDetails = students.find(
        (student) => student.student_id === placement.student_id
      );
      return {
        ...placement,
        ...studentDetails,
      };
    });
    setJoinedData(updatedJoinedData);
  }, [placements, company_Id]);

  useEffect(() => {
    // Generating roll number options for dropdown
    const options = students.map((student) => ({
      label: student.rollNumber,
      value: student.rollNumber,
    }));
    setRollNumberOptions(options);
  }, [students]);

  // Opens dialog/form to add new placement record when clicked on "New" button
  const openNew = () => {
    setPlacement(emptyPlacement);
    setSubmitted(false);
    setPlacementDialog(true);
  };

  // Save new/Edited placement
  const savePlacement = async () => {
    setSubmitted(true);

    let _placements = [...placements];
    let _placement = { ...placement };

    const token = localStorage.getItem("token");
    try {
      if (placement.placement_id) {
        // Updates an existing record
        const response = await axios.put(
          `http://localhost:3000/api/placement/updatePlacementById/${placement.placement_id}`,
          {
            student_id: placement.student_id,
            company_id: placement.company_id,
            position: placement.position,
            location: placement.location,
            salary: placement.salary,
            placement_date: placement.placement_date,
            offer_type: placement.offer_type,
            offer_letter: placement.offer_letter,
            core_non_core: placement.core_non_core,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Placement updated successfully.",
          life: 3000,
        });
      } else {
        // Insert new placement
        const response = await axios.post(
          "http://localhost:3000/api/placement/insertPlacement",
          {
            student_id: placement.student_id,
            company_id: placement.company_id,
            position: placement.position,
            location: placement.location,
            salary: placement.salary,
            placement_date: placement.placement_date,
            offer_type: placement.offer_type,
            offer_letter: placement.offer_letter,
            core_non_core: placement.core_non_core,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Placement added successfully.",
          life: 3000,
        });
      }
      getPlacementData(); // Refresh placement list
      setPlacement(emptyPlacement);
      setPlacementDialog(false);
    } catch (error) {
      console.error("Error saving/updating placement:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save student.",
        life: 3000,
      });
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

  const hideDialog = () => {
    setSubmitted(false);
    setPlacementDialog(false);
  };

  // New/Edit dialog footer
  const placementDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-danger"
        outlined
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        outlined
        onClick={savePlacement}
      />
    </React.Fragment>
  );

  // to delete selected placements
  const deletePlacement = async () => {
    try {
      const token = await localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/placement/deletePlacementById/${placement.placement_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        let _placements = placements.filter(
          (val) => val.placement_id !== placement.placement_id
        );
        setPlacements(_placements);
        setDeletePlacementDialog(false);
        setPlacement(emptyPlacement);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Placement Deleted",
          life: 3000,
        });
      } else {
        // Handle error response
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete placement",
          life: 3000,
        });
      }
    } catch (error) {
      // Handle error during API call
      console.error("Error deleting placement:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete placement",
        life: 3000,
      });
    }
  };

  const hideDeletePlacementDialog = () => {
    setDeletePlacementDialog(false);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _placement = { ...placement };
    _placement[`${name}`] = val;
    // console.log(_placement)
    setPlacement(_placement);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _placement = { ...placement };
    _placement[`${name}`] = val;
    // console.log(_placement)
    setPlacement(_placement);
  };

  const handleCheckbox = (e, name) => {
    const val = e.checked;
    let _placement = { ...placement };
    _placement[`${name}`] = val;
    // console.log(_placement);
    setPlacement(_placement);
  };

  const handleRollNumberChange = (e) => {
    const selectedRollNumber = (e.target && e.target.value) || "";
    const student = students.find(
      (student) => student.rollNumber === selectedRollNumber
    );
    let _placement = { ...placement };
    _placement[`student_id`] = student.student_id;
    _placement[`rollNumber`] = selectedRollNumber;
    // console.log(_placement)
    setPlacement(_placement);
  };

  // Custom body template for the offer letter column
  const offerLetterTemplate = (rowData) => {
    return rowData.offer_letter ? (
      <span style={{ color: "green" }}>Yes</span>
    ) : (
      <span style={{ color: "red" }}>No</span>
    );
  };

  // Actions column in table
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          outlined
          style={{ marginRight: "5px" }}
          onClick={() => editPlacement(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          outlined
          onClick={() => confirmDeletePlacement(rowData)}
        />
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
    <div className="table-header flex justify-content-between flex-row">
      <div className="flex flex-wrap">
        <h2 className="mr-2">Manage Placements</h2>
        <span className="p-input-icon-left">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              style={{ width: "500px" }}
            />
          </IconField>
        </span>
      </div>
      <div className="flex flex-wrap">
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          outlined
          onClick={openNew}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help mr-2"
          outlined
          onClick={exportCSV}
        />
      </div>
    </div>
  );

  const deletePlacementDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-danger"
        outlined
        onClick={hideDeletePlacementDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        outlined
        onClick={deletePlacement}
      />
    </React.Fragment>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        {/* <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar> */}
        <DataTable
          ref={dt}
          value={joinedData}
          selection={selectedPlacements}
          onSelectionChange={(e) => setSelectedPlacements(e.value)}
          dataKey="placement_id"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} placements"
          globalFilter={globalFilter}
          header={header}
          scrollable
          size="small"
          resizableColumns
          tableStyle={{ minWidth: "100%", width: "100%" }}
          showGridlines
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          <Column
            field="rollNumber"
            header="Roll No."
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="name"
            header="Student Name"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="position"
            header="Position"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="location"
            header="Location"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="salary"
            header="Salary"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="placement_date"
            header="Placement Date"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="offer_type"
            header="Offer Type"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="offer_letter"
            header="Offer Letter"
            body={offerLetterTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="core_non_core"
            header="Core/Non-Core"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            header="Actions"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>

      {/* Adding/Editing placement dialog */}
      <Dialog
        visible={placementDialog}
        style={{ width: "450px" }}
        header="Placement Details"
        modal
        className="p-fluid"
        footer={placementDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="companyName">Company Name</label>
          <InputText id="companyName" value={companyName} disabled />
        </div>
        <div className="field">
          <label htmlFor="rollNumber">Roll Number</label>
          <Dropdown
            value={placement.rollNumber}
            options={rollNumberOptions}
            onChange={handleRollNumberChange}
            placeholder="Select Roll Number"
            className={classNames({
              "p-invalid": submitted && !placement.rollNumber,
            })}
          />
          {submitted && !placement.rollNumber && (
            <small className="p-error">Roll Number is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="position">Position</label>
          <InputText
            id="position"
            value={placement.position}
            onChange={(e) => onInputChange(e, "position")}
            required
            className={classNames({
              "p-invalid": submitted && !placement.position,
            })}
            placeholder="Eg. Software Engineer"
          />
          {submitted && !placement.position && (
            <small className="p-error">Position is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <InputText
            id="location"
            value={placement.location}
            onChange={(e) => onInputChange(e, "location")}
            required
            className={classNames({
              "p-invalid": submitted && !placement.location,
            })}
            placeholder="Eg. Mumbai"
          />
        </div>
        <div className="field">
          <label htmlFor="salary">Package</label>
          <InputNumber
            id="salary"
            value={placement.salary}
            onValueChange={(e) => onInputNumberChange(e, "salary")}
            mode="currency"
            currency="INR"
            currencyDisplay="code"
            locale="en-IN"
          />
          {submitted && !placement.salary && (
            <small className="p-error">Package is required.</small>
          )}
        </div>
        <div className="field flex-auto">
          <label htmlFor="placement_date">Placement Date</label>
          <Calendar
            id="placement_date"
            value={placement.placement_date}
            onChange={(e) => onInputChange(e, "placement_date")}
            dateFormat="dd/mm/yy"
            mask="99/99/9999"
            style={{ height: "40px" }}
          />
          {submitted && !placement.placement_date && (
            <small className="p-error">Placement Date is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="offer_type">Offer Type</label>
          <Dropdown
            id="offer_type"
            value={placement.offer_type}
            onChange={(e) => onInputChange(e, "offer_type")}
            options={["Full-Time", "Part-Time", "Internship"]}
            placeholder="Select Offer Type"
          />
        </div>
        <div className="field-checkbox align-items-center">
          <Checkbox
            inputId="offer_letter"
            checked={placement.offer_letter}
            onChange={(e) => handleCheckbox(e, "offer_letter")}
          />
          <label htmlFor="offer_letter">Offer Letter Received</label>
        </div>
        <div className="field">
          <label htmlFor="core_non_core">Core/Non-Core</label>
          <Dropdown
            id="core_non_core"
            value={placement.core_non_core}
            onChange={(e) => onInputChange(e, "core_non_core")}
            options={["core", "non-core"]}
            placeholder="Select Core/Non-Core"
          />
        </div>
      </Dialog>

      <Dialog
        visible={deletePlacementDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deletePlacementDialogFooter}
        onHide={hideDeletePlacementDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {placement && (
            <span>Are you sure you want to delete this placement record?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default PlacedStudentsTable;
