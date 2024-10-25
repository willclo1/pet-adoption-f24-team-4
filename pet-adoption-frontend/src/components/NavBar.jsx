/*
 * Nav bar is gonna be in almost all the pages so we will just use this to call/create it.
*/

import React, { useState } from 'react';
import { AppBar, 
    Toolbar, 
    Typography, 
    Avatar, 
    Button, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Box, 
    Menu, 
    MenuItem,
    AccountCircleIcon} from '@mui/material';
import { useRouter } from 'next/router';
import PetsIcon from '@mui/icons-material/Pets';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar({user, profilePicture, email }) {
    const router = useRouter();
    const [state, setState] = useState({ left: false });
    const [anchorEl, setAnchorEl] = useState(null);

    const logoutAction = () => {
        localStorage.setItem('validUser',JSON.stringify(null));
        router.push(`/`);
    };
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleNavigation = (path) => {
        router.push(`${path}?email=${email}`);
        handleCloseMenu();
    };

    //Menu item toggle
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        console.log(anchor);
        setState({ ...state, [anchor]: open });
        console.log(state);
    };

    // List items for the menu component
    const drawerList = (anchor) => (
        <Box 
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}} 
            onClick={toggleDrawer(anchor, false)} 
            onKeyDown={toggleDrawer(anchor, false)}
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

    //page content
    return (
        <main>
            {/* app bar functionality */}
            <AppBar position="static">
                <Toolbar>
                    <img src="/Friends_Logo.png" alt="Logo" onClick={() => handleNavigation('/customer-home')} style={{ width: 54, height: 54, cursor: 'pointer'}}/>
                    <Button color='inherit' onClick={toggleDrawer('left', true)}> 
                        <MenuIcon /> 
                    </Button>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Whisker Works</Typography>
                    <Button color="inherit" onClick={() => handleNavigation('/editPreferences')}>Edit Preferences</Button>
                    <Avatar alt={user?.firstName} src={profilePicture} onClick={handleAvatarClick} sx={{ marginLeft: 2, width: 56, height: 56 }} />
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left',false)}> 
                {drawerList('left')} 
            </Drawer>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={() => handleNavigation('/Profile')}>Manage My Profile</MenuItem>
                <MenuItem onClick={logoutAction}>Logout</MenuItem>
            </Menu>
        </ main>
      );
}
