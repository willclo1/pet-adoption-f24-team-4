import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, TextField, Typography, Button, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddEvent() {
  const [title, setTitle] = useState('');
  const [eventPicture, setEventPicture] = useState(null);
  {/*const [eventPictureFile, setEventPictureFile] = useState('');*/}
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const router = useRouter();
  const { adoptionID, email } = router.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${apiUrl}/events/addEvent`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({adoptionID, eventPicture, title, description, 
          location, startDateTime, endDateTime})
      });
      if (!response.ok) {
        throw new Error("Failed to submit event")
      }

      const result = await response.json();
      setMessage("Successfully added event!");
      setSuccess(true);
    } catch (error) {
      console.error("Failed to submit event: ", error);
      setMessage("Failed to submit event, please try again");
      setSuccess(false);
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventPicture(file);
    }
  };

  const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: 2,
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: 6, color: '#333', fontWeight: 500 }}>
        Add An Event
      </Typography>
      <Card
        sx={{
          width: 420,
          boxShadow: 8,
          borderRadius: 3,
          backgroundColor: '#fff',
          padding: 4,
          maxHeight: '90vh', // Ensure the card doesn't overflow the screen height
          overflow: 'auto',   // Enable scrolling if needed
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: '#1976d2' }}>
            Fill in Event Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="event-picture-upload"
              type="file"
              onChange={handlePictureChange}
            />
            <label htmlFor="event-picture-upload">
              <Button variant="contained" component="span" sx={{ marginTop: 1 }}>
                Upload Event Picture
              </Button>
            </label>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              maxRows={4}
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event event description"
              required
            />
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              margin="normal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event title"
              required
            />
            <TextField
              label="Start Date & Time"
              variant="outlined"
              fullWidth
              margin="normal"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              placeholder="YYYY-MM-DDThh:mm:ss"
              required
            />
            <TextField
              label="End Date & Time"
              variant="outlined"
              fullWidth
              margin="normal"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              placeholder="Must be of form: YYYY-MM-DDThh:mm:ss"
              required
            />
            {
              message && (
                <Alert
                  severity={ success ? "success" : "error" }
                  sx={{ marginBottom: 2 }}
                >
                  {message}
                </Alert>
              )
            }
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: 1,
                paddingY: 1.5,
                backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: 'white',
                fontWeight: 'bold',
              }}
              endIcon={<PetsIcon />}
            >
              Add Event
            </Button>
          </form>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              marginTop: 2,
              paddingY: 1.5,
              color: '#1976d2',
              fontWeight: 'bold',
            }}
            startIcon={<ArrowBackIcon/>}
            onClick={handleBack}
          >
            Back to Adoption Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}