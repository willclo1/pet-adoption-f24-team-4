import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';

export default function CustomerHomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempProfilePicture, setTempProfilePicture] = useState(null); // Temporary state for dialog preview
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const router = useRouter();
  const { email } = router.query; // Use email from query parameters
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

  const logoutAction = () => {
      router.push(`/loginPage`)
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
          const response = await fetch(`http://localhost:8080/users/email/${email}`); // Updated to fetch by email
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

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button color="inherit">Edit Preferences</Button>
          <Button color="inherit">Adopt a Pet</Button>

          <Avatar
            alt={user.firstName} // Use user's first name for accessibility
            src={profilePicture} // Use the uploaded profile picture here
            sx={{ marginLeft: 2, width: 56, height: 56 }}
            onClick={handleClick}
          />
        </Toolbar>
      </AppBar>
      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Welcome, {user.firstName}</Typography>
        <Typography variant="body1" color="text.secondary">
          Check out the home page!
        </Typography>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>Login Information</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Edit Personal Information</MenuItem>
        <MenuItem onClick={logoutAction}>Logout</MenuItem>
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
