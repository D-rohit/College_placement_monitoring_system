// CompanyTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const CompanyTable = ({ companies, handleViewDetails }) => (
  <Paper sx={{ mb: 2 }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr No.</TableCell>
            <TableCell>Company Name</TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Open positions</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company, index) => (
            <TableRow key={company.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.industry}</TableCell>
              <TableCell>{company.openPositions}</TableCell>
              <TableCell>
                <Typography color="success.main">{company.status}</Typography>
              </TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleViewDetails(company)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default CompanyTable;