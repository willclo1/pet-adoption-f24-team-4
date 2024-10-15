import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Drawer, ListItem, List, ListItemText, ListItemButton, Box, ListItemIcon, Card, CardMedia, CardActions, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar} from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useRouter } from 'next/router';

export default function recommendationEnginePage() {

  const [state, setState] = useState({ left: false });
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  //tinder like cards variables
  const [profilePicture, setProfilePicture] = useState('default-image-url.jpg');
  const [isLiked, setIsLiked] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState(null);
    
  //email functionality
  useEffect(() => {
    if(router.isReady) {
      const { email } = router.query;
      if(email) {
        console.log('Tracking user email');
        setUserEmail(email);
      }
    }
  }, [router.isReady, router.query]);

  //side bar
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.keyCode === 'Tab' || event.keyCode === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
    sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Home', 'Adopt', 'Meeting', 'Contact'].map((text, index) => (
          <ListItem key={text} disablePadding>
            {/* possibly need to fix this adding redirection to other pages */}
            <ListItemButton onClick={() => {
              const path = text === 'Home'? '/customer-home' : '/recommendation-engine'; //TODO: fix this to actually go back to user home based on email retrieval

              router.push({
                pathname: path,
                query: { email: userEmail || ''},
              })
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

  //handle yes or no button
  const handleYes = () => {
    setIsLiked(true);
    // TODO: call backend API to update user's status
    // and update preferences
  };
  const handleNo = () => {
    setIsLiked(false);
    // TODO: call backend API to update user's status
  };

  //get users data
  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/users/email/${email}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUser(data);
      if (data.profilePicture?.imageData) {
        setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfilePictureFile(null);
  }

  const handlePfFile = () => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  }

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

  const handleLogout = () => {
    setUser(null);
    router.push('/loginPage');
  };

  return (
      <main>
        <AppBar position="static">
          <Toolbar>
            {/* Menu items */}
            <Button color='inherit' onClick={toggleDrawer('left', true)}> <MenuIcon /> </Button>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Whisker Works
            </Typography>

            <Avatar 
              alt={user?.firstName}
              src={profilePicture} 
              onClick={handleAvatarClick} 
              sx={{ marginLeft: 2, width: 56, height: 56 }} 
            />
          </Toolbar>
        </AppBar>

        {/* profile avatar comps*/}

        <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}> {list('left')} </Drawer>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleOpenDialog}>Edit Personal Information</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Personal Information</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={user?.firstName}
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={user?.lastName}
            />
            <TextField
              margin="dense"
              label="Address"
              type="text"
              fullWidth
              variant="outlined"
            />
            <Stack marginTop={2}>
              <Typography variant="body1">Profile Picture</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handlePfFile}
              />
              <label htmlFor="profile-picture-upload">
                <Button variant="contained" component="span">
                  Upload Profile Picture
                </Button>
              </label>
              {profilePicture && ( // Show the profile picture preview
                <Avatar
                  alt="Profile Picture Preview"
                  src={profilePicture}
                  sx={{ width: 56, height: 56, marginTop: 1 }}
                />
              )}
            </Stack>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Profile picture updated successfully"
      />

        <Stack sx={{ paddingTop: 5 }} alignItems="center" gap={2}>
          <Typography variant="h3">Start Matching!</Typography>
          <Typography variant="body1" color="text.secondary">
            Adopt Now :D
          </Typography>

          {/* TODO: Fetch pet data from backend */}
          {/* Cards + Yes/No */}
          <Card sx={{ maxWidth: 600 }}>
            <CardMedia
              component="img"
              alt="Pet Image"
              height="500"
              width="400"
              image={profilePicture}
              sx={{ objectFit: 'cover' }}
            />
            <CardActions sx={{ justifyContent: 'space-between'}}>
              <Button 
              size="large" 
              color="primary" 
              onClick={handleYes}
              startIcon={<CheckCircleIcon sx={{ fontSize: 60}}/>}>
              </Button>
              <Button 
              size="large" 
              color="secondary" 
              onClick={handleNo}
              startIcon={<CancelIcon sx={{ fontSize: 60}}/>}>
              </Button>
            </CardActions>
          </Card>

          {isLiked !== null && (
            <Typography variant="h5" sx={{ marginTop: 5 }}>
              {isLiked? 'You liked this pet!' : 'You disliked this pet.'}
            </Typography>
          )}
        </Stack>
    </main>
  );
}