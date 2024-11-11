import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ProfileMenu from './ProfileMenu';

const NavBar = ({ handleNavigation, handleLogout }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
  
    const toggleDrawer = (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setDrawerOpen(open);
    };
  
    const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/recommendationEngine')}>
              <ListItemIcon>
                <PetsIcon />
              </ListItemIcon>
              <ListItemText primary="Adopt" />
            </ListItemButton>
          </ListItem>
  
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/editPreferences')}>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Preferences" />
            </ListItemButton>
          </ListItem>
  
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/viewCenters')}>
              <ListItemIcon>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary="View Centers" />
            </ListItemButton>
          </ListItem>
  
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/meetingHome')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="View Meetings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {list('left')}
          </Drawer>
          <ProfileMenu />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default NavBar;
  