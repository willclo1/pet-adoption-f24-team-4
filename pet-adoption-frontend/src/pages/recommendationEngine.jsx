import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';

export default function recommendationEnginePage() {

    //const { email } = router.query; // Use email from query parameters
    //const [user, setUser] = useState(null);
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //       if (email) {
    //         try {
    //           const response = await fetch(`http://localhost:8080/users/email/${email}`); // Updated to fetch by email
    //           if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //           }
    //           const data = await response.json();
    //           setUser(data); // Set the user data
    //         } catch (error) {
    //           console.error('Error fetching user:', error);
    //           setError('User not found.'); // Update error state
    //         } finally {
    //           setLoading(false); // Loading is done
    //         }
    //       }
    //     };
    //     fetchUser();
    // }, [email]);

    // if (loading) {
    //     return <div>Loading...</div>; // Show a loading message while fetching
    // }
  
    // if (error) {
    //   return <div>{error}</div>; // Show the error message if there's an error
    // }
  
    // if (!user) {
    //   return <div>User not found.</div>; // Show a fallback if user data isn't available
    // }

    return (
        <main>
            <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>

        </Toolbar>
      </AppBar>
      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Start Matching!</Typography>
        <Typography variant="body1" color="text.secondary">
          Adopt Now :D
        </Typography>
      </Stack>
        </main>
    );
}