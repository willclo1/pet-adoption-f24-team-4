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
import NavBar from './NavBar';
import { Pets } from '@mui/icons-material';

export default function RecommendationEnginePage() {
  const [state, setState] = useState({ left: false });
  const router = useRouter();
  const { email } = router.query;
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  //const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pets = [
    '/petImages/cat1.jpg',
    '/petImages/cat2.jpg',
    '/petImages/cat3.jpg',
    '/petImages/cat4.jpg',
    '/petImages/cat5.jpg',
    '/petImages/cat6.jpg',
    '/petImages/dog1.jpg',
    '/petImages/dog2.jpg',
    '/petImages/dog3.jpg',
    '/petImages/dog4.jpg',
    '/petImages/dog5.jpg'
  ]; 
  const currentPet = pets[currentIndex]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const petDetails = {
    name: "Buddy",
    breed: "Golden Retriever",
    type: "Dog",
    weight: "30 kg",
    age: "3 years",
    temperament: "Friendly",
    healthStatus: "Healthy",
    adoptionCenter: "Happy Paws Adoption Center",
  };

  // Fetch user data when page loads
  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        try {
          const response = await fetch(`${apiUrl}/users/email/${email}`);
          if (!response.ok || !(localStorage.getItem('validUser') === `\"${email}\"`)) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setUser(data);
          // Set profile picture if exists
          if (data.profilePicture && data.profilePicture.imageData) {
            setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
          }

          // Fetch pets for the user
          // const petsResponse = await fetch(`${apiUrl}/pets`);
          // if (!petsResponse.ok) {
          //   throw new Error('Network response was not ok');
          // }
          // const petsData = await petsResponse.json();
          // setPets(petsData);
        } catch (error) {
          console.error('Error fetching user:', error);
          setError('User not found.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [email]);

  // Function to handle avatar click for menu
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Open dialog for editing personal information
  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  // Close dialog for editing personal information
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfilePictureFile(null);
  };

  const handleStartMatching = () => {
    router.push(`/recommendationEngine?email=${email}`);
  };

  const handleEditPreferences = () => {
    router.push(`/EditPreferences?userId=${user.id}&email=${email}`);
  };

  const handleHomePage = () => {
    router.push(`/customer-home?email=${email}`);
  };

  const handleViewCenters = () => { 
    router.push(`/ViewCenters?email=${email}`);
  };

  const handleLoginInformation = () => {
    router.push(`/Profile?email=${email}`);
};

const logoutAction = () => {
    localStorage.setItem('validUser',JSON.stringify(null));
    router.push(`/`);
};

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>{error}</div>;
}

if (!user) {
  return <div>User not found.</div>;
}

// if (pets.length === 0) {
//   return <div>No pets available.</div>
// }

  // Handle like or dislike button
  const handleYes = () => {
    setIsLiked(true);
    handleNextPet();

    setTimeout(() => {
      setIsLiked(null);
    }, 250);
  }
  const handleNo = () => {
    setIsLiked(false);
    handleNextPet();

    setTimeout(() => {
      setIsLiked(null);
    }, 250);
  }

  const handleNextPet = () => {
    setCurrentIndex((prevIdx) => (prevIdx + 1) % pets.length);
  }

  const handlePreviousPet = () => {
    setCurrentIndex((prevIdx) => (prevIdx - 1 + pets.length) % pets.length);
  }

  // Drawer toggle logic
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.keyCode === 'Tab' || event.keyCode === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // List items for the drawer
  const list = (anchor) => (
    <Box sx={{ width: 250 }} onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
      <ListItem disablePadding>
                <ListItemButton onClick={handleHomePage}>
                <ListItemIcon>
                    <HouseIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={handleStartMatching}>
                <ListItemIcon>
                    <PetsIcon />
                </ListItemIcon>
                <ListItemText primary="Adopt" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={handleViewCenters}>
                <ListItemIcon>
                    <ContactsIcon />
                </ListItemIcon>
                <ListItemText primary="View Centers" />
                </ListItemButton>
            </ListItem>
      </List>
    </Box>
  );

  return (
    <main>
      {/* <NavBar /> */}
      <AppBar position="static">
        <Toolbar>
            <Button color='inherit' onClick={toggleDrawer('left', true)}> <MenuIcon /> </Button>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Whisker Works</Typography>
            <Button color="inherit" onClick={handleEditPreferences}>Edit Preferences</Button>
            <Avatar alt={user?.firstName} src={profilePicture} onClick={handleAvatarClick} sx={{ marginLeft: 2, width: 56, height: 56 }} />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}> {list('left')} </Drawer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleLoginInformation}>Manage My Profile</MenuItem>
        <MenuItem onClick={logoutAction}>Logout</MenuItem>
      </Menu>

      <Stack sx={{ paddingTop: 2 }} alignItems="center" gap={2}>
        <Typography variant="h3">Start Matching!</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', padding : 1 }}>
          <Card sx={{ maxWidth: 600 }}>
            <CardMedia 
            component="img" 
            alt="Pet Image" 
            height="500" width="400" 
            src={pets[currentIndex]}  // Replace with real image URL
            sx={{ objectFit: 'cover' }} />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Button size="large" color="primary" onClick={handleYes} startIcon={<CheckCircleIcon sx={{ fontSize: 60 }} />} />
              <Button size="large" color="secondary" onClick={handleNo} startIcon={<CancelIcon sx={{ fontSize: 60 }} />} />
            </CardActions>

            <Box sx={{ padding: 3}}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {petDetails.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Breed:</strong> {petDetails.breed}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Type:</strong> {petDetails.type}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Weight:</strong> {petDetails.weight}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Age:</strong> {petDetails.age}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Temperament:</strong> {petDetails.temperament}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Health Status:</strong> {petDetails.healthStatus}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                <strong>Adoption Center:</strong> {petDetails.adoptionCenter}
              </Typography>
            </Box>
          </Card>
        </Box>

        {isLiked !== null && (
          <Typography variant="h5" sx={{ marginTop:  2 }}>
            {isLiked ? "You liked this pet!" : "You disliked this pet."}
          </Typography>
        )}
      </Stack>
    </main>
  );
}