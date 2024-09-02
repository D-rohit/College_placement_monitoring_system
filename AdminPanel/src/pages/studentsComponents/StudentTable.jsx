// StudentTable.js
import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const StudentTable = ({ students, selected, tableHeight, handleSelectAllClick, handleClick }) => {
  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: tableHeight, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
          <Typography variant="h6">Student Details</Typography>
          <Box>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
            <IconButton>
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ position: 'sticky', left: 0, zIndex: 2, backgroundColor: 'background.paper' }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < students.length}
                  checked={students.length > 0 && selected.length === students.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all students' }}
                />
              </TableCell>
              <TableCell sx={{ position: 'sticky', left: '48px', zIndex: 2, backgroundColor: 'background.paper' }}>Sr. No</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>10%</TableCell>
              <TableCell>12%</TableCell>
              <TableCell>Diploma</TableCell>
              <TableCell>CPI</TableCell>
              <TableCell>SPI</TableCell>
              <TableCell>College ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => {
              const isItemSelected = isSelected(student.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, student.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={student.id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox" sx={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'background.paper' }}>
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </TableCell>
                  <TableCell component="th" id={labelId} scope="row" sx={{ position: 'sticky', left: '48px', zIndex: 1, backgroundColor: 'background.paper' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.ten}</TableCell>
                  <TableCell>{student.twelve}</TableCell>
                  <TableCell>{student.diploma}</TableCell>
                  <TableCell>{student.cpi}</TableCell>
                  <TableCell>{student.spi}</TableCell>
                  <TableCell>{student.collegeId}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StudentTable;