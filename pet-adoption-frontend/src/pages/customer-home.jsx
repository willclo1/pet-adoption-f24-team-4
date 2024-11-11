import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';

export default function CustomerHomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();
  const { email } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginInformation = () => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); // Get the token from local storage

    // Check if the token exists before redirecting
    if (token) {
        // Redirect to the Profile page, only passing the email
        router.push(`/Profile?email=${email}`);
    } else {
        console.error('No token found in local storage.'); // Handle the case where no token is found
        // Optionally, you could show an error message to the user or redirect them to the login page
    }
};

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const logoutAction = () => {
    setUser(null);
    localStorage.removeItem('token'); // Remove the token from local storage on logout
    router.push(`/loginPage`);
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
        const token = localStorage.getItem('token'); // Get the token from local storage
        const response = await fetch(`${apiUrl}/user/profile-image/${email}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}` // Add token to headers
          }
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const updatedUser = await response.json();
        if (updatedUser.profilePicture && updatedUser.profilePicture.imageData) {
          setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
        } else {
          setProfilePicture(null);
        }

        setSnackbarOpen(true);
        window.location.reload();
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
    handleCloseDialog();
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        setLoading(true);
        console.log("Fetching user with email:", email);

        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${apiUrl}/users/email/${encodeURIComponent(email)}`, {
            headers: {
              'Authorization': `Bearer ${token}` // Add token to headers
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
          console.log("Fetched user data:", data);
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleStartMatching = () => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); // Get the token from local storage

    // Check if the token exists before redirecting
    if (token) {
        // Store the token in session storage or a context if needed
        // For example: sessionStorage.setItem('token', token);
        
        // Redirect to the recommendation engine page with the email in the URL
        router.push(`/recommendationEngine?email=${email}&userID=${user.id}`);
    } else {
        console.error('No token found in local storage.'); // Handle the case where no token is found
        // Optionally, redirect to the login page or show an error message
    }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }
  const handleEditPreferences = () => {
    const token = localStorage.getItem('token'); 
    if(token){
      router.push(`/EditPreferences?email=${email}&userID=${user.id}`)
    }

  }
    const handleMessage = () => {
      const token = localStorage.getItem('token'); 
      if(token){
        router.push(`/message?email=${email}&userID=${user.id}`)
      }

  }


  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button color="inherit" onClick={handleEditPreferences}>Edit Preferences</Button>
          <Button color="inherit" onClick={handleStartMatching}>Start Matching</Button>
          <Button color="inherit">Adopt a Pet</Button>
          <Avatar
            alt={user.firstName}
            src={profilePicture}
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
        <Box sx={{
        position: 'absolute',
        top: 100,
        left: 20,
        width: 300,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: 'white',
      }}>
        <Typography variant="h6" gutterBottom>Check out your messages!</Typography>
        <Button variant="contained" color="primary" onClick={handleMessage}>
          Send/View Messages
        </Button>
      </Box>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleLoginInformation}>Login Information</MenuItem>
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
            defaultValue={user.firstName}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={user.lastName}
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
            {profilePicture && (
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
        onClose={handleCloseSnackbar}
        message="Profile picture updated successfully"
      />
    </main>
  );
}
