import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/router';

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adoptionCenters, setAdoptionCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [centerMessages, setCenterMessages] = useState([]); // State for messages from the selected center
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [notification, setNotification] = useState(null); // Notification state
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    fetchAdoptionCenters();
    fetchUserID();
  }, [email]);

  // Polling for new messages every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedCenter) {
        fetchMessagesForCenter(selectedCenter); // Check for new messages
      }
    }, 120000); // Adjust the interval as needed

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [selectedCenter]);

  // Fetch adoption centers
  const fetchAdoptionCenters = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/adoption-centers`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAdoptionCenters(data);
        } else {
          console.error("Error fetching adoption centers:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch adoption centers:", error);
      }
    }
  };

  // Fetch user ID based on email
  const fetchUserID = async () => {
    const token = localStorage.getItem('token');
    if (token && email) {
      try {
        const response = await fetch(`${apiUrl}/users/email/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserID(data.id);
          setUserName(data.firstName);
        } else {
          console.error("User not found for the provided email.");
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    }
  };

  // Fetch messages from the selected adoption center
  const fetchMessagesForCenter = async (centerId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/user-messages/adoption-center/${centerId}/user/${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCenterMessages(data); // Set messages from the selected center

          // Check if new messages are received and trigger a notification
          const newMessage = data[data.length - 1];
          if (newMessage && newMessage.senderID !== userID) {
            setNotification(`New message from Adoption Center: ${newMessage.content}`);
          }
        } else {
          console.error("Error fetching messages for center:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch messages for center:", error);
      }
    }
  };

  // Handle sending a new message from the user to the adoption center
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedCenter || !userID) return;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/user-messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: newMessage,
            senderID: userID,  // Send the user ID
            receiverID: selectedCenter  // Send the selected adoption center ID
          })
        });
        if (response.ok) {
          setNewMessage(''); // Clear the input after sending
          fetchMessagesForCenter(selectedCenter); // Refresh messages for the selected center
        } else {
          console.error("Error sending message:", response.status);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  // Handle selection of adoption center
  const handleCenterSelect = (centerId) => {
    setSelectedCenter(centerId);
    fetchMessagesForCenter(centerId); // Fetch messages for the selected center
  };

  const handleCloseNotification = () => {
    setNotification(null); // Close the notification
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Paper elevation={3} style={{ maxWidth: 500, width: '100%', padding: 16 }}>
        <Typography variant="h6" gutterBottom>
          Messages with Adoption Center
        </Typography>
        
        {/* Adoption Center Selection */}
        <FormControl fullWidth style={{ marginBottom: 16 }}>
          <InputLabel>Select Adoption Center</InputLabel>
          <Select
            value={selectedCenter}
            onChange={(e) => handleCenterSelect(e.target.value)}
            fullWidth
          >
            {adoptionCenters.map((center) => (
              <MenuItem key={center.adoptionID} value={center.adoptionID}>
                {center.centerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Messages from the selected center */}
        <List style={{ maxHeight: 300, overflow: 'auto' }}>
          {centerMessages.map((message) => {
            const isFromUser = message.senderID === userID;
            return (
              <ListItem key={message.id}>
                <ListItemText
                  primary={<strong>{isFromUser ? 'You' : 'Adoption Center'}</strong>}
                  secondary={message.content}
                />
              </ListItem>
            );
          })}
        </List>

        {/* Message Input and Send Button */}
        <Box mt={2} display="flex" alignItems="center">
          <TextField
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: 8 }}>
            Send
          </Button>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        message={notification}
      />
    </Box>
  );
}