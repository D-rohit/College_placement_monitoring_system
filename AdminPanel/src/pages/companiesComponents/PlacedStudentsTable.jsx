// PlacedStudentsTable.js
import React from 'react';
import { Card, CardHeader, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const PlacedStudentsTable = ({ selectedCompany, placedStudents }) => (
  <Card>
    <CardHeader title={selectedCompany.name} subheader="Previously Placed Students" />
    <CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>On / Off campus</TableCell>
              <TableCell>CTC</TableCell>
              <TableCell>Designation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {placedStudents.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.campus}</TableCell>
                <TableCell>{student.ctc}</TableCell>
                <TableCell>{student.designation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default PlacedStudentsTable;