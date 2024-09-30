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
      <AppBar position = "static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button  color="inherit">
            Edit Preferences
          </Button>
          <Button  color="inherit">
            Adopt a Pet
          </Button>
    
          <Avatar alt="User Name" sx={{ marginLeft: 2 }} />
        </Toolbar>
      </AppBar>
      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Welcome, {user.firstName}</Typography>
        <Typography variant="body1" color="text.secondary">
          Check out the home page!
        </Typography>
      </Stack>
    </main>
   
  );
}

