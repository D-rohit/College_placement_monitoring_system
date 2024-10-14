import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PostAddIcon from '@mui/icons-material/PostAdd';
const drawerWidth = 240;
const miniDrawerWidth = 60;

const Sidebar = ({ open }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Companies', icon: <BusinessIcon />, path: '/companies' },
    { text: 'Students', icon: <GroupIcon />, path: '/students' },
    { text: 'Reports', icon: <EqualizerIcon />, path: '/reports' },
    { text: 'Job Posting', icon: <PostAddIcon />, path: '/job-posting' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniDrawerWidth,
          overflowX: 'hidden',
          transition: 'width 0.3s',
          marginTop: '64px' // Adjust for AppBar height
        },
      }}
    >
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
