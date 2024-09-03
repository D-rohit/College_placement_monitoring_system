import React from 'react';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const Content = ({ open, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: 3,
        marginLeft: open ? '240px' : '60px',
        transition: 'margin-left 0.3s',
        marginTop: '64px', // Adjust for AppBar height
      }}
    >
      <Outlet>

      </Outlet>
      <div className={`content ${open ? 'shifted':''}`}>
        <PrimeReactProvider>
        {children}
        </PrimeReactProvider>
        

      </div>
    </Box>
  );
};
export default Content;

