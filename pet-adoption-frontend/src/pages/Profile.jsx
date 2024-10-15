import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';


export default function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();
  const { email } = router.query; // Use email from query parameters
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [currentPassword, setCurrentPassowrd] = useState(null);


  const changePassword = () => {

    console.log('LKJSDN');
    console.log(currentPassword);
    console.log(newPassword);
    

  }

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
          
          console.log(data.password);
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
      <Stack sx={{ paddingTop: 0 }} gap={2}>
      <Typography variant="h3">Welcome, {user.firstName}</Typography>
        <Typography variant="body1" color="text.secondary">
          This is your profile page!
        </Typography>
      </Stack>
      <Stack>

        <table>
          <tr>
            <th></th>
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
                    onClick={changePassword}
                  >
                    Change Password
                </Button>
              </form>
            

            </section>
            </td>

            <td> 
              <section className='square'>
              <Typography variant="h6">DELETE ACCOUNT</Typography>
                <form onSubmit={changePassword()}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    //fullWidth
                    margin="normal"
                    //value={firstName}
                    //onChange={(e) => setFirst(e.target.value)}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                </form>
              </section>

            </td>
            <td> 
              {/* <section className='square'>
              <Typography variant="h6">Change Password:</Typography>
                <form onSubmit={changePassword()}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  //fullWidth
                  margin="normal"
                  //value={firstName}
                  //onChange={(e) => setFirst(e.target.value)}
                  required
                  sx={{ borderRadius: 2 }}
                />
                </form>
              </section> */}

            </td>
        

          </tr>
       


        </table>
      
        

      </Stack>

      {/* More components such as Dialog for editing, Snackbar for notifications can be added here similar to CustomerHomePage */}
    </main>
  );
}
