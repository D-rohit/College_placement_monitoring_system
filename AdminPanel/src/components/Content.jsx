import React from 'react';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

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
        {children}
      </div>
    </Box>
  );
};
export default Content;

