/*
 * Nav bar is gonna be in almost all the pages so we will just use this to call/create it.
*/

import React, { useEffect, useState } from 'react';
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
    Snackbar,
    AccountCircleIcon} from '@mui/material';
import { useRouter } from 'next/router';
import PetsIcon from '@mui/icons-material/Pets';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const router = useRouter();
    const { email } = router.query;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [state, setState] = useState({ left: false });
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    //get user data
    // ** will later be changed to web tokens
    useEffect(() => {
        const fetchUser = async () => {
          if (email) {
            try {
              const response = await fetch(`${apiUrl}/users/email/${email}`);
              if (!response.ok || !(localStorage.getItem('validUser') === `\"${email}\"`)) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();
              setUser(data);
    
              // Set profile picture if exists
              if (data.profilePicture && data.profilePicture.imageData) {
                setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
              }
            } catch (error) {
              console.error('Error fetching user:', error);
              setError('User not found.');
            } finally {
              setLoading(false);
            }
          }
        };
    
        fetchUser();
      }, [email]);

    //Handles the navigation of pages
    const handleStartMatching = () => {
        router.push(`/recommendationEngine?email=${email}`);
    };
    const handleEditPreferences = () => {
        router.push(`/EditPreferences?userId=${user?.id}&email=${email}`);
    };
    const handleViewCenters = () => {
        router.push(`/viewCenters?email=${email}`);
    };
    const handleHomePage = () => {
        router.push(`/customer-home?email=${email}`);
    };
    const handleLoginInformation = () => {
        router.push(`/Profile?email=${email}`);
    };
    const logoutAction = () => {
        localStorage.setItem('validUser',JSON.stringify(null));
        router.push(`/`);
    };
    const handleOpenMeetings = () => {
        router.push(`/meetingHome?email=${email}`);
    };
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false); // Close the Snackbar
    };

    //Menu item toggle
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.keyCode === 'Tab' || event.keyCode === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    // List items for the menu component
    const list = (anchor) => (
        <Box sx={{ width: 250 }} onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
            <List>
            <ListItem disablePadding>
                <ListItemButton onClick={handleStartMatching}>
                <ListItemIcon>
                    <PetsIcon />
                </ListItemIcon>
                <ListItemText primary="Adopt" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={handleEditPreferences}>
                <ListItemIcon>
                    <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Edit Preferences" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={handleViewCenters}>
                <ListItemIcon>
                    <ContactsIcon />
                </ListItemIcon>
                <ListItemText primary="View Centers" />
                </ListItemButton>
            </ListItem>
            </List>

            <ListItem disablePadding>
                <ListItemButton onClick={handleOpenMeetings}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="View Meetings" />
                </ListItemButton>
            </ListItem>
        </Box>
    );

    //page content
    return (
        <main>
            {/* app bar functionality */}
            <AppBar position="static">
                <Toolbar>
                    <img src="/Friends_Logo.png" alt="Logo" onClick={handleHomePage} style={{ width: 54, height: 54, cursor: 'pointer'}}/>
                    <Button color='inherit' onClick={toggleDrawer('left', true)}> <MenuIcon /> </Button>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Whisker Works</Typography>
                    <Button color="inherit" onClick={handleStartMatching}>Start Matching</Button>
                    <Avatar alt={user?.firstName} src={profilePicture} onClick={handleAvatarClick} sx={{ marginLeft: 2, width: 56, height: 56 }} />
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}> {list('left')} </Drawer>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleLoginInformation}>Manage My Profile</MenuItem>
                <MenuItem onClick={logoutAction}>Logout</MenuItem>
            </Menu>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message="Profile picture updated successfully"
            />
        </main>
      );
}
