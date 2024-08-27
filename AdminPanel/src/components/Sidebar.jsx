// // src/components/Sidebar.jsx
// import React from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import HomeIcon from '@mui/icons-material/Home';
// import InfoIcon from '@mui/icons-material/Info';
// // import BuildIcon from '@mui/icons-material/Build';
// // import ContactMailIcon from '@mui/icons-material/ContactMail';

// const drawerWidth = 240;
// const miniDrawerWidth = 60;

// const Sidebar = ({ open }) => {
//   const menuItems = [
//     { text: 'Home', icon: <HomeIcon /> , path:'/'},
//     { text: 'Students', icon: <InfoIcon /> , path:'/Students'},
//     // { text: 'About', icon: <InfoIcon /> },
//     // { text: 'Services', icon: <BuildIcon /> },
//     // { text: 'Contact', icon: <ContactMailIcon /> },
//   ];

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: open ? drawerWidth : miniDrawerWidth,
//         '& .MuiDrawer-paper': {
//           width: open ? drawerWidth : miniDrawerWidth,
//           overflowX: 'hidden',
//           transition: 'width 0.3s',
//           marginTop: '64px' // Adjust for AppBar height
//         },
//       }}
//     >
//       <Divider />
//       <List>
//         {menuItems.map((item, index) => (
//           <ListItem key={index} disablePadding>
//             <ListItemButton
//               component={Link}
//               to={item.path}
//               sx={{
//                 minHeight: 48,
//                 justifyContent: open ? 'initial' : 'center',
//                 px: 2.5,
//               }}
//             >
//               <ListItemIcon
//                 sx={{
//                   minWidth: 0,
//                   mr: open ? 2 : 'auto',
//                   justifyContent: 'center',
//                 }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Sidebar = ({ open }) => {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
    { text: 'Services', icon: <BuildIcon />, path: '/services' },
    { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' },
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
