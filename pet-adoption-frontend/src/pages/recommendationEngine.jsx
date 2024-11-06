import React, { useEffect, useState } from 'react';
import { Stack, Typography, Button, Box, Card, CardMedia, CardActions, Drawer } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';

export default function RecommendationEnginePage() {
  //const [state, setState] = useState({ left: false });
  const router = useRouter();
  const { email } = router.query;
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  //const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
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
  const petDetails = [

  ]
  const currentPet = pets[currentIndex]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (router.isReady) {
      if (email) {
        setUserEmail(email);
        fetchUserData(email);
      }
    }
  }, [router.isReady, router.query]);

  // Function to fetch user data (including profile picture)
  const fetchUserData = async (email) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await fetch(`${apiUrl}/users/email/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUser(data);
      if (data.profilePicture && data.profilePicture.imageData) {
        setProfilePicture(`data:image/png;base64,${data.profilePicture.imageData}`);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

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

  // Handle file upload for profile picture
  const handlePfFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };

  // Save the profile picture to the backend
  const handleSave = async () => {
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append('image', profilePictureFile);

      try {
        const response = await fetch(`${apiUrl}/user/profile-image/${userEmail}`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const updatedUser = await response.json();
        setProfilePicture(`data:image/png;base64,${updatedUser.profilePicture.imageData}`);
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
    handleCloseDialog();
  };

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

  return (
    <main>
      <NavBar user={user} profilePicture={profilePicture} email={email} />
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