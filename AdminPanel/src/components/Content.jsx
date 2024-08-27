import React from 'react';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Content = ({ open }) => {
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
      <Typography variant="h4" gutterBottom>
        Welcome to My Application
      </Typography>
      <Typography paragraph>
        This is the main content area. Click on the menu icon to expand or collapse the sidebar. The layout adjusts accordingly.
      </Typography>
    </Box>
  );
};
export default Content;

