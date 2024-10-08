import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { dark } from '@mui/material/styles/createPalette';

export default function AdoptionHome() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempProfilePicture, setTempProfilePicture] = useState(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const router = useRouter();
  const { email } = router.query; 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu(); // Close the menu when opening the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTempProfilePicture(null); // Reset the temporary picture when closing
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempProfilePicture(imageUrl); // Set the temporary image for preview
    }
  };

  const handleSave = () => {
    setProfilePicture(tempProfilePicture); // Save the temporary picture to the main profile picture
    handleCloseDialog(); // Close the dialog after saving
    setSnackbarOpen(true); // Open Snackbar
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        try {
          const response = await fetch(`http://localhost:8080/users/email/${email}`); 
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setUser(data); // Set the user data
        } catch (error) {
          console.error('Error fetching user:', error);
          setError('User not found.'); // Update error state
        } finally {
          setLoading(false); // Loading is done
        }
      }
    };

    fetchUser();
  }, [email]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching
  }

  if (error) {
    return <div>{error}</div>; // Show the error message if there's an error
  }

  if (!user) {
    return <div>User not found.</div>; // Show a fallback if user data isn't available
  }

   const handleAddPet = () => {
    const adoptionID = user.center.adoptionID;
    router.push({
      pathname: '/addPet',
      query: { adoptionID, email},
    });
  };

    const handleModifyPet = () => {
    const adoptionID = user.center.adoptionID;
    router.push({
      pathname: '/modifyPet',
      query: { adoptionID },
    });
  };

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button color="inherit">Edit Preferences</Button>
  

          <Avatar
            alt={user.firstName} // Use user's first name for accessibility
            src={profilePicture} // Use the uploaded profile picture here
            sx={{ marginLeft: 2, width: 56, height: 56 }}
            onClick={handleClick}
          />
        </Toolbar>
      </AppBar>
      {/* Add Pets Section */}
      <Box
        sx={{
          width: 300,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#f5f5f5',
          marginTop: 4,
          marginLeft: 4, 
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: '#333' }}>
          Add Pets
        </Typography>
        <Button variant="contained" onClick={handleAddPet} sx={{ backgroundColor: '#1976d2' }}>
          Add Pets
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>Login Information</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Edit Personal Information</MenuItem>
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
            defaultValue={user.firstName} // Pre-fill with existing first name
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={user.lastName} // Pre-fill with existing last name
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
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button variant="contained" component="span">
                Upload Profile Picture
              </Button>
            </label>
            {tempProfilePicture && ( // Show the temporary profile picture preview
              <Avatar
                alt="Profile Picture Preview"
                src={tempProfilePicture}
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

      {/* Snackbar to notify user of success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="Personal information updated successfully"
      />
    </main>
  );

} 
    

