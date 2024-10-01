import React, { useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';

export default function CustomerHomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempProfilePicture, setTempProfilePicture] = useState(null); // Temporary state for dialog preview
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

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
            alt="User Name"
            src={profilePicture} // Use the uploaded profile picture here
            sx={{ marginLeft: 2, width: 56, height: 56 }}
            onClick={handleClick}
          />
        </Toolbar>
      </AppBar>
      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Whisker Works</Typography>
        <Typography variant="body1" color="text.secondary">
          Here, you can explore customer-related features and content.
        </Typography>
      </Stack>

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
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
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
