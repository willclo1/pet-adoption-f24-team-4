import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { red } from '@mui/material/colors';
import { ClosedCaptionDisabledSharp, MarkEmailUnread } from '@mui/icons-material';
import NavBar from '@/components/NavBar'

export default function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();
  const { email } = router.query; // Use email from query parameters
 
  const [user, setUser] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [currentPassword, setCurrentPassowrd] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [passwordMessgae,setPasswordMessage] = useState('');
  const [passColor, setPassColor] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


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
      const response = await fetch(`${apiUrl}/profile`, {
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
    console.log(password);
    console.log(newPassword);
    console.log(`${apiUrl}/profile`);
    console.log(email);


    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: email, password: currentPassword }),
      });
      console.log('WE ETNERED');
      console.log(email);
      console.log(currentPassword);


      console.log(`${apiUrl}/login`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.log('aw man :(')
        console.log(errorMessage);
        //setIsSuccess(false);
        //setMessage(errorMessage); // Display error message from backend
        //setTokenStored(false); // Reset token stored status
        return;
      }

      const result = await response.json();


      localStorage.setItem('token', result.token);
    

  // Check if token exists in the response
  //if (result.token) {

    if (result.token && newPassword) {
        setPassword(newPassword);
        console.log('Your new Password is: ' + newPassword);
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            
            const response = await fetch(`${apiUrl}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add token to headers
                },
                body: JSON.stringify({ email: email, password: newPassword }),
            });

            if (!response.ok) {
                throw new Error("Bad network response");
            }
            const result = await response.json();

            if (response.status === 200) {
                setPassColor('green');
                setPasswordMessage('Password Successfully Changed');
                console.log('WE LIKE FOTNITE');
            }
        } catch (error) {
            console.error("Error changing password: ", error);
            setPassColor('red');
            setPasswordMessage('Error changing password');
        }
    } else {
        setPassColor('red');
        setPasswordMessage('Please Enter the Correct Password');
    }

  }catch (error) {
    console.error("Error logging in: ", error);
    setMessage("Login failed. Please try again.");
    setIsSuccess(false);
    setTokenStored(false); // Reset token stored status
  }
};

  const handleSave = async () => {
    console.log('WEHIWRIF');
    
    if (profilePictureFile) {
        const formData = new FormData();
        formData.append('image', profilePictureFile);
        
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            
            const response = await fetch(`${apiUrl}/user/profile-image/${email}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to the headers
                },
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            // Fetch the updated user data after the image upload
            const userResponse = await fetch(`${apiUrl}/users/email/${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token for the GET request
                    'Content-Type': 'application/json',
                },
            });

            // Get the updated user data
            const updatedUser = await userResponse.json();
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
            const token = localStorage.getItem('token'); // Get the token from local storage
            try {
                const response = await fetch(`${apiUrl}/users/email/${email}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the token in the headers
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Bearer ${token}`);
                console.log(`${apiUrl}/profile`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUser(data); // Set the user data

                if (data.profilePicture && data.profilePicture.imageData) {
                    setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
                }
                setPassword(data.password);
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
      <NavBar />
      <Stack sx={{ paddingTop: 0 }} gap={2}>
      <Typography variant="h6" component='span' gutterBottom sx={{ fontWeight: 'bold', color: '#black' }}>
        Account Info
        </Typography>
        <Typography variant="h6" component='span' gutterBottom sx={{  color: '#Black' }}>
        First name: {user.firstName} 
        </Typography>
        <Typography variant="h6" component='span' gutterBottom sx={{ color: '#Black' }}>
        Last name: {user.lastName} 
        </Typography>
      <Typography variant="h6" component='span' gutterBottom sx={{  color: 'black' }}>
        Email Address: {user.emailAddress}
        </Typography>
      </Stack>
      <Stack>

        <table>
          
          <tr>
            <td >
            <section className='square'>
              <Typography variant="h6">Change Password:</Typography>
              <form>
                <TextField
                  label="Current Password"
                  variant="outlined"
                  //fullWidth
                  margin="normal"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassowrd(e.target.value)}
                  required
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="New Password"
                  
                  variant="outlined"
                  //fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  sx={{ borderRadius: 2 }}
                />
                <Button
                  onClick={changePassword}
                  //type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                      marginBottom:0,
                      paddingY: 1.5,
                      borderRadius: 2.5,
                      marginLeft: 0,
                      backgroundColor: '#1976d2',
                      '&:hover': {
                          backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    Change Password
                </Button>
                
              </form>
              <Typography sx={{color: `${passColor}`,fontSize: 18 }}>{passwordMessgae}</Typography>
    

            </section>
            </td>

            <td> 
              <section className='square'>
                <Button
                  onClick={deleteAccount}
                  //type="submit"
                  variant="contained"
                  fullWidth
                  fullHeight
                  sx={{
                      marginBottom:0.5,
                      paddingY: 0,
                      borderRadius: 1.5,
                      marginLeft: 0,
                      backgroundColor: 'red',
                      '&:hover': {
                          backgroundColor: 'darkRed',
                      },
                    }}
                  >
                      DELETE ACCOUNT
                </Button>
              </section>

            </td>
            <td> 
              <section className='square'>
              <Typography variant="h6">Change Profile Picture:</Typography>
               <Stack marginTop={2}>
               <Avatar
                  src={profilePicture} // Use the uploaded profile picture here
                  sx={{ marginLeft: 7
                    , width: 225
                    , height: 225 }}
            />
            <Typography variant="body1">Profile Picture</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button variant="contained" component="span" >
                Upload Profile Picture
              </Button>
            

              <Button onClick={handleSave} color="primary">
            Save
          </Button>
          </label>
          </Stack>


              </section> 

            </td>
        

          </tr>
       


        </table>
      
        

      </Stack>

      {/* More components such as Dialog for editing, Snackbar for notifications can be added here similar to CustomerHomePage */}
    </main>
  );
}
