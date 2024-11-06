import React, { useEffect, useState } from 'react';
import {
  DialogActions,
  TextField,
  DialogContent,
  Dialog,
  DialogTitle,
  ListItemSecondaryAction,
  Button,
  Divider,
  Paper,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/router';

export default function ModifyEvent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [eventPicture, setEventPicture] = useState(null);
  const { adoptionID, email } = router.query;
  const [openDialog, setOpenDialog] = useState(false);

  // Retrieve the Bearer token (assuming it's stored in localStorage or context)
  const token = localStorage.getItem('token'); // Adjust this based on your token storage

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log(`${apiUrl}/events/adoption-center/${adoptionID}`);
        const response = await fetch(`${apiUrl}/events/adoption-center/${adoptionID}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include Bearer token here
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
        console.log("Successfully fetched events");
      } catch (error) {
        console.error("Failed to fetch events");
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [adoptionID, apiUrl, token]);

  const handleDelete = async (eventID) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`${apiUrl}/events/deleteEvent/${eventID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Include Bearer token here
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: eventID })
        });

        if (!response.ok) {
          throw new Error("Failed to delete the event.");
        }

        setEvents((prevEvents) => prevEvents.filter(event => event.eventID !== eventID));
      } catch (error) {
        console.error("Error deleting event: ", error);
        setError("Failed to delete the event.");
      }
    }
  };

  const handleEventPictureChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setEventPicture(file);
    } else {
      console.log("Picture not present(?)");
    }
  };

  const handleSaveEvent = async (eventID) => {
    const formData = new FormData();
    formData.append('image', eventPicture);
    console.log(`Event id: ${eventID}`);
    try {
      const response = await fetch(`${apiUrl}/event/event-image/${eventID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Include Bearer token here
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to upload event image");
      } else {
        console.log("Event image saved successfully");
      }

      const updatedResponse = await fetch(`${apiUrl}/events/adoption-center/${adoptionID}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include Bearer token here
          'Content-Type': 'application/json'
        }
      });

      const updatedEvents = await updatedResponse.json();
      console.log("Received updated list of events");

      if (updatedResponse.ok) {
        setEvents(updatedEvents);
      } else {
        console.log("Failure to get list of events");
      }
    } catch (error) {
      console.error("Failed to upload Event picture: ", error);
    }
  };

  const handleModifyEvent = async () => {
    if (window.confirm("Are you sure you want to modify this event?")) {
      try {
        const response = await fetch(`${apiUrl}/events/updateEvent`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`, // Include Bearer token here
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedEvent)
        });

        if (!response.ok) {
          throw new Error("Failed to modify event.");
        }

        setEvents((prevEvents) =>
          prevEvents.map((event) => 
            (event.id === selectedEvent.eventID ? 
              { ...event, ...selectedEvent } : event))
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Failed to modify event: ", error);
        setError("Failed to modify event.");
      }
    }
  };

  const handleBack = () => {
    router.push(`/adoptionHome?email=${email}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: 4, paddingX: 4 }}>
      {/* Header for page */}
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
        Modify Events
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
        {/* List of events */}
        <List>
          {
            events && events.length > 0 ? (
              events.map((event) => (
                <React.Fragment key={event.eventID}>
                  <ListItem sx={{ padding: 2 }}>
                    <ListItemText sx={{ padding: 2 }}
                      primary={`${event.title}`}
                      secondary={`Start: ${event.startDateTime}, End: ${event.endDateTime}`}
                      primaryTypographyProps={{ variant: 'h6', color: '#333' }}
                      secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                    />
                    <Avatar
                      src={
                        event.eventPicture && event.eventPicture.imageData ?
                          `data:image/png;base64,${event.eventPicture.imageData}` : 
                          null
                      }
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 0
                      }}
                    />
                    <input
                      accepts="image/*"
                      style={{ display: 'none' }}
                      id="event-picture-upload"
                      type="file"
                      onChange={ 
                        (e) => handleEventPictureChange(e, event)
                      }
                    />
                    <label>
                      <Button
                        variant="contained" 
                        component="span"
                        sx={{
                          marginTop: 1,
                          paddingY: 0,
                          backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        Upload Event Photo
                      </Button>
                    </label>
                    <Button 
                      variant="contained"
                      component="span" 
                      sx={{
                        marginTop: 1,
                        paddingY: 0,
                        backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                      onClick={ () => handleSaveEvent(event.eventID)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => {
                        setSelectedEvent(event);
                        setOpenDialog(true);
                      }}
                    >
                      Modify
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={ () => handleDelete(event.eventID) }
                    >
                      Delete
                    </Button>
                  </ListItem>
                  <Divider/>
                </React.Fragment>
              ))) 
              : 
              (
                <Typography sx={{ padding: 2, color: 'textSecondary' }}>
                  No events found for this adoption center.
                </Typography>
              )
          }
        </List>
      </Paper>

      {/* Back button */}
      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#1976d2' }}
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>

      {/* Modifying event dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        sx={{ overflow: 'visible', padding: 3 }}
      >
        <DialogTitle>
          Modify Event
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: '300px',
            paddingY: 1
          }}
        >
          <TextField
            label="Title"
            value={selectedEvent?.title || ''}
            onChange={ (e) => setSelectedEvent({ ...selectedEvent, title: e.target.value }) }
            fullWidth
            variant="outlined"
            color="primary"
          />
          <TextField
            label="Description"
            value={selectedEvent?.description || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            color="primary"
          />
          <TextField
            label="Location"
            value={selectedEvent?.location || ''}
            onChange={ (e) => setSelectedEvent({ 
              ...selectedEvent, 
              location: e.target.value 
            })}
            fullWidth
            variant="outlined"
            color="primary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleModifyEvent} variant="contained" color="primary">
            Modify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}