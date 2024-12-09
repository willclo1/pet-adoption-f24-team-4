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
import AdoptionNavBar from '@/components/AdoptionNavBar';
import { useRouter } from 'next/router';

export default function AdoptionCenterMessages() {
  const [inbox, setInbox] = useState([]);
  const [thread, setThread] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [centerID, setCenterID] = useState();
  const [centerName, setCenterName] = useState('');
  const [notification, setNotification] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    if (router.isReady && email) {
      fetchCenterDetails();
    }
  }, [router.isReady, email]);

  useEffect(() => {
    if (centerID) {
      fetchUsers();
    }
  }, [centerID]);

  useEffect(() => {
    if (centerID && users.length > 0) {
      fetchInbox();
    }
  }, [centerID, users]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedUser) {
        fetchThread(selectedUser);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedUser]);

  const fetchCenterDetails = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const responseForID = await fetch(`${apiUrl}/users/adoption-center/${email}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (responseForID.ok) {
          const centerID = await responseForID.json();
          console.log(centerID)
          const responseForDetails = await fetch(`${apiUrl}/adoption-centers/${centerID}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (responseForDetails.ok) {
            const centerDetails = await responseForDetails.json();
            setCenterID(centerDetails.adoptionID);
            setCenterName(centerDetails.centerName);
          } else {
            console.error('Failed to fetch adoption center details.');
          }
        } else {
          console.error('Failed to fetch adoption center ID.');
        }
      } catch (error) {
        console.error('Error fetching center details:', error);
      }
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/non-adoption-center`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }
  };

  const fetchInbox = async () => {
    const token = localStorage.getItem('token');
    if (token && centerID) {
      try {
        const response = await fetch(`${apiUrl}/user-messages/adoption-center/${centerID}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const messages = await response.json();
          const grouped = groupMessagesByUser(messages);
          setInbox(grouped);
        } else {
          console.error('Error fetching inbox');
        }
      } catch (error) {
        console.error('Failed to fetch inbox:', error);
      }
    }
  };

  const groupMessagesByUser = (messages) => {
    const grouped = messages.reduce((acc, message) => {
      const userId = message.senderID !== centerID ? message.senderID : message.receiverID;
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(message);
      return acc;
    }, {});

    return Object.entries(grouped).map(([userId, msgs]) => {
      const user = users.find((u) => u.id === parseInt(userId)) || {};
      return {
        userId,
        messages: msgs,
        userName: `${user.firstName || 'Unknown'} ${user.lastName || ''}`.trim(),
        latestMessage: msgs[msgs.length - 1],
      };
    });
  };

  const fetchThread = (userId) => {
    const user = inbox.find((u) => u.userId === userId);
    setThread(user ? user.messages : []);
    setSelectedUser(userId);
  };

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    if (token && selectedUser && newMessage.trim()) {
      try {
        const response = await fetch(`${apiUrl}/user-messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            senderID: centerID,
            receiverID: selectedUser,
            senderName: centerName,
          }),
        });
        if (response.ok) {
          setNewMessage('');
          fetchThread(selectedUser);
          fetchInbox();
        } else {
          console.error('Error sending message:', response.status);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleCloseNotification = () => setNotification(null);

  return (
    <main>
    <AdoptionNavBar/>
    <Box display="flex" p={3}>
      <Paper elevation={3} sx={{ width: '30%', mr: 2, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Inbox
        </Typography>
        <List>
          {inbox.map((user) => (
            <ListItem
              button
              key={user.userId}
              onClick={() => fetchThread(user.userId)}
            >
              <ListItemText
                primary={user.userName}
                secondary={user.latestMessage?.content || ''}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Conversation with {inbox.find((u) => u.userId === selectedUser)?.userName || 'Unknown User'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              fetchThread(e.target.value);
            }}
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          {thread.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                alignSelf: message.senderID === centerID ? 'flex-end' : 'flex-start',
                bgcolor: message.senderID === centerID ? 'primary.light' : 'grey.200',
                borderRadius: 2,
                mb: 1,
                px: 2,
                py: 1,
                maxWidth: '80%',
              }}
            >
              <ListItemText
                primary={message.content}
                secondary={
                  message.senderID === centerID
                    ? centerName
                    : `${users.find((u) => u.id === message.senderID)?.firstName || 'User'} ${
                        users.find((u) => u.id === message.senderID)?.lastName || ''
                      }`.trim()
                }
              />
            </ListItem>
          ))}
        </List>
        <Box mt={2}>
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
  </main>
  );
}