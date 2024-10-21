/*
 * Nav bar is gonna be in almost all the pages so we will just use this to call/create it.
*/

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import HouseIcon from '@mui/icons-material/House';
import PetsIcon from '@mui/icons-material/Pets';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';

export default function nav_bar() {
    const [state, setState] = useState({ left: false });
    const router = useRouter();
    const [userEmail, setUserEmail] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Function to handle avatar click for menu
    const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // Open dialog for editing personal information
    const handleOpenDialog = () => {
        setOpenDialog(true);
        handleCloseMenu();
    };

    // Close dialog for editing personal information
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setProfilePictureFile(null);
    };

    // Handle file upload for profile picture
    const handlePfFile = (event) => {
    const file = event.target.files[0];
        if (file) {
            setProfilePictureFile(file);
        }
    };

    //Save the profile picture to the backend
    const handleSave = async () => {
        if (profilePictureFile) {
            const formData = new FormData();
            formData.append('image', profilePictureFile);

            try {
            const response = await fetch(`http://localhost:8080/user/profile-image/${userEmail}`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload image');
            const updatedUser = await response.json();
            setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
            setSnackbarOpen(true);
            } catch (error) {
            console.error('Error uploading profile picture:', error);
            }
        }
        handleCloseDialog();
    };

    // Drawer toggle logic
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.keyCode === 'Tab' || event.keyCode === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    // List items for the drawer
    const list = (anchor) => (
        <Box sx={{ width: 250 }} onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
            <List>
            {['Home', 'Adopt', 'Meeting', 'Contact'].map((text) => (
                <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => {
                    const path = text === 'Home' ? '/customer-home' : '/recommendation-engine';
                    router.push({ pathname: path, query: { email: userEmail || '' } });
                }}>
                    <ListItemIcon>
                    {text === 'Home' && <HouseIcon />}
                    {text === 'Adopt' && <PetsIcon />}
                    {text === 'Meeting' && <GroupsIcon />}
                    {text === 'Contact' && <ContactsIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Box>
    );

    return (
        <main>
            <AppBar position="static">
            <Toolbar>
                <Button color='inherit' onClick={toggleDrawer('left', true)}> <MenuIcon /> </Button>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Whisker Works</Typography>
                <Avatar alt={user?.firstName} src={profilePicture} onClick={handleAvatarClick} sx={{ marginLeft: 2, width: 56, height: 56 }} />
            </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}> {list('left')} </Drawer>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={handleOpenDialog}>Edit Personal Information</MenuItem>
            <MenuItem onClick={() => router.push('/loginPage')}>Logout</MenuItem>
            </Menu>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Personal Information</DialogTitle>
            <DialogContent>
                <TextField margin="dense" label="First Name" fullWidth variant="outlined" defaultValue={user?.firstName} />
                <TextField margin="dense" label="Last Name" fullWidth variant="outlined" defaultValue={user?.lastName} />
                <Stack marginTop={2}>
                <Typography variant="body1">Profile Picture</Typography>
                <input accept="image/*" id="profile-picture-upload" type="file" style={{ display: 'none' }} onChange={handlePfFile} />
                <label htmlFor="profile-picture-upload">
                    <Button variant="contained" component="span">Upload Profile Picture</Button>
                </label>
                {profilePicture && <Avatar src={profilePicture} sx={{ width: 56, height: 56, marginTop: 1 }} />}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} message="Profile picture updated successfully" />
        </main>
      );
}
