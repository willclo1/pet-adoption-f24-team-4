import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './nav_bar';


export default function CustomerHomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const router = useRouter();
  const { email } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleLoginInformation = () => {

    router.push(`/Profile?email=${email}`);

  }


  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // const handleOpenDialog = () => {
  //   setOpenDialog(true);
  //   handleCloseMenu(); // Close the menu when opening the dialog
  // };

  // const handleViewCenters = () => {
     
  //     router.push(`/ViewCenters`);
    
  // }

  // const logoutAction = () => {
  //   localStorage.setItem('validUser',JSON.stringify(null));
  //   router.push(`/`);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  //   setProfilePictureFile(null); // Reset the file when closing the dialog
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setProfilePictureFile(file); // Store the file for uploading later
  //   }
  // };

  // const handleSave = async () => {
  //   if (profilePictureFile) {
  //     const formData = new FormData();
  //     formData.append('image', profilePictureFile);

  //     try {
  //       const response = await fetch(`${apiUrl}/user/profile-image/${email}`, {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       if (!response.ok ) {
  //         throw new Error('Failed to upload image');
  //       }

  //       // Get the updated user data
  //       const updatedUser = await response.json();

  //       // Update profile picture state
  //       if (updatedUser.profilePicture && updatedUser.profilePicture.imageData) {
  //         setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
  //       } else {
  //         setProfilePicture(null);
  //       }

  //       setSnackbarOpen(true);
  //       window.location.reload(); // Reload to refresh user data
  //     } catch (error) {
  //       console.error('Error uploading profile picture:', error);
  //     }
  //   }
  //   handleCloseDialog();
  // };

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

//   const handleStartMatching = () => {
//     router.push(`/recommendationEngine?email=${email}`);
//   };
//  const handleEditPreferences = () => {
//     router.push(`/EditPreferences?userId=${user.id}&email=${email}`);
//   };


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
      <NavBar />
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button color="inherit" onClick={handleViewCenters}>View Centers</Button>
          <Button color="inherit" onClick={handleEditPreferences}>Edit Preferences</Button>
          <Button color="inherit" onClick={handleStartMatching}>Start Matching</Button>
          <Button color="inherit">Adopt a Pet</Button>
          <Avatar
            alt={user.firstName} // Use user's first name for accessibility
            src={profilePicture} // Use the uploaded profile picture here
            sx={{ marginLeft: 2, width: 56, height: 56 }}
            onClick={handleClick}
          />
        </Toolbar>
      </AppBar> */}

      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Welcome, {user.firstName}</Typography>
        <Typography variant="body1" color="text.secondary">
          Check out the home page!
        </Typography>
      </Stack>

      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleLoginInformation}>Manage My Profile</MenuItem>
        <MenuItem onClick={logoutAction}>Logout</MenuItem>
      </Menu> */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="Profile picture updated successfully"
      />
    </main>
  );
}