import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
} from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';

export default function Message() {
  const [inbox, setInbox] = useState([]);
  const [thread, setThread] = useState([]);
  const [adoptionCenters, setAdoptionCenters] = useState([]);
  const [centerName, setCenterName] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (router.isReady) {
      const { userID, centerName } = router.query;
      if (userID) {
        setUserId(userID);
        fetchUserDetails(userID); // Fetch user details on load
      }
      if (centerName) {
        setCenterName(centerName);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (userId) {
      fetchAdoptionCenters();
    }
  }, [userId]);

  useEffect(() => {
    if (adoptionCenters.length > 0 && userId) {
      fetchInbox();
    }
  }, [adoptionCenters]);

  useEffect(() => {
    if (centerName && adoptionCenters.length > 0) {
      const matchingCenter = adoptionCenters.find(
        (center) => center.centerName.toLowerCase() === centerName.toLowerCase()
      );
      if (matchingCenter) {
        setSelectedCenter(matchingCenter.adoptionID);
      }
    }
  }, [centerName, adoptionCenters]);

  const fetchUserDetails = async (userId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const user = await response.json();
          setSenderName(`${user.firstName} ${user.lastName}`);
        } else {
          console.error('Failed to fetch user details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  const fetchAdoptionCenters = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/adoption-centers`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAdoptionCenters(data);
        } else {
          console.error('Error fetching adoption centers:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch adoption centers:', error);
      }
    }
  };

  const fetchInbox = async () => {
    const token = localStorage.getItem('token');
    if (token && userId) {
      try {
        const response = await fetch(`${apiUrl}/user-messages/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const messages = await response.json();
          const grouped = groupMessagesByCenter(messages);
          setInbox(grouped);
          const latestMessages = grouped.map((center) => center.latestMessage);
          if (latestMessages.some((msg) => msg && msg.isNew)) {
            setNotification('You have new messages!');
          }
        } else {
          console.error('Error fetching inbox');
        }
      } catch (error) {
        console.error('Failed to fetch inbox:', error);
      }
    }
  };

  const groupMessagesByCenter = (messages) => {
    const grouped = messages.reduce((acc, message) => {
      const centerId = message.senderID !== parseInt(userId) ? message.senderID : message.receiverID;
      if (!acc[centerId]) acc[centerId] = [];
      acc[centerId].push(message);
      return acc;
    }, {});

    return Object.entries(grouped).map(([centerId, msgs]) => {
      const centerName =
        adoptionCenters.find((center) => center.adoptionID === parseInt(centerId))?.centerName ||
        'Unknown Center';
      return {
        centerId,
        messages: msgs,
        centerName,
        latestMessage: msgs[msgs.length - 1],
      };
    });
  };

  const fetchThread = (centerId) => {
    setThread([]);
    const center = inbox.find((c) => c.centerId === centerId);
    setThread(center ? center.messages : []);
    setSelectedCenter(centerId);
  };

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    if (token && selectedCenter && newMessage) {
      try {
        const response = await fetch(`${apiUrl}/user-messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            senderID: parseInt(userId),
            receiverID: parseInt(selectedCenter),
            senderName,
          }),
        });
        if (response.ok) {
          setNewMessage('');
          fetchInbox();
          fetchThread(selectedCenter);
        } else {
          console.error('Error sending message');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleCloseNotification = () => setNotification(null);

  return (
    <main>
      <NavBar />
      <Box display="flex" p={3}>
        <Paper elevation={3} sx={{ width: '30%', mr: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Inbox
          </Typography>
          <List>
            {inbox.map((center) => (
              <ListItem
                button
                key={center.centerId}
                onClick={() => fetchThread(center.centerId)}
              >
                <ListItemText
                  primary={center.centerName}
                  secondary={center.latestMessage.content}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
          {thread.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                Conversation with {inbox.find((c) => c.centerId === selectedCenter)?.centerName}
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                {thread.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      alignSelf: message.senderID === parseInt(userId) ? 'flex-end' : 'flex-start',
                      bgcolor: message.senderID === parseInt(userId) ? 'primary.light' : 'grey.200',
                      borderRadius: 2,
                      mb: 1,
                      px: 2,
                      py: 1,
                    }}
                  >
                    <ListItemText
                      primary={message.content}
                      secondary={
                        message.senderID === parseInt(userId)
                          ? `${senderName}`
                          : `From ${adoptionCenters.find((center) => center.adoptionID === message.senderID)?.centerName || 'Unknown Center'}`
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="h6" color="textSecondary">
              Select a conversation to view messages
            </Typography>
          )}

          <Box mt={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Adoption Center</InputLabel>
              <Select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                fullWidth
              >
                {adoptionCenters.map((center) => (
                  <MenuItem key={center.adoptionID} value={center.adoptionID}>
                    {center.centerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={sendMessage}>
              Send
            </Button>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        message={notification}
      />
    </main>
  );
}