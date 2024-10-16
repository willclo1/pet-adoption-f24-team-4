import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { red } from '@mui/material/colors';
import config from '@/config/config';

export default function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();
  const { email } = router.query; // Use email from query parameters
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [currentPassword, setCurrentPassowrd] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [passwordMessgae,setPasswordMessage] = useState('');
  const [passColor, setPassColor] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file); // Store the file for uploading later
    }
  };

  const updateProfilePicture = (newPictureUrl) => {
    setProfilePicture(newPictureUrl);
  };

  const deleteAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://${config.API_URL}/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },


        body: JSON.stringify({ email: email, password: password })
      });

      if (!response.ok) {
          throw new Error("Bad network response");
      }
      const result = await response.json();
      
      if(response.status == 200){
          console.log('WE LIKE FOTNITE')
      }
      } catch (error) {
      console.error("Error logging in: ", error);
      //setMessage("NOOB");
      }
      router.push(`/`);


  }

  const changePassword = async (e) => {
    e.preventDefault();
    console.log('LKJSDN');
    console.log(currentPassword);

    if(currentPassword == password && newPassword != null){
      setPassword(newPassword);
      console.log('YOur new Password is:' +newPassword);
      try {
        const response = await fetch(`http://${config.API_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
  
  
          body: JSON.stringify({ email: email, password: newPassword })
        });
  
        if (!response.ok) {
            throw new Error("Bad network response");
        }
        const result = await response.json();
        
        if(response.status == 200){
          setPassColor('green')
          setPasswordMessage('Password Successfully Changed');
            console.log('WE LIKE FOTNITE')
        }
        } catch (error) {
        console.error("Error logging in: ", error);
        //setMessage("NOOB");
        }
    }
    else{
      setPassColor('red');
      setPasswordMessage('Please Enter the Correct Password');

    }

  }


  const handleSave = async () => {
    
    console.log('WEHIWRIF');
        //console.log(updatedUser);
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append('image', profilePictureFile);
      
      try {
        const response = await fetch(`http://${config.API_URL}/user/profile-image/${email}`, {
          method: 'POST',
          body: formData,
        });
      
        const reponse = await fetch(`http://${config.API_URL}/users/email/${email}`); // Updated to fetch by email
          
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        // Get the updated user data
        const updatedUser = await reponse.json();
        console.log('WEHIWRIF');
        console.log(updatedUser);

        // Update profile picture state
        if (updatedUser.profilePicture && updatedUser.profilePicture.imageData) {
          setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
        } else {
          setProfilePicture(null);
        }
        
        setSnackbarOpen(true);
        window.location.reload(); // Reload to refresh user data
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  
  };

  useEffect(() => {
    const fetchUser = async () => {
      
      if (email) {
        try {
          const response = await fetch(`http://${config.API_URL}/users/email/${email}`); // Updated to fetch by email
          if (!response.ok || !(localStorage.getItem('validUser') === `\"${email}\"`)) {
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
            Profile Page
          </Typography>
          <Button color="inherit" onClick={() => router.push(`/customer-home?email=${email}`)} >Home</Button>
        </Toolbar>
      </AppBar>
      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Welcome, {user.firstName}</Typography>
        <Typography variant="body1" color="text.secondary">
          This is your profile page!
        </Typography>
      </Stack>

      {/* More components such as Dialog for editing, Snackbar for notifications can be added here similar to CustomerHomePage */}
    </main>
  );
}
