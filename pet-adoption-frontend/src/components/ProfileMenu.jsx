import React, { useState } from 'react';
import { Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Stack, Typography } from '@mui/material';

export default function ProfileMenu({ user, profilePicture, setProfilePicture, apiUrl, email, handleLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfilePictureFile(null);
  };
  const handleFileChange = (event) => setProfilePictureFile(event.target.files[0]);

  const handleSave = async () => {
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append('image', profilePictureFile);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/user/profile-image/${email}`, {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${token}` }
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

  return (
    <>
      <Avatar alt={user.firstName} src={profilePicture} onClick={handleClick} sx={{ cursor: 'pointer', width: 56, height: 56 }} />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenDialog}>Edit Personal Information</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Personal Information</DialogTitle>
        <DialogContent>
          <TextField label="First Name" defaultValue={user.firstName} fullWidth variant="outlined" margin="dense" />
          <TextField label="Last Name" defaultValue={user.lastName} fullWidth variant="outlined" margin="dense" />
          <Stack marginTop={2}>
            <Typography>Profile Picture</Typography>
            <input accept="image/*" id="profile-upload" type="file" hidden onChange={handleFileChange} />
            <label htmlFor="profile-upload">
              <Button variant="contained" component="span">Upload Profile Picture</Button>
            </label>
            {profilePicture && <Avatar src={profilePicture} sx={{ width: 56, height: 56, mt: 1 }} />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} message="Profile picture updated successfully" />
    </>
  );
}
