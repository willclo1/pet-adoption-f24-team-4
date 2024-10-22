import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Drawer, ListItem, List, ListItemText, ListItemButton, Box, ListItemIcon, Card, CardMedia, CardActions, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/router';
import NavBar from './nav_bar';

export default function RecommendationEnginePage() {
  const [state, setState] = useState({ left: false });
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Handle like or dislike button
  const handleYes = () => setIsLiked(true);
  const handleNo = () => setIsLiked(false);

  return (
    <main>
      <NavBar />
      <Stack sx={{ paddingTop: 5 }} alignItems="center" gap={2}>
        <Typography variant="h3">Start Matching!</Typography>
        <Typography variant="body1" color="text.secondary">Adopt Now :D</Typography>

        <Card sx={{ maxWidth: 600 }}>
          <CardMedia component="img" alt="Pet Image" height="500" width="400" sx={{ objectFit: 'cover' }} />
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Button size="large" color="primary" onClick={handleYes} startIcon={<CheckCircleIcon sx={{ fontSize: 60 }} />} />
            <Button size="large" color="secondary" onClick={handleNo} startIcon={<CancelIcon sx={{ fontSize: 60 }} />} />
          </CardActions>
        </Card>

        {isLiked !== null && (
          <Typography variant="h5" sx={{ marginTop:  2 }}>
            {isLiked ? "You liked this pet!" : "You disliked this pet."}
          </Typography>
        )}
      </Stack>
    </main>
  );
}