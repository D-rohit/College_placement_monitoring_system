import React from 'react';
import { Box} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const Content = ({ open, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: 3,
        marginLeft: { sm: open ? '240px' : '60px' }, // Responsive margin for different screen sizes
        transition: 'margin-left 0.1s ease-in-out',
        marginTop: '64px', // Adjust for AppBar/header height
      }}
    >
      <Outlet>
      </Outlet>

      <PrimeReactProvider>
      <Box sx={{ flexGrow: 1 }} className={open ? 'shifted' : ''}>
        {/* children prop contains the components or elements that are passed as children.*/}
        {children}
      </Box>
      </PrimeReactProvider>
    </Box>
  );
};
export default Content;