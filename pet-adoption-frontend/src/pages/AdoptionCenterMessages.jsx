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

export default function AdoptionCenterMessages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nonAdoptionCenterUsers, setNonAdoptionCenterUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(''); 
  const [userMessages, setUserMessages] = useState([]); 
  const [centerID, setCenterID] = useState(null);
  const [notification, setNotification] = useState(null); // State for notifications
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const selectedReceiver = nonAdoptionCenterUsers.find(user => user.id === selectedUser);
  const { email } = router.query;

  useEffect(() => {
    fetchNonAdoptionCenterUsers();
    fetchCenterID();
  }, [email]);

  // Polling for new messages every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedUser) {
        fetchMessagesForUser(selectedUser); // Check for new messages
      }
    }, 120000); // Adjust the interval as needed

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [selectedUser]);

  // Fetch non-adoption center users
  const fetchNonAdoptionCenterUsers = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/non-adoption-center`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNonAdoptionCenterUsers(data);
        } else {
          console.error("Error fetching non-adoption center users:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch non-adoption center users:", error);
      }
    }
  };

  const fetchCenterID = async () => {
    const token = localStorage.getItem('token');
    if (token && email) {
      try {
        const response = await fetch(`${apiUrl}/users/adoption-center/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCenterID(data);
        } else {
          console.error("Center not found for the provided email.");
        }
      } catch (error) {
        console.error("Failed to fetch center ID:", error);
      }
    }
  };

  const fetchMessagesForUser = async (userId) => {
    const token = localStorage.getItem('token');
    if (token && centerID) {
      try {
        const response = await fetch(`${apiUrl}/user-messages/adoption-center/${centerID}/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserMessages(data);

          // Check if new messages are received and trigger a notification
          const newMessage = data[data.length - 1];
          if (newMessage && newMessage.senderID !== centerID) {
            setNotification(`New message from user: ${newMessage.content}`);
          }
        } else {
          console.error("Error fetching messages for user:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch messages for user:", error);
      }
    }
  };

  const handleSendMessage = async () => {
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
            senderID: Number(centerID),
            receiverID: Number(selectedUser),
            senderName: "Adoption Center",
            receiverName: `${selectedReceiver.firstName} ${selectedReceiver.lastName}`
          })
        });
        if (response.ok) {
          setNewMessage('');
          fetchMessagesForUser(selectedUser);
        } else {
          console.error("Error sending message:", response.status);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  // Handle selection of a non-adoption center user
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    fetchMessagesForUser(userId); // Fetch messages for the selected user
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null); // Close the notification
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Paper elevation={3} style={{ maxWidth: 500, width: '100%', padding: 16 }}>
        <Typography variant="h6" gutterBottom>
          Messages with User
        </Typography>
        
        {/* Non-Adoption Center User Selection */}
        <FormControl fullWidth style={{ marginBottom: 16 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => handleUserSelect(e.target.value)}
            fullWidth
          >
            {nonAdoptionCenterUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Messages */}
        <List style={{ maxHeight: 300, overflow: 'auto' }}>
          {userMessages.map((message) => {
            const isSenderCenter = message.senderID === centerID;
            return (
              <div key={message.id}>
                {/* Render "User" or "Adoption Center" as a heading */}
                {isSenderCenter ? (
                  <Typography variant="subtitle1" style={{ margin: '8px 0', fontWeight: 'bold' }}>
                    Adoption Center
                  </Typography>
                ) : (
                  <Typography variant="subtitle1" style={{ margin: '8px 0', fontWeight: 'bold' }}>
                    User
                  </Typography>
                )}

                {/* Message Content */}
                <ListItem>
                  <ListItemText
                    primary={<strong>{isSenderCenter ? 'You' : message.senderName}</strong>}
                    secondary={message.content}
                  />
                </ListItem>
              </div>
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