// ExportButton.js
import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

const ExportButton = ({ selected, students }) => {
  const handleExport = () => {
    const dataToExport = selected.length > 0
      ? students.filter((student) => selected.includes(student.id))
      : students;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = selected.length > 0 ? 'students_selected.xlsx' : 'students_all.xlsx';

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(data, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(data);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleExport}
      sx={{ mt: 2 }}
    >
      {selected.length > 0 ? 'Export Selected' : 'Export All'}
    </Button>
  );
};

export default ExportButton;
