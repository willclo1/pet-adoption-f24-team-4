import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Button, Paper, Divider } from '@mui/material';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';

export default function CustomerHomePage() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { email } = router.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          console.log(token);
          const response = await fetch(`${apiUrl}/users/email/${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch user');
          const data = await response.json();
          setUser(data);
          localStorage.setItem('id', data.id)
          if (data.profilePicture && data.profilePicture.imageData) {
            setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
          }
        } catch (error) {
          setError('User not found.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [email]);

  const handleMessage = () => {
    router.push(`/message?email=${email}&userID=${user?.id}`);
  };

  const handleViewEvents = () => {
    router.push(`/viewEvents?email=${email}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <main>
      <NavBar />
      <Stack sx={{ paddingTop: 8, maxWidth: 600, margin: '0 auto', gap: 3 }} alignItems="center">
        
        {/* Welcome Section */}
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>Welcome, {user.firstName}</Typography>
          <Typography variant="body1" color="text.secondary">
            Explore your account features below!
          </Typography>
        </Paper>

        {/* Actions Section */}
        <Stack direction="column" spacing={3} sx={{ width: '100%' }}>
          
          {/* Messages Box */}
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Messages</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
              Stay connected with the adoption center!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleMessage} fullWidth>
              View Messages
            </Button>
          </Paper>

          {/* Divider between sections */}
          <Divider sx={{ marginY: 2 }} />

          {/* Events Box */}
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
              Discover and join events at adoption centers.
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleViewEvents} fullWidth>
              View Events
            </Button>
          </Paper>
        </Stack>
      </Stack>
    </main>
  );
}