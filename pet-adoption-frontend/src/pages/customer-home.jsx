import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar } from '@mui/material';
import { useRouter } from 'next/router';

export default function CustomerHomePage() {
  const router = useRouter();
  const {id} = router.query;
  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:8080/users/${id}`);
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
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
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
            alt="User Name"
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
    // Hello
    
  );
}
