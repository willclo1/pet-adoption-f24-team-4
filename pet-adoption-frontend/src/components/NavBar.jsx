import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Button, Avatar, MenuItem, Menu, Dialog, DialogTitle, DialogContent, Stack, DialogActions, Snackbar, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';

function NavBar () {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const router = useRouter();
    const { email } = router.query;
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
      const fetchUser = async () => {
        if (email) {
          setLoading(true);
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/users/email/${encodeURIComponent(email)}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (!response.ok) {
              if (response.status === 404) {
                setError('User not found.');
                return;
              }
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUser(data);
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

    const toggleDrawer = (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setDrawerOpen(open);
    };

    const handleAvatarClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };
  
    const handleOpenDialog = () => {
      setOpenDialog(true);
      handleCloseMenu();
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
      setProfilePictureFile(null);
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setProfilePictureFile(file);
      }
    };

    const handleSave = async () => {
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('image', profilePictureFile);
  
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile-image/${email}`, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
  
          const updatedUser = await response.json();
          if (updatedUser.profilePicture && updatedUser.profilePicture.imageData) {
            setSnackbarOpen(true);
            window.location.reload();
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      }
      handleCloseDialog();
    };

    const handleLoginInfo = () => {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token'); // Get the token from local storage

      // Check if the token exists before redirecting
      if (token) {
          // Redirect to the Profile page, only passing the email
          router.push(`/Profile?email=${user.emailAddress}`);
      } else {
          console.error('No token found in local storage.'); // Handle the case where no token is found
          // Optionally, you could show an error message to the user or redirect them to the login page
      }
    };

    const handleNavigation = (path) => {
      router.push(`${path}?email=${user.emailAddress}&userID=${user.id}`);
      handleCloseMenu();
    };  

    if (loading) {
      return;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    if (!user) {
      return <div>User not found.</div>;
    }
  
    const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/viewUserPets')}>
              <ListItemIcon>
                <PetsIcon />
              </ListItemIcon>
              <ListItemText primary="Your Pets" />
            </ListItemButton>
          </ListItem>
  
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/EditPreferences')}>
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
  
        </List>
      </Box>
    );
  
    return (
      <main>
        <AppBar position="static" sx={{ padding: 2 }}>
          <Toolbar>
            <img src="/Friends_Logo.png" alt="Logo" onClick={() => handleNavigation('/customer-home')} style={{ width: 60, height: 60, cursor: 'pointer', marginRight: 25, marginLeft: -10}}/>

            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
              <MenuIcon sx={{ fontSize: 30 }}/>
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: 24}}>
              Whisker Works
            </Typography>
            
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginRight: 2, fontSize: 15}}
              onClick={() => handleNavigation('/recommendationEngine')}>
              Start Matching
            </Button>

            <Avatar
              alt={user?.firstName || "User"}
              src={profilePicture}
              sx={{ marginLeft: 2, width: 65, height: 65 }}
              onClick={handleAvatarClick}
            />

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              {list('left')}
            </Drawer>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleLoginInfo}>Edit Account Information</MenuItem>
              <MenuItem onClick={() => { localStorage.removeItem('token'); handleNavigation('/'); }}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </main>
    );
  }
  
  export default NavBar;
  